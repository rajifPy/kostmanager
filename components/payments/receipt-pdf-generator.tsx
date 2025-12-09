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

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const generatePDF = async () => {
    try {
      setIsGenerating(true)

      // Dynamically import jsPDF dan autoTable
      const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable')
      ])

      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const margin = 20
      const contentWidth = pageWidth - (margin * 2)

      // Header dengan background gradient
      doc.setFillColor(59, 130, 246) // Blue-500
      doc.rect(0, 0, pageWidth, 35, 'F')
      
      // Logo/Title
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(20)
      doc.setFont("helvetica", "bold")
      doc.text("KOST MANAGER", pageWidth / 2, 20, { align: "center" })
      
      doc.setFontSize(11)
      doc.setFont("helvetica", "normal")
      doc.text("SISTEM MANAJEMEN KOST TERPADU", pageWidth / 2, 27, { align: "center" })

      // Title Document
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(16)
      doc.setFont("helvetica", "bold")
      doc.text("BUKTI VERIFIKASI PEMBAYARAN", pageWidth / 2, 50, { align: "center" })

      // Status Badge
      doc.setFontSize(12)
      if (status === "approved") {
        doc.setFillColor(34, 197, 94) // Green
        doc.roundedRect(pageWidth / 2 - 25, 55, 50, 12, 3, 3, 'F')
        doc.setTextColor(255, 255, 255)
        doc.text("DISETUJUI", pageWidth / 2, 62.5, { align: "center" })
      } else {
        doc.setFillColor(239, 68, 68) // Red
        doc.roundedRect(pageWidth / 2 - 25, 55, 50, 12, 3, 3, 'F')
        doc.setTextColor(255, 255, 255)
        doc.text("DITOLAK", pageWidth / 2, 62.5, { align: "center" })
      }

      // Metadata
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(9)
      doc.setFont("helvetica", "normal")
      doc.text(`ID Transaksi: ${payment.id.substring(0, 8).toUpperCase()}`, margin, 80)
      doc.text(`Tanggal Verifikasi: ${formatDateTime(new Date().toISOString())}`, pageWidth - margin, 80, { align: "right" })

      // Divider
      doc.setDrawColor(200, 200, 200)
      doc.line(margin, 85, pageWidth - margin, 85)

      // Tenant Information
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("INFORMASI PENYEWA", margin, 95)

      const tenantData = [
        ["Nama", ":", payment.tenant?.name || "-"],
        ["Kamar", ":", payment.tenant?.room?.room_number ? `Kamar ${payment.tenant.room.room_number}` : "-"],
        ["No. Telepon", ":", payment.tenant?.phone || "-"],
        ["Email", ":", payment.tenant?.email || "-"]
      ]

      let yPos = 105
      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      
      tenantData.forEach(([label, separator, value]) => {
        doc.setTextColor(100, 100, 100)
        doc.text(label, margin, yPos)
        doc.setTextColor(0, 0, 0)
        doc.text(`${separator} ${value}`, margin + 40, yPos)
        yPos += 7
      })

      yPos += 10

      // Payment Details
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("DETAIL PEMBAYARAN", margin, yPos)
      yPos += 10

      const paymentData = [
        ["Jumlah Pembayaran", ":", formatCurrency(payment.amount)],
        ["Tanggal Jatuh Tempo", ":", formatDate(payment.due_date)],
        ["Tanggal Bayar", ":", payment.paid_date ? formatDate(payment.paid_date) : "-"],
        ["Metode Pembayaran", ":", "Transfer Bank"],
        ["Status", ":", status === "approved" ? "LUNAS" : "DITOLAK"]
      ]

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      
      paymentData.forEach(([label, separator, value]) => {
        doc.setTextColor(100, 100, 100)
        doc.text(label, margin, yPos)
        doc.setTextColor(0, 0, 0)
        doc.text(`${separator} ${value}`, margin + 50, yPos)
        yPos += 7
      })

      // Notes/Reason
      if (payment.notes || reason) {
        yPos += 5
        doc.setTextColor(100, 100, 100)
        doc.text("Catatan / Alasan", margin, yPos)
        doc.setTextColor(0, 0, 0)
        const noteText = status === "rejected" && reason ? reason : payment.notes || "-"
        const splitNote = doc.splitTextToSize(noteText, contentWidth - 50)
        doc.text(splitNote, margin + 50, yPos)
        yPos += (splitNote.length * 5) + 10
      }

      // Proof Image Section (if available)
      if (payment.proof_url && payment.proof_url.startsWith('http')) {
        // Check if we need a new page
        if (yPos > pageHeight - 80) {
          doc.addPage()
          yPos = margin
        }

        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text("BUKTI TRANSFER", margin, yPos)
        yPos += 10

        try {
          // Add loading text
          doc.setFontSize(10)
          doc.setTextColor(100, 100, 100)
          doc.text("Memuat gambar bukti transfer...", pageWidth / 2, yPos, { align: "center" })
          
          // Load image
          const imgData = await fetch(payment.proof_url, { mode: 'cors' })
            .then(res => {
              if (!res.ok) throw new Error('Failed to fetch image')
              return res.blob()
            })
            .then(blob => {
              return new Promise<string>((resolve, reject) => {
                const reader = new FileReader()
                reader.onloadend = () => resolve(reader.result as string)
                reader.onerror = reject
                reader.readAsDataURL(blob)
              })
            })

          const imgWidth = 120
          const imgHeight = 80
          const xPos = (pageWidth - imgWidth) / 2

          if (yPos + imgHeight > pageHeight - 40) {
            doc.addPage()
            yPos = margin
          }

          doc.addImage(imgData, 'JPEG', xPos, yPos, imgWidth, imgHeight)
          
          // Add caption
          yPos += imgHeight + 5
          doc.setFontSize(9)
          doc.setTextColor(100, 100, 100)
          doc.text("Bukti Transfer", pageWidth / 2, yPos, { align: "center" })
          yPos += 5
        } catch (error) {
          console.error('Error loading image:', error)
          doc.setFontSize(9)
          doc.setTextColor(150, 150, 150)
          doc.text("(Bukti transfer tidak dapat dimuat)", pageWidth / 2, yPos, { align: "center" })
          yPos += 10
        }
      }

      // Footer
      const footerY = pageHeight - 20
      doc.setDrawColor(220, 220, 220)
      doc.line(margin, footerY, pageWidth - margin, footerY)
      
      doc.setFontSize(8)
      doc.setTextColor(120, 120, 120)
      doc.text("Dokumen ini digenerate secara otomatis oleh sistem KostManager", pageWidth / 2, footerY + 5, { align: "center" })
      doc.text(`Hal: 1/1 • Dicetak pada: ${new Date().toLocaleString("id-ID")}`, pageWidth / 2, footerY + 10, { align: "center" })

      // Verification Signature Area
      const signatureY = yPos + 20
      if (signatureY < footerY - 30) {
        doc.setFontSize(10)
        doc.setTextColor(0, 0, 0)
        doc.text("Verifikasi oleh:", pageWidth - margin - 50, signatureY, { align: "left" })
        
        doc.line(pageWidth - margin - 50, signatureY + 15, pageWidth - margin, signatureY + 15)
        doc.setFontSize(9)
        doc.setTextColor(100, 100, 100)
        doc.text("Admin KostManager", pageWidth - margin - 25, signatureY + 25, { align: "center" })
      }

      // Save the PDF
      const statusText = status === "approved" ? "Disetujui" : "Ditolak"
      const tenantName = payment.tenant?.name?.replace(/[^a-zA-Z0-9]/g, '-') || 'Unknown'
      const fileName = `Bukti-Verifikasi-${statusText}-${tenantName}-${payment.id.substring(0, 6)}.pdf`
      doc.save(fileName)

    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Terjadi kesalahan saat membuat PDF. Silakan coba lagi.')
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
          {status === "approved" ? "Unduh Bukti" : "Unduh Penolakan"}
        </>
      )}
    </Button>
  )
}
