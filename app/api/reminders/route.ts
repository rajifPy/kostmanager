import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

// Vercel Cron config - runs daily at 8 AM WIB (1 AM UTC)
export const revalidate = 0

export async function GET() {
  try {
    const supabase = await createClient()
    const today = new Date().toISOString().split("T")[0]

    // Get all pending reminders for today or earlier
    const { data: reminders, error } = await supabase
      .from("reminders")
      .select("*, payment:payments(*, tenant:tenants(*))")
      .eq("status", "pending")
      .lte("reminder_date", today)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Process each reminder
    const results = []
    for (const reminder of reminders || []) {
      const payment = reminder.payment
      const tenant = payment?.tenant

      if (!tenant) continue

      const message = generateReminderMessage(reminder, payment, tenant)

      // Try to send notification via WhatsApp or Email
      let notificationSent = false

      // Try WhatsApp first (Fonnte)
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

      // Fallback to email if WhatsApp fails or not configured
      if (!notificationSent && tenant.email && process.env.SMTP_HOST) {
        try {
          // Using simple fetch to send email via SMTP relay or email API
          // In production, use nodemailer or email service API
          const emailResult = await sendEmailNotification(tenant.email, "Reminder Pembayaran Kost", message)
          notificationSent = emailResult
        } catch (e) {
          console.error("Email notification failed:", e)
        }
      }

      // Mark reminder as sent (or failed)
      await supabase
        .from("reminders")
        .update({
          status: notificationSent ? "sent" : "failed",
          sent_at: notificationSent ? new Date().toISOString() : null,
        })
        .eq("id", reminder.id)

      results.push({
        id: reminder.id,
        tenant: tenant.name,
        phone: tenant.phone,
        email: tenant.email,
        message,
        status: notificationSent ? "sent" : "failed",
      })
    }

    // Also update overdue payments
    await supabase
      .from("payments")
      .update({ status: "overdue", updated_at: new Date().toISOString() })
      .eq("status", "pending")
      .lt("due_date", today)

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
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

async function sendEmailNotification(to: string, subject: string, text: string): Promise<boolean> {
  // If using an email API service like Resend, SendGrid, etc.
  // You can integrate here

  // Example with Resend API (if configured)
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "noreply@kostmanager.com",
          to: to,
          subject: subject,
          text: text,
        }),
      })
      return response.ok
    } catch {
      return false
    }
  }

  // For demo purposes, log the email
  console.log(`[Email] To: ${to}, Subject: ${subject}`)
  return true
}
