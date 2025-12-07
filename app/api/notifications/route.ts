import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, tenantId, paymentId, reason } = body

    const supabase = await createClient()

    // Get tenant info
    const { data: tenant } = await supabase.from("tenants").select("*").eq("id", tenantId).single()

    if (!tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Get payment info
    const { data: payment } = await supabase.from("payments").select("*").eq("id", paymentId).single()

    if (!payment) {
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

    // Try to send notification via WhatsApp
    let notificationSent = false

    if (tenant.phone && process.env.FONNTE_API_KEY) {
      try {
        const response = await fetch("https://api.fonnte.com/send", {
          method: "POST",
          headers: {
            Authorization: process.env.FONNTE_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            target: tenant.phone,
            message: message,
          }),
        })

        if (response.ok) {
          notificationSent = true
        }
      } catch (e) {
        console.error("WhatsApp notification failed:", e)
      }
    }

    // Fallback to email
    if (!notificationSent && tenant.email && process.env.RESEND_API_KEY) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: process.env.EMAIL_FROM || "noreply@kostmanager.com",
            to: tenant.email,
            subject: subject,
            text: message,
          }),
        })
        notificationSent = response.ok
      } catch (e) {
        console.error("Email notification failed:", e)
      }
    }

    // Mark payment as notification sent
    await supabase.from("payments").update({ notification_sent: true }).eq("id", paymentId)

    return NextResponse.json({
      success: true,
      notificationSent,
      tenant: tenant.name,
      type,
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
