"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createPayment(formData: FormData) {
  const supabase = await createClient()

  const dueDate = new Date(formData.get("due_date") as string)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let status = formData.get("status") as string
  if (status === "pending" && dueDate < today) {
    status = "overdue"
  }

  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert({
      tenant_id: formData.get("tenant_id") as string,
      amount: Number(formData.get("amount")),
      due_date: formData.get("due_date") as string,
      status,
      notes: (formData.get("notes") as string) || null,
      paid_date: status === "paid" ? new Date().toISOString() : null,
    })
    .select()
    .single()

  if (paymentError) {
    throw new Error(paymentError.message)
  }

  // Create reminder records for non-paid payments
  if (status !== "paid") {
    const reminders = []
    const dueDateObj = new Date(dueDate)

    // 7 days before
    const sevenDaysBefore = new Date(dueDateObj)
    sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 7)
    if (sevenDaysBefore >= today) {
      reminders.push({
        payment_id: payment.id,
        reminder_date: sevenDaysBefore.toISOString().split("T")[0],
        reminder_type: "7_days",
        status: "pending",
      })
    }

    // 3 days before
    const threeDaysBefore = new Date(dueDateObj)
    threeDaysBefore.setDate(threeDaysBefore.getDate() - 3)
    if (threeDaysBefore >= today) {
      reminders.push({
        payment_id: payment.id,
        reminder_date: threeDaysBefore.toISOString().split("T")[0],
        reminder_type: "3_days",
        status: "pending",
      })
    }

    // Due day
    if (dueDateObj >= today) {
      reminders.push({
        payment_id: payment.id,
        reminder_date: dueDateObj.toISOString().split("T")[0],
        reminder_type: "due_day",
        status: "pending",
      })
    }

    if (reminders.length > 0) {
      await supabase.from("reminders").insert(reminders)
    }
  }

  revalidatePath("/dashboard/payments")
  revalidatePath("/dashboard/reminders")
  revalidatePath("/dashboard")
  revalidatePath("/penyewa")
}

export async function updatePayment(id: string, formData: FormData) {
  const supabase = await createClient()

  const status = formData.get("status") as string

  const { error } = await supabase
    .from("payments")
    .update({
      tenant_id: formData.get("tenant_id") as string,
      amount: Number(formData.get("amount")),
      due_date: formData.get("due_date") as string,
      status,
      notes: (formData.get("notes") as string) || null,
      paid_date: status === "paid" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/payments")
  revalidatePath("/dashboard/reminders")
  revalidatePath("/dashboard")
  revalidatePath("/penyewa")
}

export async function deletePayment(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("payments").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/payments")
  revalidatePath("/dashboard/reminders")
  revalidatePath("/dashboard")
  revalidatePath("/penyewa")
}

export async function markAsPaid(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("payments")
    .update({
      status: "paid",
      paid_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  // Mark all related reminders as sent
  await supabase.from("reminders").update({ status: "sent", sent_at: new Date().toISOString() }).eq("payment_id", id)

  revalidatePath("/dashboard/payments")
  revalidatePath("/dashboard/reminders")
  revalidatePath("/dashboard")
  revalidatePath("/penyewa")
}

// ✅ FIXED: Improved URL construction
function getBaseUrl(): string {
  // Priority: NEXT_PUBLIC_APP_URL > VERCEL_URL > localhost
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  return 'http://localhost:3000'
}

export async function verifyPayment(id: string) {
  const supabase = await createClient()

  // Get payment with tenant info for notification
  const { data: payment } = await supabase.from("payments").select("*, tenant:tenants(*)").eq("id", id).single()

  const { error } = await supabase
    .from("payments")
    .update({
      status: "paid",
      paid_date: new Date().toISOString(),
      notification_sent: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  // Mark all related reminders as sent
  await supabase.from("reminders").update({ status: "sent", sent_at: new Date().toISOString() }).eq("payment_id", id)

  // Trigger notification
  if (payment?.tenant) {
    try {
      const baseUrl = getBaseUrl()
      
      console.log('🔔 Sending notification to:', {
        url: `${baseUrl}/api/notifications`,
        tenant: payment.tenant.name,
        phone: payment.tenant.phone,
        email: payment.tenant.email
      })
      
      const response = await fetch(`${baseUrl}/api/notifications`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "payment_approved",
          tenantId: payment.tenant.id,
          paymentId: id,
        }),
      })

      const result = await response.json()
      
      console.log('📬 Notification API response:', {
        status: response.status,
        ok: response.ok,
        result
      })
      
      if (!response.ok) {
        console.error('❌ Notification failed:', result)
      }
    } catch (err) {
      console.error("❌ Notification error:", err)
    }
  } else {
    console.warn('⚠️ No tenant found for payment:', id)
  }

  revalidatePath("/dashboard/payments")
  revalidatePath("/dashboard/reminders")
  revalidatePath("/dashboard")
  revalidatePath("/penyewa")
}

export async function rejectPayment(id: string, reason?: string) {
  const supabase = await createClient()

  // Get payment with tenant info for notification
  const { data: payment } = await supabase.from("payments").select("*, tenant:tenants(*)").eq("id", id).single()

  const { error } = await supabase
    .from("payments")
    .update({
      status: "rejected",
      notes: reason || "Bukti pembayaran tidak valid",
      notification_sent: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  // Trigger notification
  if (payment?.tenant) {
    try {
      const baseUrl = getBaseUrl()
      
      console.log('🔔 Sending rejection notification to:', {
        url: `${baseUrl}/api/notifications`,
        tenant: payment.tenant.name,
        phone: payment.tenant.phone,
        email: payment.tenant.email
      })
      
      const response = await fetch(`${baseUrl}/api/notifications`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "payment_rejected",
          tenantId: payment.tenant.id,
          paymentId: id,
          reason: reason || "Bukti pembayaran tidak valid",
        }),
      })

      const result = await response.json()
      
      console.log('📬 Notification API response:', {
        status: response.status,
        ok: response.ok,
        result
      })
      
      if (!response.ok) {
        console.error('❌ Notification failed:', result)
      }
    } catch (err) {
      console.error("❌ Notification error:", err)
    }
  } else {
    console.warn('⚠️ No tenant found for payment:', id)
  }

  revalidatePath("/dashboard/payments")
  revalidatePath("/dashboard/reminders")
  revalidatePath("/dashboard")
  revalidatePath("/penyewa")
}
