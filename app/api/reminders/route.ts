import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const revalidate = 0

// Helper function to format phone number
function formatPhoneNumber(phone: string): string | null {
  if (!phone) return null
  
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length < 10 || cleaned.length > 15) {
    return null
  }
  
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.substring(1)
  } else if (cleaned.startsWith('62')) {
    return cleaned
  } else if (cleaned.startsWith('8')) {
    return '62' + cleaned
  }
  
  return null
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

export async function GET(request: Request) {
  // Verify cron secret for Vercel Cron Jobs
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('Unauthorized cron request')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('🔔 Starting reminder cron job at:', new Date().toISOString())

  try {
    const supabase = await createClient()
    const today = new Date().toISOString().split("T")[0]

    console.log('Today\'s date:', today)

    // First, update overdue payments
    const { data: overduePayments } = await supabase
      .from("payments")
      .update({ status: "overdue", updated_at: new Date().toISOString() })
      .eq("status", "pending")
      .lt("due_date", today)
      .select()

    console.log(`✅ Updated ${overduePayments?.length || 0} payments to overdue status`)

    // Get all pending reminders for today or earlier
    const { data: reminders, error } = await supabase
      .from("reminders")
      .select("*, payment:payments(*, tenant:tenants(*))")
      .eq("status", "pending")
      .lte("reminder_date", today)

    if (error) {
      console.error("❌ Error fetching reminders:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`📋 Found ${reminders?.length || 0} pending reminders`)

    // Check environment variables
    console.log('Environment check:', {
      hasFonnteKey: !!process.env.FONNTE_API_KEY,
      hasResendKey: !!process.env.RESEND_API_KEY,
      hasEmailFrom: !!process.env.EMAIL_FROM,
    })

    // Process each reminder
    const results = []
    for (const reminder of reminders || []) {
      const payment = reminder.payment
      const tenant = payment?.tenant

      if (!tenant) {
        console.log(`⚠️ Skipping reminder ${reminder.id} - no tenant found`)
        continue
      }

      console.log(`\n📨 Processing reminder for ${tenant.name}`)

      const message = generateReminderMessage(reminder, payment, tenant)

      let notificationSent = false
      let notificationError = null
      let notificationMethod = null

      // Validate and format phone number
      const formattedPhone = formatPhoneNumber(tenant.phone || '')
      
      console.log('Contact info:', {
        phone: tenant.phone,
        formatted: formattedPhone,
        email: tenant.email
      })

      // Try WhatsApp first (Fonnte)
      if (formattedPhone && process.env.FONNTE_API_KEY) {
        try {
          console.log(`📱 Sending WhatsApp to: ${formattedPhone}`)

          const response = await fetch("https://api.fonnte.com/send", {
            method: "POST",
            headers: {
              Authorization: process.env.FONNTE_API_KEY,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              target: formattedPhone,
              message: message,
              countryCode: "62",
            }),
          })

          const result = await response.json()
          
          console.log('Fonnte response:', {
            status: response.status,
            ok: response.ok,
            result: result
          })

          if (response.ok && result.status === true) {
            notificationSent = true
            notificationMethod = 'whatsapp'
            console.log(`✅ WhatsApp sent to ${formattedPhone}`)
          } else {
            notificationError = result.reason || result.message || JSON.stringify(result)
            console.error(`❌ WhatsApp error for ${formattedPhone}:`, result)
          }
        } catch (e) {
          notificationError = e instanceof Error ? e.message : "WhatsApp error"
          console.error("❌ WhatsApp exception:", e)
        }
      } else {
        console.log('⚠️ WhatsApp skipped:', {
          hasPhone: !!formattedPhone,
          hasApiKey: !!process.env.FONNTE_API_KEY
        })
      }

      // Fallback to email if WhatsApp fails
      if (!notificationSent && tenant.email && process.env.RESEND_API_KEY) {
        try {
          console.log(`📧 Sending email to: ${tenant.email}`)

          const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: process.env.EMAIL_FROM || "onboarding@resend.dev",
              to: tenant.email,
              subject: "Reminder Pembayaran Kost",
              text: message,
            }),
          })

          const result = await response.json()

          console.log('Resend response:', {
            status: response.status,
            ok: response.ok,
            result: result
          })

          if (response.ok && result.id) {
            notificationSent = true
            notificationError = null
            notificationMethod = 'email'
            console.log(`✅ Email sent to ${tenant.email}`)
          } else {
            notificationError = result.message || "Email failed"
            console.error(`❌ Email error for ${tenant.email}:`, result)
          }
        } catch (e) {
          notificationError = e instanceof Error ? e.message : "Email error"
          console.error("❌ Email exception:", e)
        }
      } else if (!notificationSent) {
        console.log('⚠️ Email skipped:', {
          hasEmail: !!tenant.email,
          hasApiKey: !!process.env.RESEND_API_KEY
        })
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
        console.error("❌ Error updating reminder:", updateResult.error)
      } else {
        console.log(`✅ Reminder ${reminder.id} marked as ${notificationSent ? 'sent' : 'failed'}`)
      }

      results.push({
        id: reminder.id,
        tenant: tenant.name,
        phone: formattedPhone,
        email: tenant.email,
        message,
        status: notificationSent ? "sent" : "failed",
        method: notificationMethod,
        error: notificationError,
      })
    }

    const summary = {
      success: true,
      processed: results.length,
      sent: results.filter(r => r.status === "sent").length,
      failed: results.filter(r => r.status === "failed").length,
      overdueUpdated: overduePayments?.length || 0,
      timestamp: new Date().toISOString(),
    }

    console.log('\n📊 Cron job summary:', summary)
    console.log('Results:', results)

    return NextResponse.json({
      ...summary,
      results,
    })
  } catch (error) {
    console.error("❌ Reminders API error:", error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Unknown error",
        success: false 
      }, 
      { status: 500 }
    )
  }
}
