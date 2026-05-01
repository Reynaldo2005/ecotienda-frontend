"use client"

import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ShoppingCart, Users, LogOut, Shield, Gift, Package } from "lucide-react"
import { ComprasTab } from "@/components/admin/compras-tab"
import { RegistradosTab } from "@/components/admin/registrados-tab"
import { OfertasAdminTab } from "@/components/admin/ofertas-admin-tab"
import { StockAdminTab } from "@/components/admin/stock-admin-tab"

type AdminTab = "compras" | "registrados" | "ofertas" | "stock";

export function AdminDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<AdminTab>("compras")

  if (!user) return null

  const tabs = [
    { id: "compras" as AdminTab, label: "Compras", icon: ShoppingCart },
    { id: "registrados" as AdminTab, label: "Registrados", icon: Users },
    { id: "ofertas" as AdminTab, label: "Ofertas", icon: Gift },
    { id: "stock" as AdminTab, label: "Stock", icon: Package },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-sidebar text-sidebar-foreground">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 gap-4">
          <div className="flex items-center gap-3">
            <Image src="/ecotienda-logo.jpg" alt="EcoTienda" width={32} height={32} className="rounded-full" />
            <span className="font-bold">EcoTienda</span>
            <span className="hidden sm:inline-flex items-center gap-1 ml-2 text-xs bg-sidebar-accent px-2 py-0.5 rounded">
              <Shield className="h-3 w-3" />
              Administrador
            </span>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>

          <div className="flex items-center gap-3 ml-auto">
            <Avatar className="h-8 w-8 border-2 border-sidebar-foreground/30">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
                {user.nombre[0]}{user.apellido[0]}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm">{user.nombre}</span>
            <Button
              onClick={logout}
              variant="ghost"
              size="icon"
              className="text-red-400 hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        {activeTab === "compras" && <ComprasTab />}
        {activeTab === "registrados" && <RegistradosTab />}
        {activeTab === "ofertas" && <OfertasAdminTab />}
        {activeTab === "stock" && <StockAdminTab />}
      </main>
    </div>
  )
}