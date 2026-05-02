"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "@/lib/auth-context"
import { reciclajeService } from "@/lib/api-services"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, Tag, Package, LogOut, Star, ShoppingBag } from "lucide-react"
import { InicioTab } from "@/components/tabs/inicio-tab"
import { OfertasTab } from "@/components/tabs/ofertas-tab"
import { StockTab } from "@/components/tabs/stock-tab"
import { PerfilModal } from "@/components/perfil-modal"
import { EstadoTab } from "@/components/tabs/estado-tab"

type Tab = "inicio" | "ofertas" | "stock" | "estado"

export function UserDashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>("inicio")
  const [isPerfilOpen, setIsPerfilOpen] = useState(false)
  const [puntosActuales, setPuntosActuales] = useState<number>(0)
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null)

  useEffect(() => {
    cargarPuntos()
    cargarFoto()
  }, [])

  useEffect(() => {
    cargarPuntos()
  }, [activeTab])

  const cargarPuntos = async () => {
    try {
      const saldo = await reciclajeService.getSaldo() as { puntos_actuales: number }
      setPuntosActuales(saldo.puntos_actuales)
    } catch (error) {}
  }

  const cargarFoto = async () => {
    try {
      const token = localStorage.getItem("ecotienda_token")
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/mi-foto`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        if (data.foto_perfil) setFotoPerfil(data.foto_perfil)
      }
    } catch (error) {}
  }

  if (!user) return null

  const tabs = [
    { id: "inicio" as Tab, label: "Inicio", icon: Home },
    { id: "ofertas" as Tab, label: "Ofertas", icon: Tag },
    { id: "stock" as Tab, label: "Stock", icon: Package },
    { id: "estado" as Tab, label: "Estado", icon: ShoppingBag },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground">
        {/* Fila 1: Logo + Puntos + Avatar + Logout */}
        <div className="flex h-14 items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <Image src="/ecotienda-logo.jpg" alt="EcoTienda" width={28} height={28} className="rounded-full" />
            <span className="font-bold text-sm">EcoTienda</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-primary-foreground/10 px-2 py-1">
              <Star className="h-3 w-3 text-accent" />
              <span className="font-semibold text-sm">{puntosActuales}</span>
              <span className="text-xs opacity-80">pts</span>
            </div>
            <button
              onClick={() => setIsPerfilOpen(true)}
              className="hover:opacity-80 transition-opacity"
              title="Mi Perfil"
            >
              <Avatar className="h-7 w-7 border-2 border-primary-foreground/30">
                {fotoPerfil ? (
                  <img src={fotoPerfil} alt="Foto de perfil" className="h-full w-full object-cover rounded-full" />
                ) : (
                  <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-xs">
                    {user.nombre[0]}{user.apellido[0]}
                  </AvatarFallback>
                )}
              </Avatar>
            </button>
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="text-primary-foreground hover:bg-red-500/20 hover:text-red-100 p-1"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Fila 2: Pestañas */}
        <nav className="flex items-center border-t border-primary-foreground/20">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-1 py-2 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary-foreground/20 text-primary-foreground border-b-2 border-primary-foreground"
                    : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-xs">{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </header>

      <div className="min-h-screen bg-background overflow-x-hidden">
        {activeTab === "inicio" && <InicioTab />}
        {activeTab === "ofertas" && <OfertasTab />}
        {activeTab === "stock" && <StockTab onCanjeExitoso={cargarPuntos} />}
        {activeTab === "estado" && <EstadoTab />}
      </div>

      <PerfilModal
        open={isPerfilOpen}
        onOpenChange={setIsPerfilOpen}
        onFotoActualizada={(url) => setFotoPerfil(url)}
      />
    </div>
  )
}