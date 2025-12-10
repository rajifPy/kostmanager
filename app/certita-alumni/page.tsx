"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { createAlumniReview } from "@/app/actions/alumni-reviews"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, Upload, CheckCircle2, Loader2, Building2, AlertTriangle } from "lucide-react"
import { HomeHeader } from "@/components/home-header"
import Link from "next/link"

export default function CeritaAlumniPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [stayDate, setStayDate] = useState("")
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        setError("File harus berupa gambar (JPG, PNG, WebP)")
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("Ukuran file maksimal 2MB")
        return
      }
      setPhotoFile(file)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !stayDate || !review || rating === 0) {
      setError("Mohon lengkapi semua field yang diperlukan")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      let photoUrl = null

      // Upload photo if provided
      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop()
        const fileName = `alumni-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from("payment-proofs")
          .upload(fileName, photoFile)

        if (uploadError) {
          console.error("Upload error:", uploadError)
        } else {
          const { data: urlData } = supabase.storage
            .from("payment-proofs")
            .getPublicUrl(fileName)
          photoUrl = urlData?.publicUrl
        }
      }

      // Create form data
      const formData = new FormData()
      formData.append("name", name)
      formData.append("stay_date", stayDate)
      formData.append("review", review)
      formData.append("rating", rating.toString())
      if (photoUrl) formData.append("photo_url", photoUrl)

      await createAlumniReview(formData)

      setSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="rounded-2xl border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-8 md:p-12 shadow-xl">
            <div className="flex flex-col items-center justify-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2.5} />
              </div>
              <div className="text-center space-y-3">
                <h3 className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                  🎉 Terima Kasih!
                </h3>
                <div className="space-y-2">
                  <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 font-medium">
                    Review Anda telah dikirim
                  </p>
                  <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    Mohon tunggu persetujuan dari admin. Review akan muncul di halaman utama setelah disetujui.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Cerita Alumni</CardTitle>
              <CardDescription>
                Bagikan pengalaman Anda selama menghuni kost kami
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Lengkap *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Nama Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                {/* Photo */}
                <div className="space-y-2">
                  <Label htmlFor="photo">Foto Profil (Opsional)</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="cursor-pointer"
                  />
                  {photoFile && (
                    <p className="text-sm text-muted-foreground">
                      File terpilih: {photoFile.name}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Format: JPG, PNG, WebP. Maksimal 2MB.
                  </p>
                </div>

                {/* Stay Date */}
                <div className="space-y-2">
                  <Label htmlFor="stay_date">Periode Huni *</Label>
                  <Input
                    id="stay_date"
                    type="text"
                    placeholder="Contoh: Januari 2023 - Desember 2024"
                    value={stayDate}
                    onChange={(e) => setStayDate(e.target.value)}
                    required
                  />
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label>Rating *</Label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-8 h-8 ${
                            star <= (hoverRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Anda memberi {rating} bintang
                    </p>
                  )}
                </div>

                {/* Review */}
                <div className="space-y-2">
                  <Label htmlFor="review">Review *</Label>
                  <Textarea
                    id="review"
                    placeholder="Ceritakan pengalaman Anda menghuni di kost kami..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Kirim Review
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} KostManager. By Cah Kuno - Murfhi.</p>
        </div>
      </footer>
    </div>
  )
}