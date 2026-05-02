"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { reciclajeService, perfilService } from "@/lib/api-services"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Scale, User, Edit, Save, X, History, Package, ArrowDown, ArrowUp, Loader2, Camera } from "lucide-react"
import { toast } from "sonner"

interface PerfilModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFotoActualizada?: (url: string) => void 
}

interface Saldo {
  puntos_actuales: number
  kilos_totales: string
  nombre: string
  apellido: string
}

interface HistorialItem {
  id: number
  puntos_cambio: number
  tipo: string
  fecha: string
}

export function PerfilModal({ open, onOpenChange, onFotoActualizada }: PerfilModalProps) {
  const { user } = useAuth()
  const [saldo, setSaldo] = useState<Saldo | null>(null)
  const [historial, setHistorial] = useState<HistorialItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombre: user?.nombre || "",
    apellido: user?.apellido || "",
    direccion: user?.direccion || "",
    telefono: user?.telefono || "",
  })
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null)
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const fotoInputRef = useRef<HTMLInputElement>(null)

  // Cargar datos reales cada vez que se abre el modal
  useEffect(() => {
    if (open) {
      cargarDatos()
    }
  }, [open])

  const cargarDatos = async () => {
    try {
      setIsLoading(true)
      const [saldoData, historialData] = await Promise.all([
        reciclajeService.getSaldo() as Promise<Saldo>,
        reciclajeService.getHistorialPuntos() as Promise<HistorialItem[]>
      ])
      setSaldo(saldoData)
      setHistorial(Array.isArray(historialData) ? historialData : [])
    // Cargar foto de perfil si existe
    const token = localStorage.getItem("ecotienda_token")
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/mi-foto`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      if (response.ok) {
        const data = await response.json()
        if (data.foto_perfil) setFotoPerfil(data.foto_perfil)
      }
    } catch (error) {
      toast.error("Error al cargar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  const puntosActuales = saldo?.puntos_actuales ?? 0
  const kilosTotales = parseFloat(saldo?.kilos_totales ?? "0")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = () => {
    setIsEditing(false)
    toast.success("Perfil actualizado correctamente")
  }

  //Funsión para manejar la foto

    const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    toast.error("La imagen no puede superar 5MB")
    return
  }
  try {
    setSubiendoFoto(true)
    const resultado = await perfilService.subirFotoPerfil(file)
    setFotoPerfil(resultado.url)
    onFotoActualizada?.(resultado.url) // ← agrega esto
    toast.success("¡Foto de perfil actualizada!")
  } catch (error) {
    toast.error("Error al subir la foto")
  } finally {
    setSubiendoFoto(false)
  }
}

  const handleCancel = () => {
    setFormData({
      nombre: user.nombre,
      apellido: user.apellido,
      direccion: user.direccion || "",
      telefono: user.telefono || "",
    })
    setIsEditing(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Mi Perfil
          </DialogTitle>
          <DialogDescription>
            Tu información personal, puntos e historial de canjes
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            {/* Profile Header */}
            <div className="flex flex-col items-center">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary/20">
                {fotoPerfil ? (
                  <img
                    src={fotoPerfil}
                    alt="Foto de perfil"
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {user.nombre[0]}{user.apellido[0]}
                  </AvatarFallback>
                )}
              </Avatar>
              <input
                ref={fotoInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleFotoChange}
              />
              <button
                onClick={() => fotoInputRef.current?.click()}
                disabled={subiendoFoto}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
              >
                {subiendoFoto
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <Camera className="h-4 w-4" />
                }
              </button>
            </div>
            <h2 className="mt-3 text-xl font-semibold">{user.nombre} {user.apellido}</h2>
            <p className="text-sm text-muted-foreground">{user.correo}</p>
          </div>

            {/* Stats Cards */}
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Star className="mx-auto h-6 w-6 text-accent mb-1" />
                    <p className="text-2xl font-bold text-primary">{puntosActuales}</p>
                    <p className="text-xs text-muted-foreground">Puntos actuales</p>
                  </CardContent>
                </Card>
                <Card className="border-primary/20">
                  <CardContent className="p-4 text-center">
                    <Scale className="mx-auto h-6 w-6 text-primary mb-1" />
                    <p className="text-2xl font-bold text-primary">{kilosTotales.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Kg acumulados</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Datos personales */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Datos personales</h3>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-1" /> Cancelar
                    </Button>
                    <Button size="sm" onClick={handleSave}>
                      <Save className="h-4 w-4 mr-1" /> Guardar
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Nombre</Label>
                    {isEditing ? (
                      <Input name="nombre" value={formData.nombre} onChange={handleChange} className="h-9" />
                    ) : (
                      <p className="text-sm py-2 px-3 bg-muted rounded-md">{user.nombre}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Apellido</Label>
                    {isEditing ? (
                      <Input name="apellido" value={formData.apellido} onChange={handleChange} className="h-9" />
                    ) : (
                      <p className="text-sm py-2 px-3 bg-muted rounded-md">{user.apellido}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Teléfono</Label>
                  {isEditing ? (
                    <Input name="telefono" value={formData.telefono} onChange={handleChange} className="h-9" />
                  ) : (
                    <p className="text-sm py-2 px-3 bg-muted rounded-md">{user.telefono || "—"}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Dirección</Label>
                  {isEditing ? (
                    <Input name="direccion" value={formData.direccion} onChange={handleChange} className="h-9" />
                  ) : (
                    <p className="text-sm py-2 px-3 bg-muted rounded-md">{user.direccion || "—"}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Ciudad</Label>
                  <p className="text-sm py-2 px-3 bg-muted rounded-md">Aucayacu</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="historial" className="space-y-4 mt-4">
            <div>
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <History className="h-4 w-4" />
                Movimientos de Puntos
              </h3>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : historial.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay movimientos registrados
                </p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {historial.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          item.tipo === 'ingreso' ? "bg-primary/10" : "bg-destructive/10"
                        }`}>
                          {item.tipo === 'ingreso'
                            ? <ArrowUp className="h-4 w-4 text-primary" />
                            : <ArrowDown className="h-4 w-4 text-destructive" />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-medium capitalize">
                            {item.tipo === 'ingreso' ? '♻️ Reciclaje' : '🎁 Canje'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.fecha).toLocaleDateString("es-PE")}
                          </p>
                        </div>
                      </div>
                      <span className={`font-semibold ${
                        item.tipo === 'ingreso' ? "text-primary" : "text-destructive"
                      }`}>
                        {item.puntos_cambio > 0 ? "+" : ""}{item.puntos_cambio} pts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}