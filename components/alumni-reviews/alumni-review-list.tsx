"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CheckCircle, XCircle, Trash2, MoreHorizontal, Star, MessageSquare } from "lucide-react"
import { approveAlumniReview, rejectAlumniReview, deleteAlumniReview } from "@/app/actions/alumni-reviews"
import type { AlumniReview } from "@/lib/types"

interface AlumniReviewListProps {
  reviews: AlumniReview[]
}

export function AlumniReviewList({ reviews }: AlumniReviewListProps) {
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Disetujui</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Ditolak</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleDelete = async () => {
    if (!deleteReviewId) return
    setIsDeleting(true)
    await deleteAlumniReview(deleteReviewId)
    setIsDeleting(false)
    setDeleteReviewId(null)
  }

  const handleApprove = async (id: string) => {
    setIsApproving(true)
    await approveAlumniReview(id)
    setIsApproving(false)
  }

  const handleReject = async (id: string) => {
    setIsRejecting(true)
    await rejectAlumniReview(id)
    setIsRejecting(false)
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Belum ada review</p>
          <p className="text-sm text-muted-foreground">Review dari alumni akan muncul di sini</p>
        </CardContent>
      </Card>
    )
  }

  // Sort: pending first, then approved, then rejected
  const sortedReviews = [...reviews].sort((a, b) => {
    const statusOrder = { pending: 0, approved: 1, rejected: 2 }
    return statusOrder[a.status] - statusOrder[b.status]
  })

  return (
    <>
      {/* Desktop View */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Alumni</TableHead>
                  <TableHead>Periode Huni</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Review</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedReviews.map((review) => (
                  <TableRow
                    key={review.id}
                    className={review.status === "pending" ? "bg-yellow-50/50 dark:bg-yellow-950/10" : ""}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={review.photo_url || undefined} alt={review.name} />
                          <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{review.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{review.stay_date}</TableCell>
                    <TableCell>{renderStars(review.rating)}</TableCell>
                    <TableCell>
                      <p className="line-clamp-2 max-w-md text-sm">{review.review}</p>
                    </TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {review.status === "pending" && (
                            <>
                              <DropdownMenuItem onClick={() => handleApprove(review.id)} disabled={isApproving}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Setujui
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReject(review.id)} disabled={isRejecting}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Tolak
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {review.status === "approved" && (
                            <>
                              <DropdownMenuItem onClick={() => handleReject(review.id)} disabled={isRejecting}>
                                <XCircle className="mr-2 h-4 w-4" />
                                Sembunyikan
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {review.status === "rejected" && (
                            <>
                              <DropdownMenuItem onClick={() => handleApprove(review.id)} disabled={isApproving}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Setujui
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteReviewId(review.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {sortedReviews.map((review) => (
          <Card key={review.id} className={review.status === "pending" ? "border-yellow-500/50" : ""}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={review.photo_url || undefined} alt={review.name} />
                    <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-sm text-muted-foreground">{review.stay_date}</p>
                  </div>
                </div>
                {getStatusBadge(review.status)}
              </div>

              <div className="space-y-2 mb-3">
                {renderStars(review.rating)}
                <p className="text-sm line-clamp-3">{review.review}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {review.status === "pending" && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleApprove(review.id)}
                      disabled={isApproving}
                      className="flex-1 min-w-[100px]"
                    >
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Setujui
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleReject(review.id)}
                      disabled={isRejecting}
                      className="flex-1 min-w-[100px]"
                    >
                      <XCircle className="mr-1 h-3 w-3" />
                      Tolak
                    </Button>
                  </>
                )}
                {review.status === "approved" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleReject(review.id)}
                    disabled={isRejecting}
                    className="flex-1 min-w-[100px]"
                  >
                    <XCircle className="mr-1 h-3 w-3" />
                    Sembunyikan
                  </Button>
                )}
                {review.status === "rejected" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApprove(review.id)}
                    disabled={isApproving}
                    className="flex-1 min-w-[100px]"
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Setujui
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteReviewId(review.id)}
                  className="text-destructive flex-1 min-w-[100px]"
                >
                  <Trash2 className="h-3 w-3" />
                  Hapus
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteReviewId} onOpenChange={() => setDeleteReviewId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Review?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Review akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}