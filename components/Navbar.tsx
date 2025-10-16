"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Home, BarChart3, Table2, FileText, HelpCircle, User, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

const navigationItems = [
  { name: "Inicio", href: "#inicio", icon: Home },
  { name: "KPIs", href: "#kpis", icon: BarChart3 },
  { name: "Gráficos", href: "#graficos", icon: BarChart3 },
  { name: "Tabla de Datos", href: "#tabla", icon: Table2 },
  { name: "Reportes", href: "#reportes", icon: FileText },
]

const utilityItems = [
  { name: "Contacto", href: "#contacto", icon: Mail },
  { name: "Perfil", href: "#perfil", icon: User },
  { name: "Ayuda", href: "#ayuda", icon: HelpCircle },
]

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Navigation Items (Desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-md"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon" aria-label="Abrir menú">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px]">
              <SheetHeader>
                <SheetTitle>Menú de Navegación</SheetTitle>
              </SheetHeader>
              <div className="mt-6 flex flex-col gap-2">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-md"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
                <div className="my-4 border-t" />
                {utilityItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-md"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          {/* Center: Brand Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                NOTTE CLUB
              </span>
            </Link>
          </div>

          {/* Right: Utility Items (Desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {utilityItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent rounded-md"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile: Utility Menu */}
          <div className="lg:hidden">
            <Button variant="ghost" size="icon" asChild>
              <Link href="#perfil" aria-label="Perfil">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
