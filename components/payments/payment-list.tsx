"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import { Edit, Trash2, CreditCard, MoreHorizontal, CheckCircle, XCircle, Eye, FileImage } from "lucide-react"
import { PaymentForm } from "./payment-form"
import { deletePayment, verifyPayment, rejectPayment } from "@/app/actions/payments"
import type { Payment, Tenant } from "@/lib/types"

interface PaymentListProps {
  payments: Payment[]
  tenants: Tenant[]
  isAdmin?: boolean // new prop to control admin-only actions at UI level
}

export function PaymentList({ payments, tenants, isAdmin = false }: PaymentListProps) {
  const router = useRouter()

  const [editPayment, setEditPayment] = useState<Payment | null>(null)
  const [deletePaymentId, setDeletePaymentId] = useState<string | null>(null)
  const [viewProofPayment, setViewProofPayment] = useState<Payment | null>(null)
  const [rejectPaymentData, setRejectPaymentData] = useState<Payment | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null)
  const [isVerifyingId, setIsVerifyingId] = useState<string | null>(null)
  const [isRejectingId, setIsRejectingId] = useState<string | null>(null)

  const formatCurrency = (amount?: number) => {
    const a = typeof amount === "number" ? amount : 0
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(a)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Lunas</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Tunggakan</Badge>
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Ditolak</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleDelete = async () => {
    if (!deletePaymentId) return
    setIsDeletingId(deletePaymentId)
    try {
      await deletePayment(deletePaymentId)
      // refresh data after delete
      router.refresh()
    } catch (err) {
      console.error("Delete failed:", err)
    } finally {
      setIsDeletingId(null)
      setDeletePaymentId(null)
    }
  }

  const handleVerify = async (payment: Payment) => {
    setIsVerifyingId(payment.id)
    try {
      await verifyPayment(payment.id)
      router.refresh()
      setViewProofPayment(null)
    } catch (err) {
      console.error("Verify failed:", err)
    } finally {
      setIsVerifyingId(null)
    }
  }

  const handleReject = async () => {
    if (!rejectPaymentData) return
    setIsRejectingId(rejectPaymentData.id)
    try {
      await rejectPayment(rejectPaymentData.id, rejectReason)
      router.refresh()
      setRejectPaymentData(null)
      setRejectReason("")
      setViewProofPayment(null)
    } catch (err) {
      console.error("Reject failed:", err)
    } finally {
      setIsRejectingId(null)
    }
  }

  // Filter pending payments first, then by due_date (safe check)
  const sortedPayments = [...payments].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1
    if (a.status !== "pending" && b.status === "pending") return 1
    const da = a.due_date ? new Date(a.due_date).getTime() : 0
    const db = b.due_date ? new Date(b.due_date).getTime() : 0
    return db - da
  })

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Belum ada pembayaran</p>
          <p className="text-sm text-muted-foreground">Mulai catat pembayaran sewa kost</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Desktop View */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Penyewa</TableHead>
                  <TableHead>Kamar</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead>Bukti</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedPayments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    className={payment.status === "pending" ? "bg-yellow-50/50 dark:bg-yellow-950/10" : ""}
                  >
                    <TableCell className="font-medium">{payment.tenant?.name || "Unknown"}</TableCell>
                    <TableCell>
                      {payment.tenant?.room ? (
                        <Badge variant="outline">Kamar {payment.tenant.room.room_number}</Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{payment.due_date ? new Date(payment.due_date).toLocaleDateString("id-ID") : "-"}</TableCell>
                    <TableCell>
                      {payment.proof_url ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewProofPayment(payment)}
                          className="gap-1 text-primary"
                        >
                          <FileImage className="h-4 w-4" />
                          Lihat
                        </Button>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* Only show admin actions if isAdmin true */}
                          {isAdmin && payment.status === "pending" && payment.proof_url && (
                            <>
                              <DropdownMenuItem onClick={() => setViewProofPayment(payment)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Verifikasi Bukti
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {isAdmin && payment.status === "pending" && !payment.proof_url && (
                            <DropdownMenuItem onClick={() => handleVerify(payment)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Tandai Lunas
                            </DropdownMenuItem>
                          )}
                          {/* Edit can be admin-only or allowed to other roles; adjust as needed */}
                          {isAdmin && (
                            <DropdownMenuItem onClick={() => setEditPayment(payment)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {isAdmin && (
                            <DropdownMenuItem className="text-destructive" onClick={() => setDeletePaymentId(payment.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          )}
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
        {sortedPayments.map((payment) => (
          <Card key={payment.id} className={payment.status === "pending" ? "border-yellow-500/50" : ""}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">{payment.tenant?.name || "Unknown"}</p>
                  {payment.tenant?.room && (
                    <Badge variant="outline" className="mt-1">
                      Kamar {payment.tenant.room.room_number}
                    </Badge>
                  )}
                </div>
                {getStatusBadge(payment.status)}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jumlah:</span>
                  <span className="font-medium">{formatCurrency(payment.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Jatuh Tempo:</span>
                  <span>{payment.due_date ? new Date(payment.due_date).toLocaleDateString("id-ID") : "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bukti:</span>
                  {payment.proof_url ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewProofPayment(payment)}
                      className="h-auto p-0 text-primary"
                    >
                      Lihat Bukti
                    </Button>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                {isAdmin && payment.status === "pending" && payment.proof_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewProofPayment(payment)}
                    className="flex-1"
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Verifikasi
                  </Button>
                )}
                {isAdmin && payment.status === "pending" && !payment.proof_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerify(payment)}
                    className="flex-1"
                    disabled={isVerifyingId === payment.id}
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {isVerifyingId === payment.id ? "Memproses..." : "Lunas"}
                  </Button>
                )}
                {isAdmin && (
                  <Button variant="outline" size="sm" onClick={() => setEditPayment(payment)} className="flex-1">
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                )}
                {isAdmin && (
                  <Button variant="outline" size="sm" onClick={() => setDeletePaymentId(payment.id)} className="text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Proof Dialog */}
      <Dialog open={!!viewProofPayment} onOpenChange={(open) => !open && setViewProofPayment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Verifikasi Bukti Pembayaran</DialogTitle>
            <DialogDescription>
              Pembayaran dari {viewProofPayment?.tenant?.name} - {formatCurrency(viewProofPayment?.amount)}
            </DialogDescription>
          </DialogHeader>
          {viewProofPayment?.proof_url && (
            <div className="space-y-4">
              <div className="rounded-lg border overflow-hidden">
                {viewProofPayment.proof_url.toLowerCase().endsWith(".pdf") ? (
                  <iframe src={viewProofPayment.proof_url} className="w-full h-96" title="Bukti Pembayaran" />
                ) : (
                  <img
                    src={viewProofPayment.proof_url || "/placeholder.svg"}
                    alt="Bukti Pembayaran"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                )}
              </div>
              {viewProofPayment.notes && (
                <div className="text-sm">
                  <span className="font-medium">Catatan:</span> {viewProofPayment.notes}
                </div>
              )}
            </div>
          )}
          {viewProofPayment?.status === "pending" && isAdmin && (
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="destructive"
                onClick={() => {
                  setRejectPaymentData(viewProofPayment)
                }}
                disabled={isVerifyingId === viewProofPayment.id}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Tolak
              </Button>
              <Button onClick={() => handleVerify(viewProofPayment)} disabled={isVerifyingId === viewProofPayment.id}>
                {isVerifyingId === viewProofPayment.id ? (
                  "Memproses..."
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Terima & Verifikasi
                  </>
                )}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectPaymentData} onOpenChange={(open) => !open && setRejectPaymentData(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak Pembayaran</DialogTitle>
            <DialogDescription>Berikan alasan penolakan bukti pembayaran</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Alasan Penolakan</Label>
              <Textarea
                id="reason"
                placeholder="Contoh: Bukti transfer tidak jelas, nominal tidak sesuai, dll."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectPaymentData(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isRejectingId === rejectPaymentData?.id}>
              {isRejectingId === rejectPaymentData?.id ? "Memproses..." : "Tolak Pembayaran"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editPayment} onOpenChange={(open) => !open && setEditPayment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pembayaran</DialogTitle>
          </DialogHeader>
          {editPayment && (
            <PaymentForm payment={editPayment} tenants={tenants} onSuccess={() => {
              setEditPayment(null)
              router.refresh()
            }} />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletePaymentId} onOpenChange={(open) => !open && setDeletePaymentId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pembayaran?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pembayaran akan dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeletingId === deletePaymentId}
            >
              {isDeletingId === deletePaymentId ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
