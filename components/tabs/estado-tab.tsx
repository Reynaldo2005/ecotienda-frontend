"use client"

import { useState, useEffect } from "react"
import { canjesService, ofertasService } from "@/lib/api-services"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Package, Gift, Loader2, ShoppingBag, MapPin, Phone} from "lucide-react"
import { toast } from "sonner"

interface Canje {
  id: number
  producto: string
  imagen_url: string
  puntos_descontados: number
  estado: string
  fecha_solicitud: string
  fecha_entrega: string | null
  direccion_entrega: string
  progreso: number
  mensaje_estado: string
}

interface Reclamo {
  id: number
  oferta: string
  estado: string
  fecha: string
}

const estadoConfig: Record<string, { label: string; color: string; progreso: number }> = {
  pendiente:    { label: "Pendiente",    color: "bg-yellow-100 text-yellow-700", progreso: 0  },
  empaquetado:  { label: "Empaquetando", color: "bg-blue-100 text-blue-700",    progreso: 33 },
  en_camino:    { label: "En camino",    color: "bg-purple-100 text-purple-700", progreso: 66 },
  entregado:    { label: "Entregado",    color: "bg-green-100 text-green-700",   progreso: 100},
  cancelado:    { label: "Cancelado",    color: "bg-red-100 text-red-700",       progreso: 0  },
}

const mensajeEstado: Record<string, string> = {
  pendiente:   "⏳ Tu pedido está siendo revisado por el administrador",
  empaquetado: "📦 Tu pedido está siendo empaquetado",
  en_camino:   "🚚 Tu pedido está en camino a tu puerta",
  entregado:   "✅ ¡Tu pedido ha sido entregado!",
  cancelado:   "❌ Tu pedido fue cancelado",
}

export function EstadoTab() {
  const [canjes, setCanjes] = useState<Canje[]>([])
  const [reclamos, setReclamos] = useState<Reclamo[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    cargarEstados()
    // Actualizar cada 15 segundos para ver cambios del admin
    const intervalo = setInterval(cargarEstados, 15000)
    return () => clearInterval(intervalo)
  }, [])

  const cargarEstados = async () => {
    try {
      const [canjesData, reclamosData] = await Promise.all([
        canjesService.getMisCanjes() as Promise<Canje[]>,
        fetch('http://localhost:3000/api/ofertas/mis-reclamos', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('ecotienda_token')}`
          }
        }).then(r => r.json()).catch(() => [])
      ])
      setCanjes(Array.isArray(canjesData) ? canjesData : [])
      setReclamos(Array.isArray(reclamosData) ? reclamosData : [])
    } catch (error) {
      toast.error("Error al cargar los estados")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (fecha: string) =>
    new Date(fecha).toLocaleDateString("es-PE", {
      day: "2-digit", month: "2-digit", year: "numeric"
    })

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
          <ShoppingBag className="h-5 w-5 text-primary" />
          Estado de mis Pedidos
        </h2>
        <span className="text-sm text-muted-foreground">{totalPedidos} pedido(s)</span>
      </div>

    {/* Contacto y Ubicación */}
        <Card className="border-primary/20 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 items-start sm:items-center">
                    
                {/* Título */}
                <div className="flex items-center gap-2 shrink-0">
                    <div className="bg-primary/10 rounded-full p-1.5">
                        <MapPin className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-semibold text-foreground">Centro de Reciclaje</span>
                    </div>
      
                    <div className="h-px w-full sm:h-8 sm:w-px bg-border" /> {/* Divisor */}
      
                    {/* Ubicación */}
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">
                        Al frente a la plaza de armas, Jr. Aucayacu / La carretera Fernando Belaunde Terry, antes de llegar a Yacusisa, frente al vivero Agroforestal de la Cruz SAC.
                      </span>
                    </div>
      
                    <div className="h-px w-full sm:h-8 sm:w-px bg-border" /> {/* Divisor */}
      
                    {/* Contacto */}
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-muted-foreground">
                        (+51) 929 420 327 , (+51) 962 672 038
                      </span>
                    </div>
      
                  </div>
                </CardContent>
              </Card>

      {/* Canjes de productos */}
      {canjes.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Package className="h-4 w-4" /> Canjes de Productos
          </h3>
          {canjes.map((canje) => {
            const config = estadoConfig[canje.estado] ?? estadoConfig.pendiente
            const progreso = config.progreso
            const mensaje = mensajeEstado[canje.estado] ?? ""

            return (
              <Card key={canje.id} className={`overflow-hidden border-l-4 ${
                canje.estado === 'entregado' ? 'border-l-green-500' :
                canje.estado === 'en_camino' ? 'border-l-purple-500' :
                canje.estado === 'empaquetado' ? 'border-l-blue-500' :
                canje.estado === 'cancelado' ? 'border-l-red-500' :
                'border-l-yellow-500'
              }`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{canje.producto}</h4>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(canje.fecha_solicitud)} · {canje.puntos_descontados} pts
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${config.color}`}>
                      {config.label}
                    </span>
                  </div>

                  {/* Barra de progreso */}
                  {canje.estado !== 'cancelado' && (
                    <div className="space-y-2">
                      <Progress value={progreso} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Pendiente</span>
                        <span>Empaquetando</span>
                        <span>En camino</span>
                        <span>Entregado</span>
                      </div>
                    </div>
                  )}

                  {/* Mensaje de estado */}
                  <div className={`rounded-lg p-3 text-sm ${
                    canje.estado === 'entregado' ? 'bg-green-50 text-green-700' :
                    canje.estado === 'cancelado' ? 'bg-red-50 text-red-700' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {mensaje}
                  </div>

                  {/* Dirección de entrega */}
                  {canje.estado !== 'cancelado' && (
                    <p className="text-xs text-muted-foreground">
                      📍 {canje.direccion_entrega}
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Reclamos de ofertas */}
      {reclamos.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
            <Gift className="h-4 w-4" /> Reclamos de Ofertas
          </h3>
          {reclamos.map((reclamo) => {
            const config = estadoConfig[reclamo.estado] ?? estadoConfig.pendiente
            return (
              <Card key={reclamo.id} className={`overflow-hidden border-l-4 ${
                reclamo.estado === 'entregado' ? 'border-l-green-500' :
                reclamo.estado === 'cancelado' ? 'border-l-red-500' :
                'border-l-yellow-500'
              }`}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 flex-shrink-0">
                        <Gift className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{reclamo.oferta}</h4>
                        <p className="text-xs text-muted-foreground">{formatDate(reclamo.fecha)}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <div className={`rounded-lg p-3 text-sm ${
                    reclamo.estado === 'entregado' ? 'bg-green-50 text-green-700' :
                    reclamo.estado === 'cancelado' ? 'bg-red-50 text-red-700' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    {reclamo.estado === 'pendiente' && "⏳ Tu reclamo está siendo revisado por el administrador"}
                    {reclamo.estado === 'entregado' && "✅ ¡Tu oferta ha sido entregada!"}
                    {reclamo.estado === 'cancelado' && "❌ Tu reclamo fue cancelado"}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {totalPedidos === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mb-4" />
            <h3 className="font-semibold mb-1">No tienes pedidos aún</h3>
            <p className="text-sm text-muted-foreground">
              Cuando canjees productos u ofertas, podrás ver su estado aquí.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}