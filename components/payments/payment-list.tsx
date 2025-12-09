"use client"

import { useState } from "react"
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
import { Edit, Trash2, CreditCard, MoreHorizontal, CheckCircle, XCircle, Eye, FileImage, MessageCircle } from "lucide-react"
import { PaymentForm } from "./payment-form"
import { deletePayment, verifyPayment, rejectPayment } from "@/app/actions/payments"
import type { Payment, Tenant } from "@/lib/types"

interface PaymentListProps {
  payments: Payment[]
  tenants: Tenant[]
}

// Helper function to format phone number for WhatsApp
function formatWhatsAppNumber(phone: string | null | undefined): string | null {
  if (!phone) return null
  
  const cleaned = phone.replace(/\D/g, '')
  
  // Convert to international format
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.substring(1)
  } else if (cleaned.startsWith('62')) {
    return cleaned
  } else if (cleaned.startsWith('8')) {
    return '62' + cleaned
  }
  
  return null
}

// Generate WhatsApp message templates
function getWhatsAppMessage(type: 'approved' | 'rejected' | 'reminder', tenant: Tenant, payment: Payment, reason?: string): string {
  const amount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(payment.amount)

  if (type === 'approved') {
    return `Halo ${tenant.name},

Pembayaran Anda telah diverifikasi dan diterima ✅

Detail Pembayaran:
- Jumlah: ${amount}
- Status: LUNAS

Terima kasih telah melakukan pembayaran tepat waktu.

- KostManager`
  }

  if (type === 'rejected') {
    return `Halo ${tenant.name},

Mohon maaf, bukti pembayaran Anda tidak dapat diverifikasi ❌

Detail:
- Jumlah: ${amount}
- Status: DITOLAK
- Alasan: ${reason || "Bukti pembayaran tidak valid"}

Silakan upload ulang bukti pembayaran yang valid melalui website kami.

- KostManager`
  }

  // reminder
  return `Halo ${tenant.name},

Pengingat pembayaran sewa kost 🏠

Detail Pembayaran:
- Jumlah: ${amount}
- Jatuh Tempo: ${new Date(payment.due_date).toLocaleDateString("id-ID")}
- Status: ${payment.status === 'overdue' ? 'TUNGGAKAN' : 'BELUM DIBAYAR'}

Mohon segera lakukan pembayaran agar tidak terkena denda.

- KostManager`
}

export function PaymentList({ payments, tenants }: PaymentListProps) {
  const [editPayment, setEditPayment] = useState<Payment | null>(null)
  const [deletePaymentId, setDeletePaymentId] = useState<string | null>(null)
  const [viewProofPayment, setViewProofPayment] = useState<Payment | null>(null)
  const [rejectPaymentData, setRejectPaymentData] = useState<Payment | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
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
    setIsDeleting(true)
    await deletePayment(deletePaymentId)
    setIsDeleting(false)
    setDeletePaymentId(null)
  }

  const handleVerify = async (payment: Payment) => {
    setIsVerifying(true)
    await verifyPayment(payment.id)
    setIsVerifying(false)
    setViewProofPayment(null)
  }

  const handleReject = async () => {
    if (!rejectPaymentData) return
    setIsRejecting(true)
    await rejectPayment(rejectPaymentData.id, rejectReason)
    setIsRejecting(false)
    setRejectPaymentData(null)
    setRejectReason("")
    setViewProofPayment(null)
  }

  // Handle WhatsApp redirect
  const handleWhatsApp = (tenant: Tenant, payment: Payment, messageType: 'approved' | 'rejected' | 'reminder', reason?: string) => {
    const phone = formatWhatsAppNumber(tenant.phone)
    
    if (!phone) {
      alert('Nomor WhatsApp penyewa tidak valid atau tidak tersedia')
      return
    }

    const message = getWhatsAppMessage(messageType, tenant, payment, reason)
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`
    
    // Open in new tab
    window.open(whatsappUrl, '_blank')
  }

  // Filter pending payments first
  const sortedPayments = [...payments].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1
    if (a.status !== "pending" && b.status === "pending") return 1
    return new Date(b.due_date).getTime() - new Date(a.due_date).getTime()
  })

  if (payments.length === 0) {
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
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{payment.tenant?.name || "Unknown"}</span>
                        {payment.tenant?.phone && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => handleWhatsApp(
                              payment.tenant!, 
                              payment, 
                              payment.status === 'overdue' ? 'reminder' : 'reminder'
                            )}
                            title="Hubungi via WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {payment.tenant?.room ? (
                        <Badge variant="outline">Kamar {payment.tenant.room.room_number}</Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>{new Date(payment.due_date).toLocaleDateString("id-ID")}</TableCell>
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
                          {payment.tenant?.phone && (
                            <>
                              <DropdownMenuItem 
                                onClick={() => handleWhatsApp(payment.tenant!, payment, 'reminder')}
                                className="text-green-600"
                              >
                                <MessageCircle className="mr-2 h-4 w-4" />
                                WhatsApp Penyewa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {payment.status === "pending" && payment.proof_url && (
                            <>
                              <DropdownMenuItem onClick={() => setViewProofPayment(payment)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Verifikasi Bukti
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          {payment.status === "pending" && !payment.proof_url && (
                            <DropdownMenuItem onClick={() => handleVerify(payment)}>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Tandai Lunas
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => setEditPayment(payment)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeletePaymentId(payment.id)}>
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
        {sortedPayments.map((payment) => (
          <Card key={payment.id} className={payment.status === "pending" ? "border-yellow-500/50" : ""}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{payment.tenant?.name || "Unknown"}</p>
                    {payment.tenant?.phone && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleWhatsApp(
                          payment.tenant!, 
                          payment, 
                          payment.status === 'overdue' ? 'reminder' : 'reminder'
                        )}
                      >
                        <MessageCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                  </div>
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
                  <span>{new Date(payment.due_date).toLocaleDateString("id-ID")}</span>
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
                {payment.tenant?.phone && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleWhatsApp(payment.tenant!, payment, 'reminder')}
                    className="flex-1 text-green-600 border-green-600"
                  >
                    <MessageCircle className="mr-1 h-3 w-3" />
                    WA
                  </Button>
                )}
                {payment.status === "pending" && payment.proof_url && (
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
                {payment.status === "pending" && !payment.proof_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerify(payment)}
                    className="flex-1"
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Lunas
                  </Button>
                )}
                <Button variant="outline" size="sm" onClick={() => setEditPayment(payment)} className="flex-1">
                  <Edit className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => setDeletePaymentId(payment.id)} className="text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Proof Dialog */}
      <Dialog open={!!viewProofPayment} onOpenChange={() => setViewProofPayment(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Verifikasi Bukti Pembayaran</DialogTitle>
            <DialogDescription>
              Pembayaran dari {viewProofPayment?.tenant?.name} - {formatCurrency(viewProofPayment?.amount || 0)}
            </DialogDescription>
          </DialogHeader>
          {viewProofPayment?.proof_url && (
            <div className="space-y-4">
              <div className="rounded-lg border overflow-hidden">
                {viewProofPayment.proof_url.endsWith(".pdf") ? (
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
          {viewProofPayment?.status === "pending" && (
            <DialogFooter className="gap-2 sm:gap-0">
              {viewProofPayment.tenant?.phone && (
                <Button
                  variant="outline"
                  onClick={() => {
                    handleWhatsApp(viewProofPayment.tenant!, viewProofPayment, 'reminder')
                  }}
                  className="text-green-600 border-green-600"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              )}
              <Button
                variant="destructive"
                onClick={() => {
                  setRejectPaymentData(viewProofPayment)
                }}
                disabled={isVerifying}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Tolak
              </Button>
              <Button onClick={() => handleVerify(viewProofPayment)} disabled={isVerifying}>
                {isVerifying ? (
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
      <Dialog open={!!rejectPaymentData} onOpenChange={() => setRejectPaymentData(null)}>
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
          <DialogFooter className="gap-2 sm:gap-0">
            {rejectPaymentData?.tenant?.phone && (
              <Button
                variant="outline"
                onClick={() => {
                  handleWhatsApp(rejectPaymentData.tenant!, rejectPaymentData, 'rejected', rejectReason)
                  setRejectPaymentData(null)
                }}
                className="text-green-600 border-green-600"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Kirim via WA & Tolak
              </Button>
            )}
            <Button variant="outline" onClick={() => setRejectPaymentData(null)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isRejecting}>
              {isRejecting ? "Memproses..." : "Tolak Pembayaran"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editPayment} onOpenChange={() => setEditPayment(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Pembayaran</DialogTitle>
          </DialogHeader>
          {editPayment && (
            <PaymentForm payment={editPayment} tenants={tenants} onSuccess={() => setEditPayment(null)} />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletePaymentId} onOpenChange={() => setDeletePaymentId(null)}>
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
