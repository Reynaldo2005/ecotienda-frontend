"use client"

import { useState, useEffect, useRef } from "react"
import { ofertasService } from "@/lib/api-services"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Gift, Plus, Trash2, Loader2, Scale, ImagePlus, X } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Oferta {
  id: number
  titulo: string
  descripcion: string
  imagen_url: string
  kilos_requeridos: number
  stock: number
  creado_en: string
}

export function OfertasAdminTab() {
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [eliminando, setEliminando] = useState<number | null>(null)
  const [imagenPreview, setImagenPreview] = useState<string | null>(null)
  const [imagenFile, setImagenFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    imagen_url: "",
    kilos_requeridos: "",
    stock: "",
  })

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

  const handleImagenSeleccionada = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar 5MB")
      return
    }

    setImagenFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagenPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleQuitarImagen = () => {
    setImagenFile(null)
    setImagenPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleCrear = async () => {
    if (!form.titulo || !form.kilos_requeridos || !form.stock) {
      toast.error("Título, kilos requeridos y stock son obligatorios")
      return
    }

    try {
      setIsCreating(true)
      let imagen_url = ""

      // Si hay imagen, subirla primero
      if (imagenFile) {
        toast.info("Subiendo imagen...")
        const resultado = await ofertasService.subirImagen(imagenFile)
        imagen_url = resultado.url
      }

      await ofertasService.crearOferta({
        titulo: form.titulo,
        descripcion: form.descripcion,
        imagen_url,
        kilos_requeridos: parseFloat(form.kilos_requeridos),
        stock: parseInt(form.stock),
      })

      toast.success("¡Oferta creada correctamente!")
      setForm({ titulo: "", descripcion: "", imagen_url: "", kilos_requeridos: "", stock: "" })
      handleQuitarImagen()
      cargarOfertas()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear la oferta")
    } finally {
      setIsCreating(false)
    }
  }

  const handleEliminar = async (id: number) => {
    try {
      setEliminando(id)
      await ofertasService.eliminarOferta(id)
      toast.success("Oferta eliminada correctamente")
      cargarOfertas()
    } catch (error) {
      toast.error("Error al eliminar la oferta")
    } finally {
      setEliminando(null)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Gift className="h-5 w-5 text-primary" />
        Gestión de Ofertas Especiales
      </h2>

      {/* Formulario crear oferta */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" /> Nueva Oferta
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título *</Label>
              <Input
                id="titulo"
                placeholder="Ej: Canasta Familiar"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Imagen de la oferta</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleImagenSeleccionada}
              />
              {imagenPreview ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                  <Image
                    src={imagenPreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={handleQuitarImagen}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-colors"
                >
                  <ImagePlus className="h-8 w-8 text-muted-foreground/50" />
                  <span className="text-sm text-muted-foreground">Haz clic para subir una imagen</span>
                  <span className="text-xs text-muted-foreground">JPG, PNG, WEBP — máx 5MB</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              placeholder="Describe la oferta..."
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kilos">Kilos requeridos *</Label>
              <Input
                id="kilos"
                type="number"
                placeholder="Ej: 100"
                value={form.kilos_requeridos}
                onChange={(e) => setForm({ ...form, kilos_requeridos: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock disponible *</Label>
              <Input
                id="stock"
                type="number"
                placeholder="Ej: 5"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>

          <Button className="w-full gap-2" onClick={handleCrear} disabled={isCreating}>
            {isCreating
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Creando...</>
              : <><Plus className="h-4 w-4" /> Agregar Oferta</>
            }
          </Button>
        </CardContent>
      </Card>

      {/* Lista de ofertas activas */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          Ofertas Activas
        </h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : ofertas.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-10 text-center text-muted-foreground">
              <Gift className="mx-auto mb-3 h-10 w-10 opacity-30" />
              <p>No hay ofertas activas. ¡Crea la primera!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {ofertas.map((oferta) => (
              <Card key={oferta.id} className="border-primary/20 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    {oferta.imagen_url && (
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={oferta.imagen_url}
                          alt={oferta.titulo}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-4 flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold">{oferta.titulo}</h4>
                        {oferta.descripcion && (
                          <p className="text-sm text-muted-foreground mt-1">{oferta.descripcion}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1 text-primary font-medium">
                            <Scale className="h-4 w-4" />
                            {oferta.kilos_requeridos} kg requeridos
                          </span>
                          <span className="text-muted-foreground">
                            Stock: {oferta.stock} unidades
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                        onClick={() => handleEliminar(oferta.id)}
                        disabled={eliminando === oferta.id}
                      >
                        {eliminando === oferta.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Trash2 className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}