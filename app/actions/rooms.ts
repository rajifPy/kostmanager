"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createRoom(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from("rooms").insert({
    room_number: formData.get("room_number") as string,
    price: Number(formData.get("price")),
    facilities: (formData.get("facilities") as string) || null,
    status: (formData.get("status") as string) || "vacant",
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/rooms")
  revalidatePath("/dashboard")
}

export async function updateRoom(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("rooms")
    .update({
      room_number: formData.get("room_number") as string,
      price: Number(formData.get("price")),
      facilities: (formData.get("facilities") as string) || null,
      status: formData.get("status") as string,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/rooms")
  revalidatePath("/dashboard")
}

export async function deleteRoom(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("rooms").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/rooms")
  revalidatePath("/dashboard")
}
