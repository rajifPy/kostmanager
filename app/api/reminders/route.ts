import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Vercel Cron config - runs daily at 8 AM WIB (1 AM UTC)
export const revalidate = 0

export async function GET(request: Request) {
  // Verify cron secret for Vercel Cron Jobs
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()
    const today = new Date().toISOString().split("T")[0]

    // First, update overdue payments
    const { data: overduePayments } = await supabase
      .from("payments")
      .update({ status: "overdue", updated_at: new Date().toISOString() })
      .eq("status", "pending")
      .lt("due_date", today)
      .select()

    console.log(`Updated ${overduePayments?.length || 0} payments to overdue status`)

    // Get all pending reminders for today or earlier
    const { data: reminders, error } = await supabase
      .from("reminders")
      .select("*, payment:payments(*, tenant:tenants(*))")
      .eq("status", "pending")
      .lte("reminder_date", today)

    if (error) {
      console.error("Error fetching reminders:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Process each reminder
    const results = []
    for (const reminder of reminders || []) {
      const payment = reminder.payment
      const tenant = payment?.tenant

      if (!tenant) {
        console.log(`Skipping reminder ${reminder.id} - no tenant found`)
        continue
      }

      const message = generateReminderMessage(reminder, payment, tenant)

      let notificationSent = false
      let notificationError = null
      let notificationMethod = null

      // Validasi dan format nomor telepon
      const phoneNumber = tenant.phone?.replace(/\D/g, '')
      const isValidPhone = phoneNumber && phoneNumber.length >= 10 && phoneNumber.length <= 15

      // Try WhatsApp first (Fonnte)
      if (isValidPhone && process.env.FONNTE_API_KEY) {
        try {
          // Format nomor: pastikan dimulai dengan 62
          let formattedPhone = phoneNumber
          if (phoneNumber.startsWith('0')) {
            formattedPhone = '62' + phoneNumber.substring(1)
          } else if (!phoneNumber.startsWith('62')) {
            formattedPhone = '62' + phoneNumber
          }

          console.log(`Sending WhatsApp reminder to: ${formattedPhone}`)

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
          console.log('Fonnte response:', result)

          if (response.ok && result.status === true) {
            notificationSent = true
            notificationMethod = 'whatsapp'
            console.log(`WhatsApp sent to ${formattedPhone}`)
          } else {
            notificationError = result.reason || result.message || "WhatsApp failed"
            console.error(`WhatsApp error for ${formattedPhone}:`, result)
          }
        } catch (e) {
          notificationError = e instanceof Error ? e.message : "WhatsApp error"
          console.error("WhatsApp notification failed:", e)
        }
      }

      // Fallback to email if WhatsApp fails or not configured
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
              subject: "Reminder Pembayaran Kost",
              text: message,
            }),
          })

          const result = await response.json()

          if (response.ok && result.id) {
            notificationSent = true
            notificationError = null
            notificationMethod = 'email'
            console.log(`Email sent to ${tenant.email}`)
          } else {
            notificationError = result.message || "Email failed"
            console.error(`Email error for ${tenant.email}:`, result)
          }
        } catch (e) {
          notificationError = e instanceof Error ? e.message : "Email error"
          console.error("Email notification failed:", e)
        }
      }

      // Mark reminder as sent or failed
      const updateResult = await supabase
        .from("reminders")
        .update({
          status: notificationSent ? "sent" : "failed",
          sent_at: notificationSent ? new Date().toISOString() : null,
        })
        .eq("id", reminder.id)

      if (updateResult.error) {
        console.error("Error updating reminder:", updateResult.error)
      }

      results.push({
        id: reminder.id,
        tenant: tenant.name,
        phone: tenant.phone,
        email: tenant.email,
        message,
        status: notificationSent ? "sent" : "failed",
        method: notificationMethod,
        error: notificationError,
      })
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      sent: results.filter(r => r.status === "sent").length,
      failed: results.filter(r => r.status === "failed").length,
      results,
      overdueUpdated: overduePayments?.length || 0,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Reminders API error:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Unknown error",
        success: false 
      }, 
      { status: 500 }
    )
  }
}

function generateReminderMessage(
  reminder: { reminder_type: string },
  payment: { amount: number; due_date: string },
  tenant: { name: string },
) {
  const amount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(payment.amount)

  const dueDate = new Date(payment.due_date).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  let intro = ""
  switch (reminder.reminder_type) {
    case "7_days":
      intro = "Pembayaran sewa kost Anda akan jatuh tempo dalam 7 hari."
      break
    case "3_days":
      intro = "Pembayaran sewa kost Anda akan jatuh tempo dalam 3 hari."
      break
    case "due_day":
      intro = "Pembayaran sewa kost Anda jatuh tempo HARI INI."
      break
  }

  return `Halo ${tenant.name},

${intro}

Detail Pembayaran:
- Jumlah: ${amount}
- Jatuh Tempo: ${dueDate}

Mohon segera lakukan pembayaran dan upload bukti pembayaran melalui website kami.

Terima kasih.
- KostManager`
}
