import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { AlumniReviewList } from "@/components/alumni-reviews/alumni-review-list"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Clock, CheckCircle2, XCircle } from "lucide-react"
import type { AlumniReview } from "@/lib/types"

async function getAlumniReviews() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("alumni_reviews")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching alumni reviews:", error)
    return []
  }

  return data as AlumniReview[]
}

export default async function AlumniReviewsPage() {
  const reviews = await getAlumniReviews()

  const pendingReviews = reviews.filter((r) => r.status === "pending")
  const approvedReviews = reviews.filter((r) => r.status === "approved")
  const rejectedReviews = reviews.filter((r) => r.status === "rejected")

  return (
    <>
      <Header title="Cerita Alumni" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Menunggu Persetujuan</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReviews.length}</div>
              <p className="text-xs text-muted-foreground">Review baru</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disetujui</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{approvedReviews.length}</div>
              <p className="text-xs text-muted-foreground">Tampil di website</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ditolak</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{rejectedReviews.length}</div>
              <p className="text-xs text-muted-foreground">Tidak ditampilkan</p>
            </CardContent>
          </Card>
        </div>

        {pendingReviews.length > 0 && (
          <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
            <CardContent className="flex items-center gap-4 p-4">
              <MessageSquare className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-600">{pendingReviews.length} Review Menunggu Persetujuan</p>
                <p className="text-sm text-yellow-600/80">Tinjau dan setujui review dari alumni.</p>
              </div>
            </CardContent>
          </Card>
        )}

        <AlumniReviewList reviews={reviews} />
      </main>
    </>
  )
}