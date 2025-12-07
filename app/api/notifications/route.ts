// ==========================================
// FILE: app/api/notifications/route.ts
// MASALAH: Logika notification_sent & error handling
// ==========================================

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, tenantId, paymentId, reason } = body

    const supabase = await createClient()

    // Get tenant info
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("*")
      .eq("id", tenantId)
      .single()

    if (tenantError || !tenant) {
      return NextResponse.json({ error: "Tenant not found" }, { status: 404 })
    }

    // Get payment info
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*")
      .eq("id", paymentId)
      .single()

    if (paymentError || !payment) {
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
    let notificationError = null
    let notificationMethod = null

    // FIX 1: Validasi format nomor telepon
    const phoneNumber = tenant.phone?.replace(/\D/g, '') // Hapus non-digit
    const isValidPhone = phoneNumber && phoneNumber.length >= 10 && phoneNumber.length <= 15

    if (isValidPhone && process.env.FONNTE_API_KEY) {
      try {
        // FIX 2: Pastikan nomor dimulai dengan kode negara
        let formattedPhone = phoneNumber
        if (phoneNumber.startsWith('0')) {
          formattedPhone = '62' + phoneNumber.substring(1) // 08xxx -> 628xxx
        } else if (!phoneNumber.startsWith('62')) {
          formattedPhone = '62' + phoneNumber // xxx -> 62xxx
        }

        console.log('Sending WhatsApp to:', formattedPhone) // Debug log

        const response = await fetch("https://api.fonnte.com/send", {
          method: "POST",
          headers: {
            Authorization: process.env.FONNTE_API_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            target: formattedPhone,
            message: message,
          }),
        })

        const result = await response.json()
        
        console.log('Fonnte response:', result) // Debug log
        
        if (response.ok && result.status) {
          notificationSent = true
          notificationMethod = 'whatsapp'
        } else {
          notificationError = result.reason || "WhatsApp notification failed"
          console.error('Fonnte error:', notificationError)
        }
      } catch (e) {
        notificationError = e instanceof Error ? e.message : "WhatsApp notification failed"
        console.error("WhatsApp notification error:", e)
      }
    } else {
      console.log('WhatsApp skipped:', { 
        hasPhone: !!tenant.phone, 
        isValidPhone, 
        hasApiKey: !!process.env.FONNTE_API_KEY 
      })
    }

    // Fallback to email if WhatsApp fails or not configured
    if (!notificationSent && tenant.email && process.env.RESEND_API_KEY) {
      try {
        console.log('Sending email to:', tenant.email) // Debug log

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
        
        if (response.ok) {
          notificationSent = true
          notificationError = null
          notificationMethod = 'email'
          console.log('Email sent successfully')
        } else {
          const result = await response.json()
          notificationError = result.message || "Email notification failed"
          console.error('Email error:', result)
        }
      } catch (e) {
        notificationError = e instanceof Error ? e.message : "Email notification failed"
        console.error("Email notification error:", e)
      }
    }

    // FIX 3: Hanya mark notification_sent jika berhasil
    if (notificationSent) {
      await supabase
        .from("payments")
        .update({ notification_sent: true })
        .eq("id", paymentId)
    }

    return NextResponse.json({
      success: true,
      notificationSent,
      notificationMethod,
      notificationError,
      tenant: tenant.name,
      type,
      message: notificationSent 
        ? `Notification sent successfully via ${notificationMethod}` 
        : `Notification failed: ${notificationError || "Unknown error"}`,
    })
  } catch (error) {
    console.error("Notification API error:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Unknown error",
        success: false 
      }, 
      { status: 500 }
    )
  }
}
