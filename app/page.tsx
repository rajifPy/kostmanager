import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Wifi, Car, UtensilsCrossed, Shield, Droplets, Zap, Users } from "lucide-react"
import type { Room } from "@/lib/types"
import { GalleryCard } from "@/components/gallery/gallery-card"

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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <Building2 className="h-6 w-6" />
            <span className="text-xl font-bold">KostManager</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/penyewa" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Daftar Penyewa
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Admin Login
              </Button>
            </Link>
          </nav>
        </div>
      </header>

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
            <Link href="#kamar">
              <Button size="lg" variant="outline">
                Cek Ketersediaan
              </Button>
            </Link>
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

          {/* Social Media Share Section */}
          <div className="mx-auto max-w-4xl mt-12">
            <h3 className="text-xl font-semibold text-center mb-6">Bagikan ke Teman Anda</h3>
            <div className="flex justify-center">
              <div className="share-tooltip-container">
                <div className="share-button-content">
                  <span className="share-text">Share</span>
                  <svg className="share-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
                    <path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
                  </svg>
                </div>
                <div className="share-tooltip-content">
                  <div className="share-social-icons">
                    <a 
                      href="https://wa.me/?text=Lihat%20kost%20nyaman%20ini!%20https://kostmanagerv1.vercel.app/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="share-social-icon whatsapp-icon"
                      title="Share via WhatsApp"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
                        <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
                      </svg>
                    </a>
                    <a 
                      href="https://www.instagram.com/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="share-social-icon instagram-icon"
                      title="Share via Instagram"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
                        <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                    <a 
                      href="https://t.me/share/url?url=https://kostmanagerv1.vercel.app/&text=Lihat%20kost%20nyaman%20ini!" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="share-social-icon telegram-icon"
                      title="Share via Telegram"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24}>
                        <path fill="currentColor" d="M23.91 3.79L20.3 20.84c-.25 1.21-.98 1.5-2 .94l-5.5-4.07-2.66 2.57c-.3.3-.55.56-1.1.56-.72 0-.6-.27-.84-.95L6.3 13.7l-5.45-1.7c-1.18-.35-1.19-1.16.26-1.75l21.26-8.2c.97-.43 1.9.24 1.53 1.73z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
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
