"use client"

import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { useState } from "react"

interface MonthlyData {
  month: string
  revenue: number
  payments: number
}

interface StatusBreakdown {
  paid: number
  pending: number
  overdue: number
  rejected: number
}

interface TopTenant {
  name: string
  total: number
  count: number
  room?: string
}

interface ExportPDFProps {
  monthlyData: MonthlyData[]
  statusBreakdown: StatusBreakdown
  occupancyRate: number
  avgPayment: number
  revenueChange: number
  topTenants: TopTenant[]
  totalRevenue: number
  totalPayments: number
  activeTenantsCount: number
  totalRooms: number
}

export function ExportPDFButton({ 
  monthlyData,
  statusBreakdown,
  occupancyRate,
  avgPayment,
  revenueChange,
  topTenants,
  totalRevenue,
  totalPayments,
  activeTenantsCount,
  totalRooms
}: ExportPDFProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const generatePDF = async () => {
    try {
      setIsGenerating(true)
      
      // Dynamically import jsPDF to avoid SSR issues
      const { default: jsPDF } = await import('jspdf')
      await import('jspdf-autotable')
      
      const doc = new jsPDF() as any
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      let yPosition = 20

      // Header
      doc.setFontSize(20)
      doc.setTextColor(40, 40, 40)
      doc.text("Laporan Statistik KostManager", pageWidth / 2, yPosition, { align: "center" })
      
      yPosition += 5
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Tanggal: ${new Date().toLocaleDateString("id-ID", { 
        day: "numeric", 
        month: "long", 
        year: "numeric" 
      })}`, pageWidth / 2, yPosition, { align: "center" })
      
      yPosition += 15

      // Section 1: Key Metrics
      doc.setFontSize(14)
      doc.setTextColor(40, 40, 40)
      doc.text("Ringkasan Utama", 14, yPosition)
      yPosition += 8

      const keyMetrics = [
        ["Total Pendapatan", formatCurrency(totalRevenue)],
        ["Perubahan dari Bulan Lalu", `${revenueChange >= 0 ? '+' : ''}${revenueChange.toFixed(1)}%`],
        ["Tingkat Hunian", `${occupancyRate.toFixed(1)}%`],
        ["Rata-rata Pembayaran", formatCurrency(avgPayment)],
        ["Total Transaksi", totalPayments.toString()],
        ["Penyewa Aktif", activeTenantsCount.toString()],
        ["Total Kamar", totalRooms.toString()],
      ]

      doc.autoTable({
        startY: yPosition,
        head: [["Metrik", "Nilai"]],
        body: keyMetrics,
        theme: "grid",
        headStyles: { fillColor: [79, 70, 229], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 'auto', halign: 'right' }
        }
      })

      yPosition = doc.lastAutoTable.finalY + 15

      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        doc.addPage()
        yPosition = 20
      }

      // Section 2: Monthly Revenue
      doc.setFontSize(14)
      doc.text("Tren Pendapatan (6 Bulan Terakhir)", 14, yPosition)
      yPosition += 8

      const monthlyDataTable = monthlyData.map(data => [
        data.month,
        formatCurrency(data.revenue),
        data.payments.toString()
      ])

      doc.autoTable({
        startY: yPosition,
        head: [["Bulan", "Pendapatan", "Jumlah Pembayaran"]],
        body: monthlyDataTable,
        theme: "grid",
        headStyles: { fillColor: [79, 70, 229], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 'auto', halign: 'right' },
          2: { cellWidth: 50, halign: 'center' }
        }
      })

      yPosition = doc.lastAutoTable.finalY + 15

      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        doc.addPage()
        yPosition = 20
      }

      // Section 3: Payment Status
      doc.setFontSize(14)
      doc.text("Status Pembayaran", 14, yPosition)
      yPosition += 8

      const statusData = [
        ["Lunas", statusBreakdown.paid.toString(), `${((statusBreakdown.paid / totalPayments) * 100).toFixed(0)}%`],
        ["Pending", statusBreakdown.pending.toString(), `${((statusBreakdown.pending / totalPayments) * 100).toFixed(0)}%`],
        ["Tunggakan", statusBreakdown.overdue.toString(), `${((statusBreakdown.overdue / totalPayments) * 100).toFixed(0)}%`],
        ["Ditolak", statusBreakdown.rejected.toString(), `${((statusBreakdown.rejected / totalPayments) * 100).toFixed(0)}%`],
      ]

      doc.autoTable({
        startY: yPosition,
        head: [["Status", "Jumlah", "Persentase"]],
        body: statusData,
        theme: "grid",
        headStyles: { fillColor: [79, 70, 229], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 'auto', halign: 'center' },
          2: { cellWidth: 40, halign: 'right' }
        }
      })

      yPosition = doc.lastAutoTable.finalY + 15

      // Check if we need a new page
      if (yPosition > pageHeight - 80) {
        doc.addPage()
        yPosition = 20
      }

      // Section 4: Top Tenants
      doc.setFontSize(14)
      doc.text("Top 5 Penyewa", 14, yPosition)
      yPosition += 8

      const topTenantsData = topTenants.length > 0 
        ? topTenants.map((tenant, index) => [
            `#${index + 1}`,
            tenant.name,
            tenant.room || '-',
            tenant.count.toString(),
            formatCurrency(tenant.total)
          ])
        : [["", "Belum ada data pembayaran", "", "", ""]]

      doc.autoTable({
        startY: yPosition,
        head: [["Rank", "Nama", "Kamar", "Pembayaran", "Total"]],
        body: topTenantsData,
        theme: "grid",
        headStyles: { fillColor: [79, 70, 229], textColor: 255 },
        styles: { fontSize: 10, cellPadding: 4 },
        columnStyles: {
          0: { cellWidth: 20, halign: 'center' },
          1: { cellWidth: 60 },
          2: { cellWidth: 25, halign: 'center' },
          3: { cellWidth: 30, halign: 'center' },
          4: { cellWidth: 'auto', halign: 'right' }
        }
      })

      // Footer on last page
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        `Generated by KostManager - ${new Date().toLocaleString("id-ID")}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      )

      // Save the PDF
      const fileName = `Laporan-Statistik-${new Date().toISOString().split('T')[0]}.pdf`
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
    >
      {isGenerating ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Membuat PDF...
        </>
      ) : (
        <>
          <FileDown className="mr-2 h-4 w-4" />
          Export PDF
        </>
      )}
    </Button>
  )
}
