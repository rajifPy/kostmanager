"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createTenant(formData: FormData) {
  const supabase = await createClient()

  const roomId = formData.get("room_id") as string

  // Insert tenant
  const { error: tenantError } = await supabase.from("tenants").insert({
    name: formData.get("name") as string,
    phone: (formData.get("phone") as string) || null,
    email: (formData.get("email") as string) || null,
    room_id: roomId || null,
    start_date: formData.get("start_date") as string,
    end_date: (formData.get("end_date") as string) || null,
  })

  if (tenantError) {
    throw new Error(tenantError.message)
  }

  // Update room status if room is assigned
  if (roomId) {
    await supabase.from("rooms").update({ status: "occupied", updated_at: new Date().toISOString() }).eq("id", roomId)
  }

  revalidatePath("/dashboard/tenants")
  revalidatePath("/dashboard/rooms")
  revalidatePath("/dashboard")
}

export async function updateTenant(id: string, formData: FormData, oldRoomId: string | null) {
  const supabase = await createClient()

  const newRoomId = formData.get("room_id") as string

  // Update tenant
  const { error: tenantError } = await supabase
    .from("tenants")
    .update({
      name: formData.get("name") as string,
      phone: (formData.get("phone") as string) || null,
      email: (formData.get("email") as string) || null,
      room_id: newRoomId || null,
      start_date: formData.get("start_date") as string,
      end_date: (formData.get("end_date") as string) || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (tenantError) {
    throw new Error(tenantError.message)
  }

  // Update room statuses if room changed
  if (oldRoomId !== newRoomId) {
    // Set old room to vacant
    if (oldRoomId) {
      await supabase
        .from("rooms")
        .update({ status: "vacant", updated_at: new Date().toISOString() })
        .eq("id", oldRoomId)
    }
    // Set new room to occupied
    if (newRoomId) {
      await supabase
        .from("rooms")
        .update({ status: "occupied", updated_at: new Date().toISOString() })
        .eq("id", newRoomId)
    }
  }

  revalidatePath("/dashboard/tenants")
  revalidatePath("/dashboard/rooms")
  revalidatePath("/dashboard")
}

export async function deleteTenant(id: string) {
  const supabase = await createClient()

  // Get tenant's room first
  const { data: tenant } = await supabase.from("tenants").select("room_id").eq("id", id).single()

  // Delete tenant (payments will cascade delete)
  const { error } = await supabase.from("tenants").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  // Update room status to vacant
  if (tenant?.room_id) {
    await supabase
      .from("rooms")
      .update({ status: "vacant", updated_at: new Date().toISOString() })
      .eq("id", tenant.room_id)
  }

  revalidatePath("/dashboard/tenants")
  revalidatePath("/dashboard/rooms")
  revalidatePath("/dashboard")
}
