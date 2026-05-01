"use client"

import { useState, useEffect, useRef } from "react"
import { productosService } from "@/lib/api-services"
import { ofertasService } from "@/lib/api-services"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Plus, Trash2, Loader2, ImagePlus, X, Star } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface Producto {
  id: number
  nombre: string
  descripcion: string
  imagen_url: string
  costo_puntos: number
  stock: number
  categoria: string
}

export function StockAdminTab() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [eliminando, setEliminando] = useState<number | null>(null)
  const [imagenPreview, setImagenPreview] = useState<string | null>(null)
  const [imagenFile, setImagenFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    costo_puntos: "",
    stock: "",
  })

  useEffect(() => {
    cargarProductos()
  }, [])

  const cargarProductos = async () => {
    try {
      setIsLoading(true)
      const data = await productosService.getProductos() as Producto[]
      setProductos(data)
    } catch (error) {
      toast.error("Error al cargar los productos")
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
    reader.onloadend = () => setImagenPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleQuitarImagen = () => {
    setImagenFile(null)
    setImagenPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleCrear = async () => {
    if (!form.nombre || !form.costo_puntos || !form.stock) {
      toast.error("Nombre, puntos y stock son obligatorios")
      return
    }
    try {
      setIsCreating(true)
      let imagen_url = ""

      // Subir imagen si hay una seleccionada
      if (imagenFile) {
        toast.info("Subiendo imagen...")
        const token = localStorage.getItem("ecotienda_token")
        const formData = new FormData()
        formData.append("imagen", imagenFile)
        const response = await fetch("http://localhost:3000/api/ofertas/upload-imagen", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        })
        if (!response.ok) throw new Error("Error al subir la imagen")
        const resultado = await response.json()
        imagen_url = resultado.url
      }

      await productosService.crearProducto({
        categoria_id: 1, // Categoría por defecto
        nombre: form.nombre,
        descripcion: form.descripcion,
        imagen_url,
        costo_puntos: parseInt(form.costo_puntos),
        stock: parseInt(form.stock),
      })

      toast.success("¡Producto creado correctamente!")
      setForm({ nombre: "", descripcion: "", costo_puntos: "", stock: "" })
      handleQuitarImagen()
      cargarProductos()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear el producto")
    } finally {
      setIsCreating(false)
    }
  }

  const handleEliminar = async (id: number) => {
    try {
      setEliminando(id)
      await productosService.eliminarProducto(id)
      toast.success("Producto eliminado correctamente")
      cargarProductos()
    } catch (error) {
      toast.error("Error al eliminar el producto")
    } finally {
      setEliminando(null)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        Gestión de Productos
      </h2>

      {/* Formulario crear producto */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" /> Nuevo Producto
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Título *</Label>
              <Input
                id="nombre"
                placeholder="Ej: Kit Escolar"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Imagen del producto</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleImagenSeleccionada}
              />
              {imagenPreview ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border">
                  <Image src={imagenPreview} alt="Preview" fill className="object-cover" />
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
                  <span className="text-sm text-muted-foreground">Haz clic para subir imagen</span>
                  <span className="text-xs text-muted-foreground">JPG, PNG, WEBP — máx 5MB</span>
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              placeholder="Describe el producto..."
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="puntos">Puntos necesarios *</Label>
              <Input
                id="puntos"
                type="number"
                placeholder="Ej: 50"
                value={form.costo_puntos}
                onChange={(e) => setForm({ ...form, costo_puntos: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock disponible *</Label>
              <Input
                id="stock"
                type="number"
                placeholder="Ej: 10"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
          </div>

          <Button className="w-full gap-2" onClick={handleCrear} disabled={isCreating}>
            {isCreating
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Creando...</>
              : <><Plus className="h-4 w-4" /> Agregar Producto</>
            }
          </Button>
        </CardContent>
      </Card>

      {/* Lista de productos */}
      <div>
        <h3 className="font-semibold mb-3 text-sm text-muted-foreground uppercase tracking-wide">
          Productos Activos
        </h3>
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : productos.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-10 text-center text-muted-foreground">
              <Package className="mx-auto mb-3 h-10 w-10 opacity-30" />
              <p>No hay productos activos. ¡Crea el primero!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {productos.map((producto) => (
              <Card key={producto.id} className="border-primary/20 overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex">
                    {producto.imagen_url ? (
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={producto.imagen_url}
                          alt={producto.nombre}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 flex-shrink-0 bg-primary/10 flex items-center justify-center">
                        <Package className="h-8 w-8 text-primary/40" />
                      </div>
                    )}
                    <div className="flex-1 p-4 flex items-start justify-between gap-4">
                      <div>
                        <h4 className="font-semibold">{producto.nombre}</h4>
                        {producto.descripcion && (
                          <p className="text-sm text-muted-foreground mt-1">{producto.descripcion}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1 text-primary font-medium">
                            <Star className="h-4 w-4 text-accent" />
                            {producto.costo_puntos} puntos
                          </span>
                          <span className="text-muted-foreground">
                            Stock: {producto.stock} unidades
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-500 hover:bg-red-50 flex-shrink-0"
                        onClick={() => handleEliminar(producto.id)}
                        disabled={eliminando === producto.id}
                      >
                        {eliminando === producto.id
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