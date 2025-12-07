"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function markReminderSent(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("reminders")
    .update({
      status: "sent",
      sent_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/reminders")
}

export async function processReminders() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  // Get all pending reminders for today
  const { data: reminders, error } = await supabase
    .from("reminders")
    .select("*, payment:payments(*, tenant:tenants(*))")
    .eq("status", "pending")
    .lte("reminder_date", today)

  if (error) {
    throw new Error(error.message)
  }

  // Here you would integrate with WhatsApp API or email service
  // For now, we just return the reminders that need to be sent
  return reminders
}
