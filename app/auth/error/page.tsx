import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, AlertCircle } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/30 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-center gap-2 text-primary">
            <Building2 className="h-8 w-8" />
            <span className="text-2xl font-bold">KostManager</span>
          </div>
          <Card>
            <CardHeader>
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Terjadi Kesalahan</CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p className="text-sm text-muted-foreground text-center">Kode error: {params.error}</p>
              ) : (
                <p className="text-sm text-muted-foreground text-center">Terjadi kesalahan yang tidak diketahui.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
