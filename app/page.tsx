import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Building2,
    MapPin,
    Wifi,
    Car,
    UtensilsCrossed,
    Shield,
    Droplets,
    Zap,
    Users,
    Star,
    MessageSquare,
} from "lucide-react";
import type { Room, AlumniReview } from "@/lib/types";
import { GalleryCard } from "@/components/gallery/gallery-card";
import { HomeHeader } from "@/components/home-header";
import Link from "next/link";

// ✅ Import Calendar Component
import { RealtimeCalendar } from "@/components/ui/realtimecalendar";
import { ShareButton } from "@/components/share-button";

const facilities = [
    { icon: Wifi, name: "WiFi Gratis", description: "Internet cepat 24 jam" },
    { icon: Car, name: "Parkir Luas", description: "Area parkir motor & mobil" },
    { icon: UtensilsCrossed, name: "Dapur Bersama", description: "Fasilitas masak lengkap" },
    { icon: Shield, name: "Keamanan 24 Jam", description: "CCTV & satpam" },
    { icon: Droplets, name: "Air Bersih", description: "PAM & sumur bor" },
    { icon: Zap, name: "Listrik Token", description: "Meteran per kamar" },
];

const galleryImages = [
    { src: "/modern-kost-building-exterior.jpg", alt: "Tampak Depan Kost" },
    { src: "/clean-minimalist-bedroom-with-bed-and-desk.jpg", alt: "Kamar Tidur" },
    { src: "/clean-bathroom-shower.png", alt: "Kamar Mandi" },
    { src: "/shared-kitchen-with-cooking-facilities.jpg", alt: "Dapur Bersama" },
    { src: "/parking-area-with-motorcycles.jpg", alt: "Area Parkir" },
    { src: "/living-room-common-area.jpg", alt: "Ruang Bersama" },
];

export default async function HomePage() {
    const supabase = await createClient();

    const [roomsRes, alumniRes] = await Promise.all([
        supabase.from("rooms").select("*").order("room_number"),
        supabase.from("alumni_reviews")
            .select("*")
            .eq("status", "approved")
            .order("created_at", { ascending: false })
            .limit(6),
    ]);

    const rooms = (roomsRes.data as Room[] | null) || [];
    const alumniReviews = (alumniRes.data as AlumniReview[] | null) || [];

    const vacantRooms = rooms.filter((r) => r.status === "vacant");
    const totalRooms = rooms.length;

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                    />
                ))}
            </div>
        );
    };

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

                    {/* CTA Buttons */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                        <Link href="/booking">
                            <Button size="lg">Booking Sekarang</Button>
                        </Link>
                        <Link href="#kamar">
                            <Button size="lg" variant="outline">
                                Cek Ketersediaan
                            </Button>
                        </Link>
                        <Link href="/penyewa">
                            <Button size="lg" variant="outline">
                                Lihat Daftar Penyewa
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

            {/* ✅ REALTIME CALENDAR SECTION — DITAMBAHKAN DI SINI */}
            <section className="py-6 bg-background">
                <div className="container mx-auto px-4">
                    <div className="flex justify-center">
                        <RealtimeCalendar />
                    </div>
                </div>
            </section>

            {/* Gallery Section with 3D Flip Cards */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="mb-8 text-center text-3xl font-bold">Galeri Kost</h2>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {galleryImages.map((image, index) => (
                            <GalleryCard key={index} image={image.src} title={image.alt} alt={image.alt} />
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
                                        <p className="text-sm text-muted-foreground">
                                            {facility.description}
                                        </p>
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
                            {rooms.map((room) => (
                                <Card
                                    key={room.id}
                                    className={room.status === "vacant" ? "border-primary/50" : ""}
                                >
                                    <CardContent className="p-6">
                                        <div className="mb-4 flex items-center justify-between">
                                            <h3 className="text-lg font-semibold">
                                                Kamar {room.room_number}
                                            </h3>
                                            <Badge
                                                variant={
                                                    room.status === "vacant" ? "default" : "secondary"
                                                }
                                            >
                                                {room.status === "vacant" ? "Tersedia" : "Terisi"}
                                            </Badge>
                                        </div>
                                        <p className="text-2xl font-bold text-primary">
                                            Rp {room.price.toLocaleString("id-ID")}
                                            <span className="text-sm font-normal text-muted-foreground">
                                                /bulan
                                            </span>
                                        </p>
                                        {room.facilities && (
                                            <p className="mt-2 text-sm text-muted-foreground">
                                                {room.facilities}
                                            </p>
                                        )}

                                        {/* Tombol booking untuk kamar vacant */}
                                        {room.status === "vacant" && (
                                            <Link href="/booking" className="mt-4 block">
                                                <Button className="w-full" size="sm">
                                                    Booking Kamar Ini
                                                </Button>
                                            </Link>
                                        )}
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

            {/* Booking CTA Section */}
            <section className="bg-primary py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-primary-foreground mb-4">
                        Ayo Ndang Booking Kamar Rek
                    </h2>
                    <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                        Sat Set Anti Ribet
                    </p>
                    <Link href="/booking">
                        <Button size="lg" variant="secondary">
                            <Building2 className="mr-2 h-5 w-5" />
                            Booking Kamar Sekarang
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Alumni Reviews Section */}
            <section id="cerita-alumni" className="bg-muted/30 py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold mb-2">Cerita Alumni</h2>
                        <p className="text-muted-foreground">
                            Pengalaman mereka yang pernah tinggal di sini
                        </p>
                    </div>

                    {alumniReviews && alumniReviews.length > 0 ? (
                        <>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                                {alumniReviews.map((review) => (
                                    <Card
                                        key={review.id}
                                        className="border-0 bg-background hover:shadow-lg transition-shadow"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4 mb-4">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage
                                                        src={review.photo_url || undefined}
                                                        alt={review.name}
                                                    />
                                                    <AvatarFallback>
                                                        {review.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{review.name}</h4>
                                                    <p className="text-sm text-muted-foreground">
                                                        {review.stay_date}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mb-3">{renderStars(review.rating)}</div>
                                            <p className="text-sm text-muted-foreground line-clamp-4">
                                                {review.review}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="text-center">
                                <Link href="/cerita-alumni">
                                    <Button size="lg" variant="outline">
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Bagikan Cerita Anda
                                    </Button>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Belum Ada Cerita</h3>
                            <p className="text-muted-foreground mb-6">
                                Jadilah yang pertama membagikan pengalaman Anda!
                            </p>
                            <Link href="/cerita-alumni">
                                <Button size="lg">
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    Bagikan Cerita Anda
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Location Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <h2 className="mb-8 text-center text-3xl font-bold">Lokasi</h2>
                    <div className="mx-auto max-w-4xl overflow-hidden rounded-lg">
                        <div className="aspect-video w-full bg-muted">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d494.7167774580775!2d112.78926795001105!3d-7.271055619667423!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa03aaaaaaab%3A0x95752a937f9f69db!2sGrand%20Peninsula%20Park!5e0!3m2!1sid!2sid!4v1765392127681!5m2!1sid!2sid"
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
                            <p>
                                Jl. Contoh Alamat No. 123, Kelurahan, Kecamatan, Kota, Provinsi
                                12345
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ✅ SHARE VIA WHATSAPP — BARU */}
            <section className="py-10 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
                            <Share2 className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium text-primary">Sebarkan ke Teman</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Temukan Teman Sekost?</h3>
                        <p className="text-muted-foreground mb-8">
                            Bagikan link ini ke grup WA kampus/kantor — siapa tahu ada yang butuh!
                        </p>
                        <ShareButton />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>
                        &copy; {new Date().getFullYear()} KostManager. By Cah Kuno - Murfhi.
                    </p>
                </div>
            </footer>
        </div>
    );
}
