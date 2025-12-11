// components/booking/booking-form.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBooking } from "@/app/actions/bookings"
import { useSuccessSound } from "@/hooks/use-success-sound"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Loader2, AlertTriangle } from "lucide-react"
import type { Booking } from "@/lib/types"
import { TruckLoader } from "@/components/ui/truck-loader";

export function BookingForm() {
    const router = useRouter()
    const { playSuccess } = useSuccessSound()
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [roomPreference, setRoomPreference] = useState("")
    const [budgetMin, setBudgetMin] = useState("")
    const [budgetMax, setBudgetMax] = useState("")
    const [moveInDate, setMoveInDate] = useState("")
    const [durationMonths, setDurationMonths] = useState("")
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !phone) {
            setError("Nama dan nomor telepon wajib diisi")
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("phone", phone)
            if (email) formData.append("email", email)
            if (roomPreference) formData.append("room_preference", roomPreference)
            if (budgetMin) formData.append("budget_min", budgetMin)
            if (budgetMax) formData.append("budget_max", budgetMax)
            if (moveInDate) formData.append("move_in_date", moveInDate)
            if (durationMonths) formData.append("duration_months", durationMonths)
            if (message) formData.append("message", message)

            await createBooking(formData)

            // Play success sound
            playSuccess()

            setSuccess(true)
            setTimeout(() => {
                router.push("/")
            }, 3000)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Terjadi kesalahan")
        } finally {
            setIsLoading(false)
        }
    }

    if (success) {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <div className="rounded-2xl border-2 border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 p-8 md:p-12 shadow-xl">
                    <div className="flex flex-col items-center justify-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                            <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={2.5} />
                        </div>
                        <div className="text-center space-y-3">
                            <h3 className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">
                                🎉 Booking Berhasil!
                            </h3>
                            <div className="space-y-2">
                                <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 font-medium">
                                    Permintaan booking Anda telah diterima
                                </p>
                                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                                    Tim kami akan menghubungi Anda segera untuk konfirmasi ketersediaan kamar.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name & Phone */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap *</Label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Nama Anda"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon *</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="08xxxxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
                <Label htmlFor="email">Email (Opsional)</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            {/* Room Preference */}
            <div className="space-y-2">
                <Label htmlFor="room_preference">Preferensi Kamar</Label>
                <Select value={roomPreference} onValueChange={setRoomPreference}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih tipe kamar" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="single">Kamar Single</SelectItem>
                        <SelectItem value="shared">Kamar Sharing</SelectItem>
                        <SelectItem value="any">Apa Saja</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Budget Range */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="budget_min">Budget Minimum (Rp)</Label>
                    <Input
                        id="budget_min"
                        type="number"
                        placeholder="500000"
                        value={budgetMin}
                        onChange={(e) => setBudgetMin(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="budget_max">Budget Maksimum (Rp)</Label>
                    <Input
                        id="budget_max"
                        type="number"
                        placeholder="2000000"
                        value={budgetMax}
                        onChange={(e) => setBudgetMax(e.target.value)}
                    />
                </div>
            </div>

            {/* Move-in Date & Duration */}
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="move_in_date">Rencana Masuk</Label>
                    <Input
                        id="move_in_date"
                        type="date"
                        value={moveInDate}
                        onChange={(e) => setMoveInDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="duration_months">Durasi (Bulan)</Label>
                    <Input
                        id="duration_months"
                        type="number"
                        placeholder="6"
                        min="1"
                        value={durationMonths}
                        onChange={(e) => setDurationMonths(e.target.value)}
                    />
                </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
                <Label htmlFor="message">Pesan / Catatan Tambahan</Label>
                <Textarea
                    id="message"
                    placeholder="Tuliskan kebutuhan atau pertanyaan Anda..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                />
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="relative h-12">
                {/* Full-screen loader saat mengirim */}
                {isLoading && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border max-w-md w-full">
                            <TruckLoader
                                message="Mohon tunggu...\nTim kami sedang memproses permintaan Anda! 🚚"
                            />
                        </div>
                    </div>
                )}

                {!isLoading && (
                    <Button type="submit" className="w-full h-12" disabled={isLoading}>
                        Kirim Permintaan Booking
                    </Button>
                )}
            </div>

            <p className="text-xs text-center text-muted-foreground">
                Dengan mengirim formulir ini, Anda setuju untuk dihubungi oleh tim kami
            </p>
        </form>
    )
}
