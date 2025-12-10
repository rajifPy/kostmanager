// components/bookings/booking-list.tsx
"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Calendar, DollarSign, Home, MessageCircle, MoreHorizontal, Phone, Mail, Trash2, User, Clock } from "lucide-react"
import { updateBookingStatus, deleteBooking } from "@/app/actions/bookings"
import type { Booking } from "@/lib/types"

interface BookingListProps {
  bookings: Booking[]
}

export function BookingList({ bookings }: BookingListProps) {
  const [deleteBookingId, setDeleteBookingId] = useState<string | null>(null)
  const [viewBooking, setViewBooking] = useState<Booking | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const formatCurrency = (amount: number | null) => {
    if (!amount) return "-"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Dikonfirmasi</Badge>
      case "contacted":
        return <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">Dihubungi</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Menunggu</Badge>
      case "cancelled":
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Dibatalkan</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleDelete = async () => {
    if (!deleteBookingId) return
    setIsDeleting(true)
    await deleteBooking(deleteBookingId)
    setIsDeleting(false)
    setDeleteBookingId(null)
  }

  const handleStatusChange = async (id: string, status: string) => {
    setIsUpdating(true)
    await updateBookingStatus(id, status)
    setIsUpdating(false)
  }

  const handleWhatsApp = (booking: Booking) => {
    const phone = booking.phone.replace(/\D/g, '')
    const formattedPhone = phone.startsWith('0') ? '62' + phone.substring(1) : phone.startsWith('62') ? phone : '62' + phone
    
    const message = `Halo ${booking.name}, terima kasih telah menghubungi kami untuk booking kamar kost. Kami ingin menindaklanjuti permintaan Anda.`
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`
    
    window.open(whatsappUrl, '_blank')
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Belum ada booking</p>
          <p className="text-sm text-muted-foreground">Booking dari calon penyewa akan muncul di sini</p>
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
                  <TableHead>Nama</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead>Preferensi</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Rencana Masuk</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow
                    key={booking.id}
                    className={booking.status === "pending" ? "bg-yellow-50/50 dark:bg-yellow-950/10" : ""}
                  >
                    <TableCell className="font-medium">
                      <div>
                        <p>{booking.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(booking.created_at).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {booking.phone}
                        </div>
                        {booking.email && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {booking.email}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.room_preference ? (
                        <Badge variant="outline">
                          {booking.room_preference === "single" ? "Single" : 
                           booking.room_preference === "shared" ? "Sharing" : "Apa Saja"}
                        </Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {booking.budget_min || booking.budget_max ? (
                        <div className="text-sm">
                          {booking.budget_min && formatCurrency(booking.budget_min)}
                          {booking.budget_min && booking.budget_max && " - "}
                          {booking.budget_max && formatCurrency(booking.budget_max)}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      {booking.move_in_date ? (
                        <div className="text-sm">
                          {new Date(booking.move_in_date).toLocaleDateString("id-ID")}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" disabled={isUpdating}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setViewBooking(booking)}>
                            <User className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleWhatsApp(booking)} className="text-green-600">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            WhatsApp
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {booking.status !== "contacted" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "contacted")}>
                              Tandai Dihubungi
                            </DropdownMenuItem>
                          )}
                          {booking.status !== "confirmed" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "confirmed")}>
                              Tandai Dikonfirmasi
                            </DropdownMenuItem>
                          )}
                          {booking.status !== "cancelled" && (
                            <DropdownMenuItem onClick={() => handleStatusChange(booking.id, "cancelled")}>
                              Tandai Dibatalkan
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => setDeleteBookingId(booking.id)}>
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
        {bookings.map((booking) => (
          <Card key={booking.id} className={booking.status === "pending" ? "border-yellow-500/50" : ""}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">{booking.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(booking.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
                {getStatusBadge(booking.status)}
              </div>

              <div className="space-y-2 text-sm mb-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.phone}</span>
                </div>
                {booking.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{booking.email}</span>
                  </div>
                )}
                {booking.room_preference && (
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {booking.room_preference === "single" ? "Kamar Single" : 
                       booking.room_preference === "shared" ? "Kamar Sharing" : "Apa Saja"}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewBooking(booking)}
                  className="flex-1 min-w-[100px]"
                >
                  Detail
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleWhatsApp(booking)}
                  className="flex-1 min-w-[100px] text-green-600 border-green-600"
                >
                  <MessageCircle className="mr-1 h-3 w-3" />
                  WA
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteBookingId(booking.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Booking Detail Dialog */}
      <Dialog open={!!viewBooking} onOpenChange={() => setViewBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Booking</DialogTitle>
          </DialogHeader>
          {viewBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nama</p>
                  <p className="font-medium">{viewBooking.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(viewBooking.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telepon</p>
                  <p className="font-medium">{viewBooking.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{viewBooking.email || "-"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Preferensi Kamar</p>
                  <p className="font-medium">
                    {viewBooking.room_preference === "single" ? "Kamar Single" : 
                     viewBooking.room_preference === "shared" ? "Kamar Sharing" : 
                     viewBooking.room_preference === "any" ? "Apa Saja" : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">
                    {viewBooking.budget_min && formatCurrency(viewBooking.budget_min)}
                    {viewBooking.budget_min && viewBooking.budget_max && " - "}
                    {viewBooking.budget_max && formatCurrency(viewBooking.budget_max)}
                    {!viewBooking.budget_min && !viewBooking.budget_max && "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rencana Masuk</p>
                  <p className="font-medium">
                    {viewBooking.move_in_date ? new Date(viewBooking.move_in_date).toLocaleDateString("id-ID") : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Durasi</p>
                  <p className="font-medium">
                    {viewBooking.duration_months ? `${viewBooking.duration_months} bulan` : "-"}
                  </p>
                </div>
              </div>
              
              {viewBooking.message && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pesan</p>
                  <p className="text-sm p-3 bg-muted rounded-md">{viewBooking.message}</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => handleWhatsApp(viewBooking)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Hubungi via WhatsApp
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {viewBooking.status !== "contacted" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleStatusChange(viewBooking.id, "contacted")
                      setViewBooking(null)
                    }}
                    disabled={isUpdating}
                  >
                    Tandai Dihubungi
                  </Button>
                )}
                {viewBooking.status !== "confirmed" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleStatusChange(viewBooking.id, "confirmed")
                      setViewBooking(null)
                    }}
                    disabled={isUpdating}
                  >
                    Tandai Dikonfirmasi
                  </Button>
                )}
                {viewBooking.status !== "cancelled" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleStatusChange(viewBooking.id, "cancelled")
                      setViewBooking(null)
                    }}
                    disabled={isUpdating}
                  >
                    Tandai Dibatalkan
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteBookingId} onOpenChange={() => setDeleteBookingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data booking akan dihapus secara permanen.
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