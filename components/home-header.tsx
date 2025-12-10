"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Building2, Menu, X } from "lucide-react"
import { ThemeToggle } from '@/components/theme-toggle'
import { useState } from "react"
import { cn } from "@/lib/utils"

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
          <Link href="/penyewa" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Daftar Penyewa
          </Link>
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
          <Link 
            href="/penyewa" 
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            Daftar Penyewa
          </Link>
          <Link 
            href="/auth/login"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Button variant="outline" size="sm" className="w-full">
              Admin Login
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
