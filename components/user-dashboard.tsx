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
        <div className="w-full px-4">
          {/* Fila superior: logo + puntos + avatar + logout */}
          <div className="flex h-14 items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/ecotienda-logo.jpg" alt="EcoTienda" width={32} height={32} className="rounded-full" />
              <span className="font-bold">EcoTienda</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-full bg-primary-foreground/10 px-3 py-1">
                <Star className="h-4 w-4 text-accent" />
                <span className="font-semibold">{puntosActuales}</span>
                <span className="text-sm opacity-80">pts</span>
              </div>
              <button
                onClick={() => setIsPerfilOpen(true)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                title="Mi Perfil"
              >
                <Avatar className="h-8 w-8 border-2 border-primary-foreground/30">
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
                className="text-primary-foreground hover:bg-red-500/20 hover:text-red-100"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Fila inferior: pestañas */}
          <nav className="flex items-center gap-1 pb-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md transition-colors text-sm font-medium whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="w-full max-w-full p-4">
        {activeTab === "inicio" && <InicioTab />}
        {activeTab === "ofertas" && <OfertasTab />}
        {activeTab === "stock" && <StockTab onCanjeExitoso={cargarPuntos} />}
        {activeTab === "estado" && <EstadoTab />}
      </main>

      <PerfilModal
        open={isPerfilOpen}
        onOpenChange={setIsPerfilOpen}
        onFotoActualizada={(url) => setFotoPerfil(url)}
      />
    </div>
  )
}