"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { ofertasService } from "@/lib/api-services"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Scale, Gift, Trophy, Target, CheckCircle, Loader2, MapPin, Phone } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Oferta {
  id: number
  titulo: string
  descripcion: string
  imagen_url: string
  kilos_requeridos: number
  stock: number
  kilos_cliente: number
  progreso: number
  puede_reclamar: boolean
  ya_reclamado: boolean
  estado_reclamo: string | null
}

// 👇 CAMBIO 1: botón "Ver más" movido a la derecha
function VerMasOferta({ oferta }: { oferta: Oferta }) {
  const [abierto, setAbierto] = useState(false)

   return (
    <div>
      {abierto && (
        <div className="mt-3 space-y-3 rounded-lg border p-3 bg-muted/30">
          {oferta.imagen_url && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={oferta.imagen_url}
                alt={oferta.titulo}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function OfertasTab() {
  const { user } = useAuth()
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reclamando, setReclamando] = useState<number | null>(null)
  const [abiertosMap, setAbiertosMap] = useState<Record<number, boolean>>({})

  useEffect(() => {
    cargarOfertas()
  }, [])

  const cargarOfertas = async () => {
    try {
      setIsLoading(true)
      const data = await ofertasService.getOfertas() as Oferta[]
      setOfertas(data)
    } catch (error) {
      toast.error("Error al cargar las ofertas")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReclamar = async (oferta: Oferta) => {
    try {
      setReclamando(oferta.id)
      await ofertasService.reclamarOferta(oferta.id)
      toast.success("¡Oferta reclamada! El administrador se pondrá en contacto contigo.")
      cargarOfertas()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al reclamar la oferta")
    } finally {
      setReclamando(null)
    }
  }

  if (!user) return null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const kilosAcumulados = ofertas.length > 0 ? ofertas[0].kilos_cliente : 0

  // 👇 CAMBIO 2: fondo de bosque con overlay sutil
  return (
      <div className="space-y-6 p-2 min-h-screen rounded-xl">
      {/* Contenido */}
      <div className="space-y-6 p-2">

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

        {/* Kilos Counter */}
        <Card className="border-primary/20 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary">
                <Scale className="h-10 w-10 text-primary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">Kilogramos Acumulados</p>
              <p className="text-5xl font-bold text-foreground">
                {kilosAcumulados.toFixed(1)}
              </p>
              <p className="text-lg text-muted-foreground">Kg reciclados</p>
            </div>
          </CardContent>
        </Card>

        {/* Offers Section */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-foreground flex items-center gap-2">
            <Gift className="h-5 w-5 text-accent" />
            Ofertas Especiales
          </h2>

          {ofertas.length === 0 ? (
            <Card className="border-dashed bg-white/80 backdrop-blur-sm">
              <CardContent className="p-10 text-center text-muted-foreground">
                <Gift className="mx-auto mb-3 h-10 w-10 opacity-30" />
                <p>No hay ofertas disponibles por el momento</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {ofertas.map((oferta) => (
                <Card
                  key={oferta.id}
                  className={`overflow-hidden transition-all bg-white/80 backdrop-blur-sm ${
                    oferta.puede_reclamar
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
                          oferta.puede_reclamar ? "bg-primary" : "bg-muted"
                        }`}>
                          {oferta.puede_reclamar ? (
                            <Trophy className="h-6 w-6 text-primary-foreground" />
                          ) : (
                            <Target className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                        <CardTitle className="text-lg">{oferta.titulo}</CardTitle>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-muted-foreground">{oferta.descripcion}</p>
                          {(oferta.imagen_url) && (
                            <button
                              onClick={() => setAbiertosMap(prev => ({ ...prev, [oferta.id]: !prev[oferta.id] }))}
                              className="text-sm text-primary hover:underline flex items-center gap-1 shrink-0"
                            >
                              {abiertosMap[oferta.id] ? "Ver menos ▲" : "Ver más ▼"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                      {oferta.puede_reclamar && (
                        <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progreso</span>
                        <span className="font-medium">
                          {kilosAcumulados.toFixed(1)} / {oferta.kilos_requeridos} Kg
                        </span>
                      </div>
                      <Progress value={oferta.progreso} className="h-3" />

                      {oferta.imagen_url && abiertosMap[oferta.id] && (
                      <div className="mt-3 rounded-lg border overflow-hidden">
                        <div className="relative w-full h-48">
                          <Image
                            src={oferta.imagen_url}
                            alt={oferta.titulo}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}

                      {oferta.ya_reclamado ? (
                        <div className={`rounded-lg p-3 text-center text-sm font-medium ${
                          oferta.estado_reclamo === 'entregado'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-yellow-50 text-yellow-700'
                        }`}>
                          {oferta.estado_reclamo === 'entregado'
                            ? '✅ Ya recibiste esta oferta'
                            : '⏳ Reclamo pendiente de entrega'
                          }
                        </div>
                      ) : oferta.puede_reclamar ? (
                        <Button
                          className="w-full"
                          onClick={() => handleReclamar(oferta)}
                          disabled={reclamando === oferta.id}
                        >
                          {reclamando === oferta.id ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reclamando...</>
                          ) : (
                            <><Gift className="mr-2 h-4 w-4" /> Reclamar Oferta</>
                          )}
                        </Button>
                      ) : (
                        <div className="rounded-lg bg-muted p-3">
                          <p className="text-sm text-muted-foreground text-center">
                            Te faltan {(oferta.kilos_requeridos - kilosAcumulados).toFixed(1)} Kg para esta oferta
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Motivation Card */}
        <Card className="border-accent/30 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <Trophy className="mx-auto mb-3 h-10 w-10 text-accent" />
            <h3 className="mb-2 text-lg font-semibold">¡Sigue reciclando!</h3>
            <p className="text-sm text-muted-foreground">
              Cada kilogramo cuenta. Mientras más recicles, más premios podrás obtener.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}