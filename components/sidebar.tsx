"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navItems = [
  { name: "Dashboard", href: "/" },
  { name: "Customers", href: "/customers" },
  { name: "Products", href: "/products" },
  { name: "Expenses", href: "/expenses" },
  { name: "Capital", href: "/capital" }, // ✅ Capital Link Added Here
  { name: "Stock", href: "/stock" },
  { name: "Shipments", href: "/shipments" },
  { name: "Invoice", href: "/invoices" },
  { name: "Profit", href: "/profit" },
  { name: "Investors", href: "/investors" },
  { name: "Reports", href: "/reports" },
  { name: "Database", href: "/database" },
]

export function Sidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed top-0 left-0 z-40 h-screen w-64 bg-green-700 text-white p-4 flex-col">
        <h1 className="text-xl font-bold mb-6">Shipment Manager</h1>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "px-3 py-2 rounded hover:bg-green-600 transition",
                pathname === item.href && "bg-green-600"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-6 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-green-700">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-green-700 text-white p-4">
            <h1 className="text-xl font-bold mb-6">Shipment Manager</h1>
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "px-3 py-2 rounded hover:bg-green-600 transition",
                    pathname === item.href && "bg-green-600"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
