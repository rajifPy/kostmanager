"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell, Send, CheckCircle2, MessageCircle } from "lucide-react"
import { markReminderSent } from "@/app/actions/reminders"
import type { Reminder, Payment, Tenant } from "@/lib/types"
import { useState } from "react"

interface ReminderListProps {
  reminders: Reminder[]
}

// Helper function to format phone number for WhatsApp
function formatWhatsAppNumber(phone: string | null | undefined): string | null {
  if (!phone) return null
  
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length < 8 || cleaned.length > 15) {
    return null
  }
  
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.substring(1)
  } else if (cleaned.startsWith('62')) {
    return cleaned
  } else if (cleaned.startsWith('8')) {
    return '62' + cleaned
  }
  
  return null
}

// Generate WhatsApp reminder message
function generateReminderMessage(
  reminder: { reminder_type: string },
  payment: { amount: number; due_date: string },
  tenant: { name: string }
): string {
  const amount = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(payment.amount)

  const dueDate = new Date(payment.due_date).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  let intro = ""
  switch (reminder.reminder_type) {
    case "7_days":
      intro = "Pembayaran sewa kost Anda akan jatuh tempo dalam 7 hari."
      break
    case "3_days":
      intro = "Pembayaran sewa kost Anda akan jatuh tempo dalam 3 hari."
      break
    case "due_day":
      intro = "Pembayaran sewa kost Anda jatuh tempo HARI INI."
      break
    default:
      intro = "Pengingat pembayaran sewa kost Anda."
  }

  return `Halo ${tenant.name},

${intro}

Detail Pembayaran:
- Jumlah: ${amount}
- Jatuh Tempo: ${dueDate}

Mohon segera lakukan pembayaran dan upload bukti pembayaran melalui website kami.

Terima kasih.
- KostManager`
}

export function ReminderList({ reminders }: ReminderListProps) {
  const [sendingId, setSendingId] = useState<string | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getReminderTypeLabel = (type: string) => {
    switch (type) {
      case "7_days":
        return "H-7"
      case "3_days":
        return "H-3"
      case "due_day":
        return "Hari H"
      default:
        return type
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Terkirim
          </Badge>
        )
      case "pending":
        return <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Gagal</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleMarkSent = async (id: string) => {
    await markReminderSent(id)
  }

  const handleSendWhatsApp = async (reminder: Reminder) => {
    const payment = reminder.payment as Payment & { tenant?: Tenant }
    const tenant = payment?.tenant
    
    if (!tenant) {
      alert('Data penyewa tidak ditemukan')
      return
    }

    const phone = formatWhatsAppNumber(tenant.phone)
    
    if (!phone) {
      alert('Nomor WhatsApp penyewa tidak valid atau tidak tersedia')
      return
    }

    setSendingId(reminder.id)

    const message = generateReminderMessage(
      reminder,
      { amount: payment.amount, due_date: payment.due_date },
      { name: tenant.name }
    )
    
    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank')
    
    // Mark as sent after opening WhatsApp
    setTimeout(async () => {
      await handleMarkSent(reminder.id)
      setSendingId(null)
    }, 1000)
  }

  if (reminders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bell className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Belum ada reminder</p>
          <p className="text-sm text-muted-foreground">Reminder akan dibuat otomatis saat membuat pembayaran baru</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      {/* Desktop View */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Penyewa</TableHead>
                <TableHead>Pembayaran</TableHead>
                <TableHead>Tanggal Reminder</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reminders.map((reminder) => {
                const payment = reminder.payment as Payment & { tenant?: Tenant }
                const tenant = payment?.tenant
                const hasPhone = !!formatWhatsAppNumber(tenant?.phone)
                
                return (
                  <TableRow key={reminder.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{tenant?.name || "Unknown"}</span>
                        {hasPhone && (
                          <MessageCircle className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{formatCurrency(payment?.amount || 0)}</p>
                        <p className="text-xs text-muted-foreground">
                          Jatuh tempo: {payment?.due_date ? new Date(payment.due_date).toLocaleDateString("id-ID") : "-"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(reminder.reminder_date).toLocaleDateString("id-ID")}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getReminderTypeLabel(reminder.reminder_type)}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(reminder.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {hasPhone && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendWhatsApp(reminder)}
                            disabled={sendingId === reminder.id}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            <MessageCircle className="mr-1 h-3 w-3" />
                            {sendingId === reminder.id ? "Mengirim..." : "Kirim WA"}
                          </Button>
                        )}
                        {reminder.status === "pending" && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleMarkSent(reminder.id)}
                          >
                            <Send className="mr-1 h-3 w-3" />
                            Tandai Terkirim
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {reminders.map((reminder) => {
          const payment = reminder.payment as Payment & { tenant?: Tenant }
          const tenant = payment?.tenant
          const hasPhone = !!formatWhatsAppNumber(tenant?.phone)
          
          return (
            <Card key={reminder.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{tenant?.name || "Unknown"}</p>
                      {hasPhone && (
                        <MessageCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <Badge variant="outline" className="mt-1">
                      {getReminderTypeLabel(reminder.reminder_type)}
                    </Badge>
                  </div>
                  {getStatusBadge(reminder.status)}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jumlah:</span>
                    <span className="font-medium">{formatCurrency(payment?.amount || 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jatuh Tempo:</span>
                    <span>{payment?.due_date ? new Date(payment.due_date).toLocaleDateString("id-ID") : "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tanggal Reminder:</span>
                    <span>{new Date(reminder.reminder_date).toLocaleDateString("id-ID")}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  {hasPhone && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendWhatsApp(reminder)}
                      disabled={sendingId === reminder.id}
                      className="flex-1 text-green-600 border-green-600"
                    >
                      <MessageCircle className="mr-1 h-3 w-3" />
                      {sendingId === reminder.id ? "Mengirim..." : "Kirim WA"}
                    </Button>
                  )}
                  {reminder.status === "pending" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleMarkSent(reminder.id)}
                      className="flex-1"
                    >
                      <Send className="mr-1 h-3 w-3" />
                      Tandai Terkirim
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}
