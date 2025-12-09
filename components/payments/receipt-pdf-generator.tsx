"use client"

import { Button } from "@/components/ui/button"
import { FileDown, Loader2 } from "lucide-react"
import { useState } from "react"
import type { Payment, Tenant } from "@/lib/types"

interface GenerateReceiptPDFProps {
  payment: Payment & { tenant?: Tenant }
  status: "approved" | "rejected"
  reason?: string
}

export function GenerateReceiptPDF({ payment, status, reason }: GenerateReceiptPDFProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  // Don't show button if payment doesn't have verification status
  if (!payment.proof_url && status === "approved") {
    return null
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const generatePDF = async () => {
    try {
      setIsGenerating(true)

      // Dynamically import jsPDF dan autoTable
      const [{ default: jsPDF }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable')
      ])

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height

      // Header
      doc.setFillColor(79, 70, 229) // Primary color
      doc.rect(0, 0, pageWidth, 40, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.text("KostManager", pageWidth / 2, 20, { align: "center" })
      doc.setFontSize(12)
      doc.text("Bukti Verifikasi Pembayaran", pageWidth / 2, 30, { align: "center" })

      // Status Badge
      let yPos = 50
      doc.setFontSize(14)
      
      if (status === "approved") {
        doc.setFillColor(34, 197, 94) // Green
        doc.setTextColor(255, 255, 255)
        doc.roundedRect(pageWidth / 2 - 30, yPos, 60, 12, 3, 3, 'F')
        doc.text("✓ DISETUJUI", pageWidth / 2, yPos + 8, { align: "center" })
      } else {
        doc.setFillColor(239, 68, 68) // Red
        doc.setTextColor(255, 255, 255)
        doc.roundedRect(pageWidth / 2 - 25, yPos, 50, 12, 3, 3, 'F')
        doc.text("✗ DITOLAK", pageWidth / 2, yPos + 8, { align: "center" })
      }

      yPos += 25

      // Reset text color
      doc.setTextColor(40, 40, 40)
      doc.setFontSize(10)

      // Transaction ID
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text(`ID Transaksi: ${payment.id.substring(0, 8).toUpperCase()}`, pageWidth / 2, yPos, { align: "center" })
      yPos += 5
      doc.text(`Tanggal Verifikasi: ${formatDate(new Date().toISOString())}`, pageWidth / 2, yPos, { align: "center" })
      
      yPos += 15

      // Divider
      doc.setDrawColor(200, 200, 200)
      doc.line(20, yPos, pageWidth - 20, yPos)
      yPos += 15

      // Tenant Information Section
      doc.setFontSize(12)
      doc.setTextColor(40, 40, 40)
      doc.text("INFORMASI PENYEWA", 20, yPos)
      yPos += 10

      const tenantInfo = [
        ["Nama", payment.tenant?.name || "-"],
        ["Kamar", payment.tenant?.room?.room_number ? `Kamar ${payment.tenant.room.room_number}` : "-"],
        ["No. Telepon", payment.tenant?.phone || "-"],
        ["Email", payment.tenant?.email || "-"],
      ]

      doc.setFontSize(10)
      tenantInfo.forEach(([label, value]) => {
        doc.setTextColor(100, 100, 100)
        doc.text(label, 25, yPos)
        doc.setTextColor(40, 40, 40)
        doc.text(`: ${value}`, 60, yPos)
        yPos += 7
      })

      yPos += 8

      // Divider
      doc.setDrawColor(200, 200, 200)
      doc.line(20, yPos, pageWidth - 20, yPos)
      yPos += 15

      // Payment Details Section
      doc.setFontSize(12)
      doc.setTextColor(40, 40, 40)
      doc.text("DETAIL PEMBAYARAN", 20, yPos)
      yPos += 10

      const paymentDetails = [
        ["Jumlah Pembayaran", formatCurrency(payment.amount)],
        ["Tanggal Jatuh Tempo", formatDate(payment.due_date)],
        ["Tanggal Bayar", payment.paid_date ? formatDate(payment.paid_date) : "-"],
        ["Status Pembayaran", status === "approved" ? "LUNAS" : "DITOLAK"],
      ]

      doc.setFontSize(10)
      paymentDetails.forEach(([label, value]) => {
        doc.setTextColor(100, 100, 100)
        doc.text(label, 25, yPos)
        doc.setTextColor(40, 40, 40)
        doc.text(`: ${value}`, 70, yPos)
        yPos += 7
      })

      // Notes/Reason if rejected
      if (payment.notes || reason) {
        yPos += 5
        doc.setTextColor(100, 100, 100)
        doc.text("Catatan", 25, yPos)
        doc.setTextColor(40, 40, 40)
        const noteText = status === "rejected" && reason ? reason : payment.notes || "-"
        const splitNote = doc.splitTextToSize(`: ${noteText}`, pageWidth - 90)
        doc.text(splitNote, 70, yPos)
        yPos += (splitNote.length * 5) + 5
      }

      yPos += 8

      // Divider
      doc.setDrawColor(200, 200, 200)
      doc.line(20, yPos, pageWidth - 20, yPos)
      yPos += 15

      // Proof Image Section (if available)
      if (payment.proof_url) {
        doc.setFontSize(12)
        doc.setTextColor(40, 40, 40)
        doc.text("BUKTI PEMBAYARAN", 20, yPos)
        yPos += 10

        try {
          // Try to embed the image
          const imgData = await fetch(payment.proof_url)
            .then(res => res.blob())
            .then(blob => {
              return new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result as string)
                reader.onerror = reject
                reader.readAsDataURL(blob)
              })
            })

          const imgWidth = 150
          const imgHeight = 100
          const xPos = (pageWidth - imgWidth) / 2

          if (yPos + imgHeight > pageHeight - 30) {
            doc.addPage()
            yPos = 20
          }

          doc.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight)
          yPos += imgHeight + 10
        } catch (error) {
          console.error('Error loading image:', error)
          doc.setFontSize(9)
          doc.setTextColor(100, 100, 100)
          doc.text("(Bukti pembayaran tersedia di sistem)", 25, yPos)
          doc.text(`URL: ${payment.proof_url}`, 25, yPos + 5)
          yPos += 15
        }
      }

      // Footer
      const footerY = pageHeight - 25
      doc.setDrawColor(200, 200, 200)
      doc.line(20, footerY, pageWidth - 20, footerY)
      
      doc.setFontSize(8)
      doc.setTextColor(120, 120, 120)
      doc.text("Dokumen ini digenerate secara otomatis oleh sistem KostManager", pageWidth / 2, footerY + 6, { align: "center" })
      doc.text(`Dicetak pada: ${new Date().toLocaleString("id-ID")}`, pageWidth / 2, footerY + 11, { align: "center" })

      // Verification Note
      if (status === "approved") {
        doc.setFontSize(9)
        doc.setTextColor(34, 197, 94)
        doc.text("✓ Pembayaran telah diverifikasi dan diterima", pageWidth / 2, footerY + 17, { align: "center" })
      } else {
        doc.setFontSize(9)
        doc.setTextColor(239, 68, 68)
        doc.text("✗ Pembayaran ditolak, mohon upload ulang bukti yang valid", pageWidth / 2, footerY + 17, { align: "center" })
      }

      // Save the PDF
      const statusText = status === "approved" ? "Disetujui" : "Ditolak"
      const fileName = `Bukti-Pembayaran-${statusText}-${payment.tenant?.name?.replace(/\s/g, '-') || 'Unknown'}-${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)

    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Terjadi kesalahan saat membuat PDF')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={generatePDF}
      variant="outline"
      size="sm"
      disabled={isGenerating}
      className="gap-2"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Membuat PDF...
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          Unduh Bukti PDF
        </>
      )}
    </Button>
  )
}
