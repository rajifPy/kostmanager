import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Wifi, Car, UtensilsCrossed, Shield, Droplets, Zap, Users } from "lucide-react"
import type { Room } from "@/lib/types"

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
              <div key={index} className="gallery-card-wrapper" style={{ height: '280px' }}>
                <style jsx>{`
                  .gallery-card {
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    transition: transform 500ms;
                    cursor: pointer;
                    position: relative;
                  }

                  .gallery-card-wrapper:hover .gallery-card {
                    transform: rotateY(180deg);
                  }

                  .card-front,
                  .card-back {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                  }

                  .card-front {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  }

                  .card-back {
                    transform: rotateY(180deg);
                    background: #1a1a1a;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    position: relative;
                  }

                  .card-back::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(90deg, #ff9966, #ff5e62, #ff9966, #ff5e62);
                    animation: rotate-gradient 4s linear infinite;
                    z-index: -1;
                  }

                  .card-back::after {
                    content: '';
                    position: absolute;
                    inset: 3px;
                    background: #1a1a1a;
                    border-radius: 10px;
                    z-index: 0;
                  }

                  @keyframes rotate-gradient {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                  }

                  .card-image-container {
                    width: 100%;
                    height: 100%;
                    position: relative;
                  }

                  .card-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  }

                  .floating-circles {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    top: 0;
                    left: 0;
                    pointer-events: none;
                  }

                  .circle {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(40px);
                    animation: float 3s ease-in-out infinite;
                    opacity: 0.6;
                  }

                  .circle-1 {
                    width: 120px;
                    height: 120px;
                    background: rgba(255, 187, 102, 0.8);
                    top: 20%;
                    left: 10%;
                    animation-delay: 0s;
                  }

                  .circle-2 {
                    width: 180px;
                    height: 180px;
                    background: rgba(255, 136, 102, 0.8);
                    bottom: 10%;
                    left: 30%;
                    animation-delay: -1s;
                  }

                  .circle-3 {
                    width: 90px;
                    height: 90px;
                    background: rgba(255, 34, 51, 0.8);
                    top: 15%;
                    right: 15%;
                    animation-delay: -2s;
                  }

                  @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(20px); }
                  }

                  .card-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
                    padding: 20px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                  }

                  .icon-container {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    padding: 12px;
                    border-radius: 10px;
                  }

                  .icon {
                    width: 32px;
                    height: 32px;
                    color: white;
                  }

                  .card-title {
                    color: white;
                    font-size: 18px;
                    font-weight: 600;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                  }

                  .back-content {
                    position: relative;
                    z-index: 1;
                    text-align: center;
                    padding: 30px;
                  }

                  .back-icon {
                    width: 60px;
                    height: 60px;
                    color: white;
                    margin-bottom: 20px;
                  }

                  .back-title {
                    font-size: 22px;
                    font-weight: 700;
                    margin-bottom: 10px;
                    color: white;
                  }

                  .back-description {
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.6;
                  }
                `}</style>

                <div className="gallery-card">
                  {/* Front Side */}
                  <div className="card-front">
                    <div className="card-image-container">
                      <img 
                        src={image.src || "/placeholder.svg"}
                        alt={image.alt}
                        className="card-image"
                      />
                      <div className="floating-circles">
                        <div className="circle circle-1"></div>
                        <div className="circle circle-2"></div>
                        <div className="circle circle-3"></div>
                      </div>
                      <div className="card-overlay">
                        <div className="icon-container">
                          <svg 
                            className="icon"
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                        </div>
                        <div className="card-title">{image.alt}</div>
                      </div>
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="card-back">
                    <div className="back-content">
                      <svg 
                        className="back-icon"
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <div className="back-title">Fasilitas Lengkap</div>
                      <div className="back-description">
                        Fasilitas modern dan nyaman untuk hunian Anda dengan kualitas terbaik
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
