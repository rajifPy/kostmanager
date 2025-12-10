import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Wifi, Car, UtensilsCrossed, Shield, Droplets, Zap, Users } from "lucide-react"
import type { Room } from "@/lib/types"
import { GalleryCard } from "@/components/gallery/gallery-card"
import { HomeHeader } from '@/components/home-header'
import Link from "next/link"

const facilities = [
  { icon: Wifi, name: "WiFi Gratis", description: "Internet cepat 24 jam" },
  { icon: Car, name: "Parkir Luas", description: "Area parkir motor & mobil" },
  { icon: UtensilsCrossed, name: "Dapur Bersama", description: "Fasilitas masak lengkap" },
  { icon: Shield, name: "Keamanan 24 Jam", description: "CCTV & satpam" },
  { icon: Droplets, name: "Air Bersih", description: "PAM & sumur bor" },
  { icon: Zap, name: "Listrik Token", description: "Meteran per kamar" },
]

const galleryImages = [
  { src: "/modern-kost-building-exterior.jpg", alt: "Tampak Depan Kost" },
  { src: "/clean-minimalist-bedroom-with-bed-and-desk.jpg", alt: "Kamar Tidur" },
  { src: "/clean-bathroom-shower.png", alt: "Kamar Mandi" },
  { src: "/shared-kitchen-with-cooking-facilities.jpg", alt: "Dapur Bersama" },
  { src: "/parking-area-with-motorcycles.jpg", alt: "Area Parkir" },
  { src: "/living-room-common-area.jpg", alt: "Ruang Bersama" },
]

export default async function HomePage() {
  const supabase = await createClient()

  const { data: rooms } = await supabase.from("rooms").select("*").order("room_number")

  const vacantRooms = (rooms as Room[] | null)?.filter((r) => r.status === "vacant") || []
  const totalRooms = rooms?.length || 0

  return (
    <div className="min-h-screen bg-background">
      <HomeHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Kost Nyaman & Strategis
          </Badge>
          <h1 className="text-balance text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Temukan Hunian Nyaman
            <br />
            di Lokasi Strategis
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            Kost dengan fasilitas lengkap, keamanan 24 jam, dan harga terjangkau. Cocok untuk mahasiswa dan pekerja.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/penyewa">
              <Button size="lg">Lihat Daftar Penyewa</Button>
            </Link>
            <a href="#kamar">
              <Button size="lg" variant="outline">
                Cek Ketersediaan
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{totalRooms}</p>
              <p className="text-sm text-muted-foreground">Total Kamar</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{vacantRooms.length}</p>
              <p className="text-sm text-muted-foreground">Kamar Tersedia</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">24/7</p>
              <p className="text-sm text-muted-foreground">Keamanan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section with 3D Flip Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Galeri Kost</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((image, index) => (
              <GalleryCard key={index} image={image.src} title={image.alt} />
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Fasilitas</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility, index) => (
              <Card key={index} className="border-0 bg-background">
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <facility.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{facility.name}</h3>
                    <p className="text-sm text-muted-foreground">{facility.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="kamar" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Ketersediaan Kamar</h2>
          {rooms && rooms.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {(rooms as Room[]).map((room) => (
                <Card key={room.id} className={room.status === "vacant" ? "border-primary/50" : ""}>
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Kamar {room.room_number}</h3>
                      <Badge variant={room.status === "vacant" ? "default" : "secondary"}>
                        {room.status === "vacant" ? "Tersedia" : "Terisi"}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      Rp {room.price.toLocaleString("id-ID")}
                      <span className="text-sm font-normal text-muted-foreground">/bulan</span>
                    </p>
                    {room.facilities && <p className="mt-2 text-sm text-muted-foreground">{room.facilities}</p>}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-muted-foreground">Belum ada data kamar</p>
            </div>
          )}
        </div>
      </section>

      {/* Location Section */}
      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">Lokasi</h2>
          <div className="mx-auto max-w-4xl overflow-hidden rounded-lg">
            <div className="aspect-video w-full bg-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.2297465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf0fdad786a2!2sJakarta!5e0!3m2!1sen!2sid!4v1699999999999!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Kost"
              />
            </div>
            <div className="mt-4 flex items-start gap-2 text-muted-foreground">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0" />
              <p>Jl. Contoh Alamat No. 123, Kelurahan, Kecamatan, Kota, Provinsi 12345</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} KostManager. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
