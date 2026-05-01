"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface Product {
  id: string
  nombre: string
  imagen: string
  puntosRequeridos: number
  stock: number
  descripcion: string
}

export interface Material {
  id: string
  nombre: string
  puntosPorKg: number
  descripcion: string
}

export interface Offer {
  id: string
  titulo: string
  descripcion: string
  kilosRequeridos: number
  premio: string
  activa: boolean
}

export interface OrderItem {
  productId: string
  producto: Product
  cantidad: number
}

export interface Order {
  id: string
  userId: string
  userName: string
  userApellido: string
  userDireccion: string
  userTelefono: string
  userFoto: string | null
  items: OrderItem[]
  totalPuntos: number
  fecha: Date
  estado: "pendiente" | "completado" | "cancelado"
}

export interface Transaction {
  id: string
  userId: string
  tipo: "deposito" | "canje"
  puntos: number
  kilos?: number
  descripcion: string
  fecha: Date
}

interface StoreContextType {
  products: Product[]
  materials: Material[]
  offers: Offer[]
  orders: Order[]
  transactions: Transaction[]
  cart: OrderItem[]
  addToCart: (product: Product, cantidad: number) => void
  removeFromCart: (productId: string) => void
  updateCartItem: (productId: string, cantidad: number) => void
  clearCart: () => void
  createOrder: (userId: string, userName: string, userApellido: string, userDireccion: string, userTelefono: string, userFoto: string | null) => Order | null
  addTransaction: (transaction: Omit<Transaction, "id" | "fecha">) => void
  getCartTotal: () => number
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

const initialProducts: Product[] = [
  {
    id: "prod-1",
    nombre: "Lapiz Ecologico",
    imagen: "/products/lapiz.jpg",
    puntosRequeridos: 15,
    stock: 100,
    descripcion: "Lapiz hecho de papel reciclado",
  },
  {
    id: "prod-2",
    nombre: "Borrador Natural",
    imagen: "/products/borrador.jpg",
    puntosRequeridos: 10,
    stock: 80,
    descripcion: "Borrador biodegradable",
  },
  {
    id: "prod-3",
    nombre: "Cuaderno Reciclado",
    imagen: "/products/cuaderno.jpg",
    puntosRequeridos: 45,
    stock: 50,
    descripcion: "Cuaderno de 100 hojas recicladas",
  },
  {
    id: "prod-4",
    nombre: "Planta Suculenta",
    imagen: "/products/planta.jpg",
    puntosRequeridos: 80,
    stock: 30,
    descripcion: "Planta decorativa en maceta ecologica",
  },
  {
    id: "prod-5",
    nombre: "Bolsa Reutilizable",
    imagen: "/products/bolsa.jpg",
    puntosRequeridos: 25,
    stock: 120,
    descripcion: "Bolsa de tela resistente",
  },
  {
    id: "prod-6",
    nombre: "Kit Escolar",
    imagen: "/products/kit.jpg",
    puntosRequeridos: 120,
    stock: 25,
    descripcion: "Kit completo con lapices, borrador y regla",
  },
]

const initialMaterials: Material[] = [
  { id: "mat-1", nombre: "Latas de aluminio", puntosPorKg: 5, descripcion: "Latas de bebidas y conservas" },
  { id: "mat-2", nombre: "Botellas de plastico", puntosPorKg: 3, descripcion: "Botellas PET y HDPE" },
  { id: "mat-3", nombre: "Papel y carton", puntosPorKg: 2, descripcion: "Periodicos, revistas, cajas" },
  { id: "mat-4", nombre: "Vidrio", puntosPorKg: 4, descripcion: "Botellas y frascos de vidrio" },
  { id: "mat-5", nombre: "Electrodomesticos", puntosPorKg: 8, descripcion: "Aparatos electricos pequenos" },
  { id: "mat-6", nombre: "Aceite usado", puntosPorKg: 6, descripcion: "Aceite de cocina usado" },
]

const initialOffers: Offer[] = [
  {
    id: "offer-1",
    titulo: "Kit Escolar Gratis",
    descripcion: "Al acumular 100 kg de reciclaje, recibe un kit escolar completo",
    kilosRequeridos: 100,
    premio: "Kit Escolar Completo",
    activa: true,
  },
  {
    id: "offer-2",
    titulo: "Kit de Limpieza",
    descripcion: "Al acumular 200 kg de reciclaje, recibe un kit de limpieza ecologico",
    kilosRequeridos: 200,
    premio: "Kit de Limpieza Ecologico",
    activa: true,
  },
  {
    id: "offer-3",
    titulo: "Electrodomestico",
    descripcion: "Al acumular 500 kg de reciclaje, participa en el sorteo de un electrodomestico",
    kilosRequeridos: 500,
    premio: "Participacion en Sorteo",
    activa: true,
  },
]

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products] = useState<Product[]>(initialProducts)
  const [materials] = useState<Material[]>(initialMaterials)
  const [offers] = useState<Offer[]>(initialOffers)
  const [orders, setOrders] = useState<Order[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [cart, setCart] = useState<OrderItem[]>([])

  const addToCart = (product: Product, cantidad: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id)
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        )
      }
      return [...prev, { productId: product.id, producto: product, cantidad }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId))
  }

  const updateCartItem = (productId: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(productId)
      return
    }
    setCart(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, cantidad } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.producto.puntosRequeridos * item.cantidad, 0)
  }

  const createOrder = (
    userId: string,
    userName: string,
    userApellido: string,
    userDireccion: string,
    userTelefono: string,
    userFoto: string | null
  ): Order | null => {
    if (cart.length === 0) return null

    const order: Order = {
      id: `order-${Date.now()}`,
      userId,
      userName,
      userApellido,
      userDireccion,
      userTelefono,
      userFoto,
      items: [...cart],
      totalPuntos: getCartTotal(),
      fecha: new Date(),
      estado: "pendiente",
    }

    setOrders(prev => [order, ...prev])
    clearCart()
    return order
  }

  const addTransaction = (transaction: Omit<Transaction, "id" | "fecha">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `trans-${Date.now()}`,
      fecha: new Date(),
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  return (
    <StoreContext.Provider
      value={{
        products,
        materials,
        offers,
        orders,
        transactions,
        cart,
        addToCart,
        removeFromCart,
        updateCartItem,
        clearCart,
        createOrder,
        addTransaction,
        getCartTotal,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
