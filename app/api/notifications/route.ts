import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// ✅ FIXED: Improved phone number formatting
function formatPhoneNumber(phone: string | null | undefined): string | null {
  if (!phone) return null

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')

  // ✅ More lenient validation (8-15 digits)
  if (cleaned.length < 8 || cleaned.length > 15) {
    console.error('Invalid phone number length:', cleaned.length, 'for', phone)
    return null
  }

  // Normalize to Indonesian international format (no "+")
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.substring(1)
  }
  if (cleaned.startsWith('62')) {
    return cleaned
  }
  if (cleaned.startsWith('8')) {
    return '62' + cleaned
  }

  console.error('Invalid phone number format after cleaning:', cleaned)
  return null
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, tenantId, paymentId, reason } = body ?? {}

    console.log('📨 Notification request received:', { type, tenantId, paymentId })

    // Basic validation
    if (!type || !tenantId || !paymentId) {
      console.error('❌ Missing required fields')
      return NextResponse.json({ error: "Missing required fields (type, tenantId, paymentId)" }, { status: 400 })
    }

    // Accept only known types
    const allowedTypes = ["payment_approved", "payment_rejected"]
    if (!allowedTypes.includes(type)) {
      console.error('❌ Invalid notification type:', type)
      return NextResponse.json({ error: "Invalid notification type" }, { status: 400 })
    }

    // ✅ FIXED: Added await for createClient
    const supabase = await createClient()

    // Get tenant info
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("id, name, phone, email")
      .eq("id", tenantId)
      .single()

    if (tenantError || !tenant) {
      console.error('❌ Tenant not found:', tenantError)
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    console.log('👤 Tenant found:', {
      name: tenant.name,
      phone: tenant.phone,
      email: tenant.email
    })

    // Get payment info
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("id, amount, due_date, notification_sent")
      .eq("id", paymentId)
      .single()

    if (paymentError || !payment) {
      console.error('❌ Payment not found:', paymentError)
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    const amount = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(payment.amount ?? 0)

    let subject = ""
    let message = ""

    if (type === "payment_approved") {
      subject = "Pembayaran Anda Telah Diterima"
      message = `Halo ${tenant.name},

Pembayaran Anda telah diverifikasi dan diterima.

Detail Pembayaran:
- Jumlah: ${amount}
- Status: LUNAS

Terima kasih telah melakukan pembayaran tepat waktu.

- KostManager`
    } else if (type === "payment_rejected") {
      subject = "Bukti Pembayaran Ditolak"
      message = `Halo ${tenant.name},

Mohon maaf, bukti pembayaran Anda tidak dapat diverifikasi.

Detail:
- Jumlah: ${amount}
- Status: DITOLAK
- Alasan: ${reason || "Bukti pembayaran tidak valid"}

Silakan upload ulang bukti pembayaran yang valid melalui website kami.

- KostManager`
    }

    let notificationSent = false
    let notificationError: string | null = null
    let notificationMethod: "whatsapp" | "email" | null = null

    // Validate and format phone number
    const formattedPhone = formatPhoneNumber(tenant.phone ?? '')

    console.log('📱 Phone validation:', {
      original: tenant.phone,
      formatted: formattedPhone,
      hasFonnteKey: !!process.env.FONNTE_API_KEY
    })

    // Try WhatsApp first (Fonnte)
    if (formattedPhone && process.env.FONNTE_API_KEY) {
      try {
        console.log('📤 Attempting WhatsApp send to:', formattedPhone)

        const fonnteResponse = await fetch("https://api.fonnte.com/send", {
          method: "POST",
          headers: {
            Authorization: process.env.FONNTE_API_KEY as string,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            target: formattedPhone,
            message,
            countryCode: "62",
          }),
        })

        const result = await fonnteResponse.json().catch(() => ({}))

        console.log('📬 Fonnte API response:', {
          status: fonnteResponse.status,
          ok: fonnteResponse.ok,
          body: result
        })

        if (fonnteResponse.ok && (result.status === true || result.success === true)) {
          notificationSent = true
          notificationMethod = 'whatsapp'
          console.log('✅ WhatsApp sent successfully')
        } else {
          notificationError = result.reason || result.message || JSON.stringify(result)
          console.error('❌ Fonnte returned error:', notificationError)
        }
      } catch (e) {
        notificationError = e instanceof Error ? e.message : "WhatsApp notification exception"
        console.error("❌ WhatsApp exception:", e)
      }
    } else {
      const reasonMsg = !formattedPhone ? 'Invalid or missing phone number' : 'Fonnte API key not configured'
      console.log('⚠️ WhatsApp skipped:', reasonMsg)
      notificationError = notificationError ?? reasonMsg
    }

    // Fallback to email if WhatsApp fails
    if (!notificationSent && tenant.email && process.env.RESEND_API_KEY) {
      try {
        console.log('📤 Attempting email send to:', tenant.email)

        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "onboarding@resend.dev",
            to: tenant.email,
            subject,
            text: message,
          }),
        })

        const result = await emailResponse.json().catch(() => ({}))

        console.log('📬 Resend API response:', {
          status: emailResponse.status,
          ok: emailResponse.ok,
          body: result
        })

        if (emailResponse.ok && result.id) {
          notificationSent = true
          notificationMethod = 'email'
          notificationError = null
          console.log('✅ Email sent successfully:', result.id)
        } else {
          notificationError = result.message || JSON.stringify(result)
          console.error('❌ Resend/email error:', notificationError)
        }
      } catch (e) {
        notificationError = e instanceof Error ? e.message : "Email notification exception"
        console.error("❌ Email exception:", e)
      }
    } else if (!notificationSent) {
      const skipped = !tenant.email ? 'No email address' : 'Resend API key not configured'
      console.log('⚠️ Email fallback skipped:', skipped)
    }

    // Mark notification as sent in DB only if it actually succeeded
    if (notificationSent) {
      const { error: updateErr } = await supabase
        .from("payments")
        .update({ notification_sent: true, updated_at: new Date().toISOString() })
        .eq("id", paymentId)

      if (updateErr) {
        console.error('❌ Failed to mark notification_sent in DB:', updateErr)
      } else {
        console.log('✅ Payment marked as notification_sent in DB')
      }
    }

    return NextResponse.json({
      success: notificationSent,
      notificationMethod,
      notificationError,
      tenant: tenant.name,
      type,
      phone: formattedPhone,
      email: tenant.email,
      message: notificationSent
        ? `Notification sent successfully via ${notificationMethod}`
        : `Notification failed: ${notificationError || "Unknown error"}`,
    })
  } catch (error) {
    console.error("❌ Notification API error:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        success: false,
      },
      { status: 500 }
    )
  }
}
