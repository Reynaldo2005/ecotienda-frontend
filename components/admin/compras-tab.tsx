"use client"

import { useState, useEffect } from "react"
import { adminService, canjesService, ofertasService } from "@/lib/api-services"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ShoppingCart, Package, Calendar, Clock, MapPin, Phone, CheckCircle, Loader2, Gift, X } from "lucide-react"
import { toast } from "sonner"


interface Canje {
  id: number
  nombre: string
  apellido: string
  telefono: string
  producto: string
  puntos_descontados: number
  estado: string
  fecha_solicitud: string
  direccion_entrega: string
  referencia: string
  telefono_contacto: string
}

interface Reclamo {
  id: number
  nombre: string
  apellido: string
  telefono: string
  direccion: string
  oferta: string
  kilos_requeridos: number
  estado: string
  fecha: string
}

export function ComprasTab() {
  const [canjes, setCanjes] = useState<Canje[]>([])
  const [reclamos, setReclamos] = useState<Reclamo[]>([])
  const [selectedCanje, setSelectedCanje] = useState<Canje | null>(null)
  const [selectedReclamo, setSelectedReclamo] = useState<Reclamo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [procesando, setProcesando] = useState<number | null>(null)
  const [eliminando, setEliminando] = useState<number | null>(null)

  useEffect(() => {
    cargarDatos()

    //Actualizar cada 15 segundos
    const intervalo = setInterval(() => {
      cargarDatos()
    }, 15000)

    //limpieza de los intervalos cuando el componente se desmonte 
    return () => clearInterval(intervalo)
  }, [])

  const cargarDatos = async () => {
    try {
      setIsLoading(true)
      const [canjesData, reclamosData] = await Promise.all([
        adminService.getTodosCanjes() as Promise<Canje[]>,
        ofertasService.getReclamos() as Promise<Reclamo[]>
      ])
      setCanjes(canjesData)
      setReclamos(reclamosData)
    } catch (error) {
      toast.error("Error al cargar los pedidos")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCambiarEstado = async (id: number, estado: string) => {
    try {
      setProcesando(id)
      await canjesService.cambiarEstado(id, estado)
      toast.success("Estado actualizado correctamente")
      setSelectedCanje(null)
      cargarDatos()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al actualizar")
    } finally {
      setProcesando(null)
    }
  }

  const handleReclamo = async (id: number, estado: string) => {
    try {
      setProcesando(id)
      await ofertasService.cambiarEstadoReclamo(id, estado)
      toast.success(estado === 'entregado' ? "Reclamo entregado ✅" : "Reclamo cancelado")
      setSelectedReclamo(null)
      cargarDatos()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al procesar")
    } finally {
      setProcesando(null)
    }
  }

  const handleEliminarCanje = async (id: number) => {
    try {
      setEliminando(id)
      await canjesService.eliminarCanje(id)
      toast.success("Notificación eliminada")
      cargarDatos()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar")
    } finally {
      setEliminando(null)
    }
  }

  const formatDate = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-PE", {
      day: "2-digit", month: "2-digit", year: "numeric"
    })
  }

  const formatTime = (fecha: string) => {
    return new Date(fecha).toLocaleTimeString("es-PE", {
      hour: "2-digit", minute: "2-digit"
    })
  }

  const estadoColor = (estado: string) => {
    const colores: Record<string, string> = {
      pendiente: "bg-yellow-100 text-yellow-700",
      empaquetado: "bg-blue-100 text-blue-700",
      en_camino: "bg-purple-100 text-purple-700",
      entregado: "bg-green-100 text-green-700",
      cancelado: "bg-red-100 text-red-700",
    }
    return colores[estado] || "bg-gray-100 text-gray-700"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const totalPedidos = canjes.length + reclamos.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Historial de Compras
        </h2>
        <span className="text-sm text-muted-foreground">{totalPedidos} pedido(s)</span>
      </div>

      {/* Canjes de productos */}
      {canjes.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
            <Package className="h-4 w-4" /> Canjes de Productos
          </h3>
          <div className="space-y-3">
            {canjes.map((canje) => (
              <Card
                key={canje.id}
                className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
                onClick={() => setSelectedCanje(canje)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {canje.nombre[0]}{canje.apellido[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{canje.nombre} {canje.apellido}</h3>
                        <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${estadoColor(canje.estado)}`}>
                        {canje.estado}
                      </span>
                    {canje.estado === 'entregado' && (
                  <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleEliminarCanje(canje.id)
                }}
              className="text-muted-foreground hover:text-red-500 transition-colors"
              title="Eliminar notificación"
              >
            {eliminando === canje.id
          ? <Loader2 className="h-4 w-4 animate-spin" />
          : <X className="h-4 w-4" />
        }
      </button>
    )}
</div>
                      </div>
                      <p className="text-sm text-muted-foreground">{canje.producto}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />{formatDate(canje.fecha_solicitud)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />{formatTime(canje.fecha_solicitud)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">{canje.puntos_descontados} pts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Reclamos de ofertas */}
      {reclamos.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm text-muted-foreground uppercase tracking-wide">
            <Gift className="h-4 w-4" /> Reclamos de Ofertas
          </h3>
          <div className="space-y-3">
            {reclamos.map((reclamo) => (
              <Card
                key={reclamo.id}
                className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md border-accent/30"
                onClick={() => setSelectedReclamo(reclamo)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-accent/20">
                      <AvatarFallback className="bg-accent/10 text-accent">
                        {reclamo.nombre[0]}{reclamo.apellido[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{reclamo.nombre} {reclamo.apellido}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                          pendiente
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">🎁 {reclamo.oferta}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />{formatDate(reclamo.fecha)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {totalPedidos === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">
              No hay pedidos registrados aun.
              <br />
              Los canjes de los usuarios apareceran aqui.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dialog detalle canje */}
      <Dialog open={!!selectedCanje} onOpenChange={() => setSelectedCanje(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Detalle del Canje
            </DialogTitle>
            <DialogDescription>Información completa del canje</DialogDescription>
          </DialogHeader>
          {selectedCanje && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {selectedCanje.nombre[0]}{selectedCanje.apellido[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedCanje.nombre} {selectedCanje.apellido}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />{selectedCanje.telefono_contacto || selectedCanje.telefono}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" /> Fecha
                  </div>
                  <p className="font-medium">{formatDate(selectedCanje.fecha_solicitud)}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" /> Hora
                  </div>
                  <p className="font-medium">{formatTime(selectedCanje.fecha_solicitud)}</p>
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" /> Dirección de entrega
                </div>
                <p className="font-medium">{selectedCanje.direccion_entrega}</p>
                {selectedCanje.referencia && (
                  <p className="text-sm text-muted-foreground">{selectedCanje.referencia}</p>
                )}
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Package className="h-4 w-4" /> Producto
                </div>
                <p className="font-medium">{selectedCanje.producto}</p>
                <p className="text-sm text-primary">{selectedCanje.puntos_descontados} puntos</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedCanje(null)}>
                  Cerrar
                </Button>
                {selectedCanje.estado === 'pendiente' && (
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => handleCambiarEstado(selectedCanje.id, 'empaquetado')}
                    disabled={procesando === selectedCanje.id}
                  >
                    {procesando === selectedCanje.id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <><Package className="h-4 w-4" /> Empaquetar</>
                    }
                  </Button>
                )}
                {selectedCanje.estado === 'empaquetado' && (
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => handleCambiarEstado(selectedCanje.id, 'en_camino')}
                    disabled={procesando === selectedCanje.id}
                  >
                    {procesando === selectedCanje.id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : "🚚 Enviar"
                    }
                  </Button>
                )}
                {selectedCanje.estado === 'en_camino' && (
                  <Button
                    className="flex-1 gap-2"
                    onClick={() => handleCambiarEstado(selectedCanje.id, 'entregado')}
                    disabled={procesando === selectedCanje.id}
                  >
                    {procesando === selectedCanje.id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <><CheckCircle className="h-4 w-4" /> Entregado</>
                    }
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog detalle reclamo */}
      <Dialog open={!!selectedReclamo} onOpenChange={() => setSelectedReclamo(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5" /> Detalle del Reclamo
            </DialogTitle>
            <DialogDescription>Información del reclamo de oferta especial</DialogDescription>
          </DialogHeader>
          {selectedReclamo && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="bg-accent/10 text-accent text-lg">
                    {selectedReclamo.nombre[0]}{selectedReclamo.apellido[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedReclamo.nombre} {selectedReclamo.apellido}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="h-3 w-3" />{selectedReclamo.telefono}
                  </div>
                </div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Gift className="h-4 w-4" /> Oferta reclamada
                </div>
                <p className="font-medium">{selectedReclamo.oferta}</p>
                <p className="text-sm text-muted-foreground">
                  Requiere {selectedReclamo.kilos_requeridos} kg acumulados
                </p>
              </div>
              <div className="rounded-lg border p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" /> Dirección
                </div>
                <p className="font-medium">{selectedReclamo.direccion}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleReclamo(selectedReclamo.id, 'cancelado')}
                  disabled={procesando === selectedReclamo.id}
                >
                  Cancelar reclamo
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={() => handleReclamo(selectedReclamo.id, 'entregado')}
                  disabled={procesando === selectedReclamo.id}
                >
                  {procesando === selectedReclamo.id
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <><CheckCircle className="h-4 w-4" /> Entregado</>
                  }
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}