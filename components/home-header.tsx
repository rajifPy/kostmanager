"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Menu, X, ChevronDown } from "lucide-react"
import { ThemeToggle } from '@/components/theme-toggle'
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function HomeHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-primary">
          <Building2 className="h-6 w-6" />
          <span className="text-xl font-bold">KostManager</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          
          {/* Form Pembayaran Sewa Link */}
          <Link 
            href="/penyewa" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Form Pembayaran Sewa
          </Link>

          {/* Alumni Review Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Alumni Review
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/#cerita-alumni" className="w-full cursor-pointer">
                  Lihat Review Alumni
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/cerita-alumni" className="w-full cursor-pointer">
                  Kirim Review Anda
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Admin Login */}
          <Link href="/auth/login">
            <Button variant="outline" size="sm">
              Admin Login
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "md:hidden border-t bg-background/95 backdrop-blur",
          mobileMenuOpen ? "block" : "hidden"
        )}
      >
        <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
          {/* Form Pembayaran Sewa */}
          <Link 
            href="/penyewa" 
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Form Pembayaran Sewa
          </Link>

          {/* Alumni Review Section */}
          <div className="border-t pt-2 mt-2">
            <p className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase">
              Alumni Review
            </p>
            <Link 
              href="/#cerita-alumni"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors block"
              onClick={() => setMobileMenuOpen(false)}
            >
              Lihat Review Alumni
            </Link>
            <Link 
              href="/cerita-alumni"
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors block"
              onClick={() => setMobileMenuOpen(false)}
            >
              Kirim Review Anda
            </Link>
          </div>

          {/* Admin Login */}
          <div className="border-t pt-2 mt-2">
            <Link 
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Button variant="outline" size="sm" className="w-full">
                Admin Login
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}
