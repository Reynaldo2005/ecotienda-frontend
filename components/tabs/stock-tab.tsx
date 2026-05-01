"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { productosService, canjesService, reciclajeService } from "@/lib/api-services"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Star, Minus, Plus, ShoppingCart, Package, CheckCircle, Recycle, Loader2, MapPin, Phone } from "lucide-react"
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

interface CartItem {
  producto: Producto
  cantidad: number
}

interface Saldo {
  puntos_actuales: number
  kilos_totales: string
}

interface StockTabProps {
  onCanjeExitoso?: () => void
}

export function StockTab({ onCanjeExitoso }: StockTabProps) {
  const { user } = useAuth()
  const [productos, setProductos] = useState<Producto[]>([])
  const [saldo, setSaldo] = useState<Saldo | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [quantities, setQuantities] = useState<Record<number, number>>({})

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setIsLoading(true)
      const [productosData, saldoData] = await Promise.all([
        productosService.getProductos() as Promise<Producto[]>,
        reciclajeService.getSaldo() as Promise<Saldo>
      ])
      setProductos(productosData)
      setSaldo(saldoData)
    } catch (error) {
      toast.error("Error al cargar los productos")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  const puntosActuales = saldo?.puntos_actuales ?? 0

  const getQuantity = (productId: number) => quantities[productId] || 0

  const handleQuantityChange = (productId: number, delta: number) => {
    setQuantities(prev => {
      const current = prev[productId] || 0
      const newQty = Math.max(0, current + delta)
      return { ...prev, [productId]: newQty }
    })
  }

  const handleAddToCart = (producto: Producto) => {
    const qty = getQuantity(producto.id)
    if (qty === 0) {
      toast.error("Selecciona al menos 1 unidad")
      return
    }
    setCart(prev => {
      const existing = prev.find(item => item.producto.id === producto.id)
      if (existing) {
        return prev.map(item =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + qty }
            : item
        )
      }
      return [...prev, { producto, cantidad: qty }]
    })
    setQuantities(prev => ({ ...prev, [producto.id]: 0 }))
    toast.success(`${producto.nombre} agregado al carrito`)
  }

  const updateCartItem = (productId: number, cantidad: number) => {
    if (cantidad <= 0) {
      setCart(prev => prev.filter(item => item.producto.id !== productId))
    } else {
      setCart(prev => prev.map(item =>
        item.producto.id === productId ? { ...item, cantidad } : item
      ))
    }
  }

  const getCartTotal = () => cart.reduce((total, item) => total + item.producto.costo_puntos * item.cantidad, 0)

  const cartTotal = getCartTotal()
  const canAfford = puntosActuales >= cartTotal

  const handleCheckout = async () => {
  if (cart.length === 0) {
    toast.error("El carrito está vacío")
    return
  }
  if (!canAfford) {
    toast.error("No tienes suficientes puntos")
    return
  }

    try {
    setIsCheckingOut(true)

    // Obtener dirección principal del usuario
    const { direccion_id } = await reciclajeService.getMiDireccion() as { direccion_id: number }

    // Crear un canje por cada producto del carrito
    for (const item of cart) {
      for (let i = 0; i < item.cantidad; i++) {
        await canjesService.solicitarCanje({
          producto_id: item.producto.id,
          direccion_entrega_id: direccion_id
        })
      }
    }

      setCart([])
    setIsCartOpen(false)
    setIsSuccessOpen(true)
    cargarDatos()
    onCanjeExitoso?.()

  } catch (error) {
    toast.error(error instanceof Error ? error.message : "Error al procesar el canje")
  } finally {
    setIsCheckingOut(false)
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
      {/* Header with Points */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Tienda de Productos</h2>
        <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
          <Star className="h-5 w-5 text-accent" />
          <span className="font-bold text-lg">{puntosActuales}</span>
          <span className="text-muted-foreground">puntos</span>
        </div>
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

      {/* Products Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {productos.map((producto) => {
          const qty = getQuantity(producto.id)
          const canBuy = puntosActuales >= producto.costo_puntos

          return (
            <Card key={producto.id} className="overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative">
                {producto.imagen_url ? (
                  <Image
                    src={producto.imagen_url}
                    alt={producto.nombre}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Recycle className="h-16 w-16 text-primary/50" />
                )}
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1">{producto.nombre}</h3>
                <p className="text-sm text-muted-foreground mb-3">{producto.descripcion}</p>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-accent" />
                    <span className="font-bold text-primary">{producto.costo_puntos}</span>
                    <span className="text-sm text-muted-foreground">pts</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Stock: {producto.stock}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded-lg border">
                    <button
                      onClick={() => handleQuantityChange(producto.id, -1)}
                      className="p-2 hover:bg-muted transition-colors"
                      disabled={qty === 0}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center font-medium">{qty}</span>
                    <button
                      onClick={() => handleQuantityChange(producto.id, 1)}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(producto)}
                    disabled={!canBuy || qty === 0}
                    className="flex-1"
                  >
                    Agregar
                  </Button>
                </div>
                {!canBuy && (
                  <p className="mt-2 text-xs text-destructive text-center">Puntos insuficientes</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Floating Cart Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Button size="lg" onClick={() => setIsCartOpen(true)} className="shadow-lg gap-2 px-6">
            <ShoppingCart className="h-5 w-5" />
            Ver Carrito ({cart.length})
            <span className="ml-2 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-sm">
              {cartTotal} pts
            </span>
          </Button>
        </div>
      )}

      {/* Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" /> Mi Carrito
            </DialogTitle>
            <DialogDescription>Revisa tus productos antes de canjear</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {cart.map((item) => (
              <div key={item.producto.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{item.producto.nombre}</p>
                    <p className="text-sm text-muted-foreground">{item.producto.costo_puntos} pts c/u</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center rounded border">
                    <button onClick={() => updateCartItem(item.producto.id, item.cantidad - 1)} className="p-1 hover:bg-muted">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm">{item.cantidad}</span>
                    <button onClick={() => updateCartItem(item.producto.id, item.cantidad + 1)} className="p-1 hover:bg-muted">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <button onClick={() => updateCartItem(item.producto.id, 0)} className="text-destructive hover:underline text-xs">
                    Quitar
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-lg bg-muted p-4">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Tus puntos:</span>
              <span className="font-medium">{puntosActuales} pts</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Total carrito:</span>
              <span className="font-medium">{cartTotal} pts</span>
            </div>
            <div className="border-t pt-2 flex justify-between">
              <span className="font-semibold">Puntos restantes:</span>
              <span className={`font-bold ${canAfford ? "text-primary" : "text-destructive"}`}>
                {puntosActuales - cartTotal} pts
              </span>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsCartOpen(false)}>Seguir comprando</Button>
            <Button onClick={handleCheckout} disabled={!canAfford || isCheckingOut}>
              {isCheckingOut
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Procesando...</>
                : <><ShoppingCart className="h-4 w-4 mr-2" /> Canjear</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="sr-only">
            <DialogTitle>Canje Exitoso</DialogTitle>
            <DialogDescription>Tu pedido ha sido procesado</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <CheckCircle className="h-10 w-10 text-primary-foreground" />
            </div>
            <h2 className="mb-2 text-2xl font-bold">Canje Exitoso</h2>
            <p className="text-muted-foreground mb-4">
              Tu pedido ha sido enviado al administrador. Pronto te contactaremos para coordinar la entrega.
            </p>
            <div className="mt-1 mb-4 mx-auto max-w-xs bg-primary/10 rounded-xl px-4 py-2 border border-primary/20">
            <p className="text-xs text-primary font-medium text-center">
            🌿 ¡Cada kilo cuenta para un Aucayacu más limpio! ¡Sigue reciclando! ♻️
            </p>
            </div>
            <Button onClick={() => setIsSuccessOpen(false)}>Entendido</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}