"use client"

import { useState, useEffect } from "react"
import { adminService } from "@/lib/api-services"
import { reciclajeService } from "@/lib/api-services"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Star, Scale, MapPin, Phone, Mail, X, Plus, CheckCircle, Search, Trash2, Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

interface Cliente {
  id: number
  nombre: string
  apellido: string
  correo: string
  telefono: string
  direccion: string
  ciudad: string
  creado_en: string
  puntos_actuales: number
  kilos_totales: string
  foto_perfil: string | null
}

interface Material {
  id: number
  nombre: string
  puntos_por_kilo: number
}

export function RegistradosTab() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [materiales, setMateriales] = useState<Material[]>([])
  const [busqueda, setBusqueda] = useState("")
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null)
  const [clienteAEliminar, setClienteAEliminar] = useState<Cliente | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [eliminando, setEliminando] = useState(false)
  const [registrando, setRegistrando] = useState(false)
  const [materialId, setMaterialId] = useState<string>("")
  const [puntosAgregar, setPuntosAgregar] = useState("")
  const [kilos, setKilos] = useState("")
  
  
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setIsLoading(true)
      const [clientesData, materialesData] = await Promise.all([
        adminService.getClientes() as Promise<Cliente[]>,
        fetch('http://localhost:3000/api/materiales')
        .then(r => r.json())
        .then(data => Array.isArray(data) ? data : [])
      ])
      setClientes(clientesData)
      setMateriales(materialesData)
    } catch (error) {
      toast.error("Error al cargar los usuarios")
    } finally {
      setIsLoading(false)
    }
  }

  const clientesFiltrados = busqueda.trim()
    ? clientes.filter(c =>
        `${c.nombre} ${c.apellido}`.toLowerCase().includes(busqueda.toLowerCase())
      )
    : clientes

  const handleRegistrarReciclaje = async () => {
  if (!selectedCliente || !kilos || !puntosAgregar) {
    toast.error("Ingresa los kilos y los puntos a asignar")
    return
  }
  try {
    setRegistrando(true)
    await fetch('http://localhost:3000/api/reciclaje/manual', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('ecotienda_token')}`
      },
      body: JSON.stringify({
        usuario_id: selectedCliente.id,
        kilos: parseFloat(kilos),
        puntos: parseInt(puntosAgregar)
      })
    }).then(async r => {
      const data = await r.json()
      if (!r.ok) throw new Error(data.error)
      return data
    })
    toast.success(`✅ ${kilos} kg y ${puntosAgregar} pts registrados a ${selectedCliente.nombre}`)
    setKilos("")
    setPuntosAgregar("")
    setSelectedCliente(null)
    cargarDatos()
  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Error al registrar")
  } finally {
    setRegistrando(false)
  }
}

  const handleEliminarCliente = async () => {
    if (!clienteAEliminar) return
    try {
      setEliminando(true)
      await adminService.eliminarCliente(clienteAEliminar.id)
      toast.success(`Usuario ${clienteAEliminar.nombre} eliminado correctamente`)
      setClienteAEliminar(null)
      cargarDatos()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar")
    } finally {
      setEliminando(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Usuarios Registrados
        </h2>
        <span className="text-sm text-muted-foreground">{clientesFiltrados.length} usuario(s)</span>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="pl-9"
        />
        {busqueda && (
          <button
            onClick={() => setBusqueda("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {clientesFiltrados.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground text-center">
              {busqueda ? `No se encontró ningún usuario con "${busqueda}"` : "No hay usuarios registrados aún."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {clientesFiltrados.map((cliente) => (
            <Card
              key={cliente.id}
              className="cursor-pointer transition-all hover:border-primary/50 hover:shadow-md"
              onClick={() => setSelectedCliente(cliente)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">

                <Avatar className="h-12 w-12 border-2 border-primary/20">
                {cliente.foto_perfil ? (
                  <img
                    src={cliente.foto_perfil}
                    alt={cliente.nombre}
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {cliente.nombre[0]}{cliente.apellido[0]}
                  </AvatarFallback>
                )}
              </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{cliente.nombre} {cliente.apellido}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />{cliente.telefono}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right space-y-1">
                      <div className="flex items-center gap-1 justify-end">
                        <Star className="h-4 w-4 text-accent" />
                        <span className="font-bold text-primary">{cliente.puntos_actuales}</span>
                        <span className="text-xs text-muted-foreground">pts</span>
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <Scale className="h-4 w-4 text-primary" />
                        <span className="font-medium">{parseFloat(cliente.kilos_totales || "0").toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">kg</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setClienteAEliminar(cliente)
                      }}
                      className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                      title="Eliminar usuario"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog detalle cliente */}
      <Dialog open={!!selectedCliente} onOpenChange={() => setSelectedCliente(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" /> Datos del Usuario
            </DialogTitle>
            <DialogDescription>Información y registro de reciclaje</DialogDescription>
          </DialogHeader>
          {selectedCliente && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                <Avatar className="h-16 w-16 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {selectedCliente.nombre[0]}{selectedCliente.apellido[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedCliente.nombre} {selectedCliente.apellido}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="h-3 w-3" />{selectedCliente.correo}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border p-3 text-center">
                  <Star className="h-6 w-6 mx-auto text-accent mb-1" />
                  <p className="text-2xl font-bold text-primary">{selectedCliente.puntos_actuales}</p>
                  <p className="text-xs text-muted-foreground">Puntos actuales</p>
                </div>
                <div className="rounded-lg border p-3 text-center">
                  <Scale className="h-6 w-6 mx-auto text-primary mb-1" />
                  <p className="text-2xl font-bold text-primary">{parseFloat(selectedCliente.kilos_totales || "0").toFixed(1)}</p>
                  <p className="text-xs text-muted-foreground">Kilos acumulados</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Phone className="h-4 w-4" /> Teléfono
                  </div>
                  <p className="font-medium">{selectedCliente.telefono}</p>
                </div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" /> Dirección
                  </div>
                  <p className="font-medium">{selectedCliente.direccion}</p>
                </div>
              </div>

              {/* Registrar reciclaje */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Plus className="h-4 w-4" /> Registrar Reciclaje
                </h4>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Kilos reciclados</Label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Ej: 5.5"
                      value={kilos}
                      onChange={(e) => setKilos(e.target.value)}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Puntos a asignar</Label>
                    <Input
                      type="number"
                      placeholder="Ej: 25"
                      value={puntosAgregar}
                      onChange={(e) => setPuntosAgregar(e.target.value)}
                      className="h-9"
                    />
                  </div>
                </div>
                <Button onClick={handleRegistrarReciclaje} className="w-full gap-2" disabled={registrando}>
                  {registrando
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Registrando...</>
                    : <><CheckCircle className="h-4 w-4" /> Registrar</>
                  }
                </Button>
              </div>
              <Button variant="outline" onClick={() => setSelectedCliente(null)} className="w-full">
                Cerrar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog confirmar eliminar */}
      <Dialog open={!!clienteAEliminar} onOpenChange={() => setClienteAEliminar(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertTriangle className="h-5 w-5" /> Eliminar Usuario
            </DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          {clienteAEliminar && (
            <div className="space-y-4">
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-700">
                  ¿Estás seguro que deseas eliminar a <strong>{clienteAEliminar.nombre} {clienteAEliminar.apellido}</strong>?
                  Se eliminarán todos sus datos, puntos e historial.
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setClienteAEliminar(null)}>
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1 gap-2"
                  onClick={handleEliminarCliente}
                  disabled={eliminando}
                >
                  {eliminando
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Eliminando...</>
                    : <><Trash2 className="h-4 w-4" /> Eliminar</>
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