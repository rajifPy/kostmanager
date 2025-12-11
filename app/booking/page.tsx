// app/booking/page.tsx
import { HomeHeader } from "@/components/home-header"
import { BookingForm } from "@/components/booking/booking-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Building2, CheckCircle2 } from "lucide-react"

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Ayo Ndang Booking Kamar Kost Rek!</h1>
            <p className="text-muted-foreground">
              Isi formulir di bawah ini dan kami akan menghubungi Anda segera
            </p>
          </div>

          {/* Benefits */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <Card className="border-0 bg-muted/50">
              <CardContent className="p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Respon Cepat</p>
                  <p className="text-xs text-muted-foreground">Tim kami akan menghubungi dalam 24 jam</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-muted/50">
              <CardContent className="p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Gratis Konsultasi</p>
                  <p className="text-xs text-muted-foreground">Tanyakan detail kamar yang sesuai</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 bg-muted/50">
              <CardContent className="p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Tanpa Komitmen</p>
                  <p className="text-xs text-muted-foreground">Tidak ada biaya booking</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Formulir Booking</CardTitle>
              <CardDescription>
                Isi data Anda dengan lengkap untuk mempercepat proses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BookingForm />
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} KostManager. By Cah Kuno - Murfhi.</p>
        </div>
      </footer>
    </div>
  )

}
