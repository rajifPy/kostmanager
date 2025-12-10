"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createBooking(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from("bookings").insert({
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    email: (formData.get("email") as string) || null,
    room_preference: (formData.get("room_preference") as string) || null,
    budget_min: formData.get("budget_min") ? Number(formData.get("budget_min")) : null,
    budget_max: formData.get("budget_max") ? Number(formData.get("budget_max")) : null,
    move_in_date: (formData.get("move_in_date") as string) || null,
    duration_months: formData.get("duration_months") ? Number(formData.get("duration_months")) : null,
    message: (formData.get("message") as string) || null,
    status: "pending",
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/bookings")
}

export async function updateBookingStatus(id: string, status: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("bookings")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/bookings")
}

export async function deleteBooking(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("bookings").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/bookings")
}
