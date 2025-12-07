"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bell, Send, CheckCircle2 } from "lucide-react"
import { markReminderSent } from "@/app/actions/reminders"
import type { Reminder, Payment, Tenant } from "@/lib/types"

interface ReminderListProps {
  reminders: Reminder[]
}

export function ReminderList({ reminders }: ReminderListProps) {
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
    <Card>
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
              return (
                <TableRow key={reminder.id}>
                  <TableCell className="font-medium">{payment?.tenant?.name || "Unknown"}</TableCell>
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
                    {reminder.status === "pending" && (
                      <Button variant="outline" size="sm" onClick={() => handleMarkSent(reminder.id)}>
                        <Send className="mr-1 h-3 w-3" />
                        Tandai Terkirim
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
