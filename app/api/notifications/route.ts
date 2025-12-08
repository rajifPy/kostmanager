import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Helper function to format phone number
function formatPhoneNumber(phone: string): string | null {
  if (!phone) return null
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')
  
  // Check if number is valid (10-15 digits)
  if (cleaned.length < 10 || cleaned.length > 15) {
    console.error('Invalid phone number length:', cleaned.length)
    return null
  }
  
  // Format to Indonesian format
  if (cleaned.startsWith('0')) {
    // 08xxx -> 628xxx
    return '62' + cleaned.substring(1)
  } else if (cleaned.startsWith('62')) {
    // Already in correct format
    return cleaned
  } else if (cleaned.startsWith('8')) {
    // 8xxx -> 628xxx
    return '62' + cleaned
  } else {
    // Invalid format
    console.error('Invalid phone number format:', cleaned)
    return null
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, tenantId, paymentId, reason } = body

    console.log('Notification request:', { type, tenantId, paymentId })

    const supabase = await createClient()

    // Get tenant info
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", tenantId)
      .single()

    if (tenantError || !tenant) {
      console.error('Tenant not found:', tenantError)
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    console.log('Tenant found:', { name: tenant.name, phone: tenant.phone, email: tenant.email })

    // Get payment info
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single()

    if (paymentError || !payment) {
      console.error('Payment not found:', paymentError)
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    const amount = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(payment.amount)

    let message = ""
    let subject = ""

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
    let notificationError = null
    let notificationMethod = null

    // Validate and format phone number
    const formattedPhone = formatPhoneNumber(tenant.phone || '')
    
    console.log('Phone validation:', {
      original: tenant.phone,
      formatted: formattedPhone,
      hasFonnteKey: !!process.env.FONNTE_API_KEY
    })

    // Try WhatsApp first (Fonnte)
    if (formattedPhone && process.env.FONNTE_API_KEY) {
      try {
        console.log('Attempting WhatsApp send to:', formattedPhone)

        const fonnteResponse = await fetch("https://api.fonnte.com/send", {
          method: "POST",
          headers: {
            Authorization: process.env.FONNTE_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            target: formattedPhone,
            message: message,
            countryCode: "62", // Indonesian country code
          }),
        })

        const result = await fonnteResponse.json()
        
        console.log('Fonnte API response:', {
          status: fonnteResponse.status,
          ok: fonnteResponse.ok,
          result: result
        })
        
        // Fonnte returns status: true on success
        if (fonnteResponse.ok && result.status === true) {
          notificationSent = true
          notificationMethod = 'whatsapp'
          console.log('✅ WhatsApp sent successfully')
        } else {
          notificationError = result.reason || result.message || JSON.stringify(result)
          console.error('❌ Fonnte error:', notificationError)
        }
      } catch (e) {
        notificationError = e instanceof Error ? e.message : "WhatsApp notification failed"
        console.error("❌ WhatsApp exception:", e)
      }
    } else {
      const reason = !formattedPhone 
        ? 'Invalid or missing phone number' 
        : 'Fonnte API key not configured'
      console.log('WhatsApp skipped:', reason)
      notificationError = reason
    }

    // Fallback to email if WhatsApp fails
    if (!notificationSent && tenant.email && process.env.RESEND_API_KEY) {
      try {
        console.log('Attempting email send to:', tenant.email)

        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "onboarding@resend.dev",
            to: tenant.email,
            subject: subject,
            text: message,
          }),
        })
        
        const result = await emailResponse.json()
        
        console.log('Resend API response:', {
          status: emailResponse.status,
          ok: emailResponse.ok,
          result: result
        })
        
        if (emailResponse.ok && result.id) {
          notificationSent = true
          notificationError = null
          notificationMethod = 'email'
          console.log('✅ Email sent successfully:', result.id)
        } else {
          notificationError = result.message || "Email notification failed"
          console.error('❌ Email error:', result)
        }
      } catch (e) {
        notificationError = e instanceof Error ? e.message : "Email notification failed"
        console.error("❌ Email exception:", e)
      }
    } else if (!notificationSent) {
      const reason = !tenant.email 
        ? 'No email address' 
        : 'Resend API key not configured'
      console.log('Email skipped:', reason)
    }

    // Mark notification as sent only if successful
    if (notificationSent) {
      await supabase
        .from("payments")
        .update({ notification_sent: true })
        .eq("id", paymentId)
      
      console.log('✅ Payment marked as notification sent')
    }

    return NextResponse.json({
      success: notificationSent,
      notificationSent,
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
        success: false 
      }, 
      { status: 500 }
    )
  }
}
