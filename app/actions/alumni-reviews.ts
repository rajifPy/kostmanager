"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createAlumniReview(formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase.from("alumni_reviews").insert({
    name: formData.get("name") as string,
    photo_url: formData.get("photo_url") as string,
    stay_date: formData.get("stay_date") as string,
    review: formData.get("review") as string,
    rating: Number(formData.get("rating")),
    status: "pending",
  })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/")
  revalidatePath("/cerita-alumni")
}

export async function updateAlumniReview(id: string, formData: FormData) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("alumni_reviews")
    .update({
      name: formData.get("name") as string,
      photo_url: formData.get("photo_url") as string,
      stay_date: formData.get("stay_date") as string,
      review: formData.get("review") as string,
      rating: Number(formData.get("rating")),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/alumni-reviews")
  revalidatePath("/")
}

export async function approveAlumniReview(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("alumni_reviews")
    .update({
      status: "approved",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/alumni-reviews")
  revalidatePath("/")
}

export async function rejectAlumniReview(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from("alumni_reviews")
    .update({
      status: "rejected",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/alumni-reviews")
  revalidatePath("/")
}

export async function deleteAlumniReview(id: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("alumni_reviews").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/dashboard/alumni-reviews")
  revalidatePath("/")
}
