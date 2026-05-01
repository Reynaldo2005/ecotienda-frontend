"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { apiCall } from "./api-config"

export interface User {
  id: string
  nombre: string
  apellido: string
  correo: string
  rol: "cliente" | "admin" | string
  // Campos del backend mapeados al frontend
  puntos?: number // Mapeado de puntos_actuales
  kilosAcumulados?: number // Mapeado de kilos_totales
  // Propiedades opcionales para compatibilidad con componentes
  email?: string // Alias de correo
  direccion?: string
  referencia?: string
  telefono?: string
  fotoPerfil?: string | null
  dni?: string
  isAdmin?: boolean
  creado_en?: string
}

interface AuthContextType {
  user: User | null
  users: User[] // Para compatibilidad temporal con admin
  isLoading: boolean
  token: string | null
  login: (nombre: string, contraseña: string) => Promise<{ success: boolean; error?: string }>
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loadUsers: () => Promise<void> // Cargar lista de usuarios para admins
  updateUser: (userId: string, data: Partial<User>) => void // Temporal: para compatibilidad
  updateUserPoints: (userId: string, puntos: number, kilos: number) => void // Temporal: para compatibilidad
}

interface RegisterData {
  nombre: string
  apellido: string
  correo: string
  contraseña: string
  telefono: string
  direccion: string
}

interface LoginResponse {
  mensaje: string
  token: string
  usuario: User
}

interface RegisterResponse {
  mensaje: string
}

// Función helper para mapear datos del backend a User del frontend
// El backend devuelve: id, nombre, apellido, correo, puntos_actuales, kilos_totales, etc.
// El frontend mapea: puntos_actuales → puntos, kilos_totales → kilosAcumulados
const mapBackendUserToFrontend = (backendUser: any): User => ({
  id: backendUser.id,
  nombre: backendUser.nombre,
  apellido: backendUser.apellido,
  correo: backendUser.correo,
  rol: backendUser.rol || "cliente",
  email: backendUser.correo, // Alias para compatibilidad
  puntos: Number(backendUser.puntos_actuales) || 0,
  kilosAcumulados: parseFloat(backendUser.kilos_totales) || 0,
  direccion: backendUser.direccion || "",
  telefono: backendUser.telefono || "",
  referencia: backendUser.referencia || "",
  dni: backendUser.dni || "",
  fotoPerfil: backendUser.fotoPerfil || null,
  isAdmin: backendUser.rol === "admin",
  creado_en: backendUser.creado_en || "",
});

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Recuperar sesión del localStorage al montar
    const savedToken = localStorage.getItem("ecotienda_token")
    const savedUser = localStorage.getItem("ecotienda_user")
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  // Cargar usuarios cuando el usuario logueado es admin
  useEffect(() => {
    const loadUsersList = async () => {
      if (user?.rol === "admin" && token) {
        try {
          const response = await apiCall<any[]>(
            "/admin/clientes",
            "GET",
            undefined,
            true // Incluir token de autenticación
          )

          // Mapear todos los usuarios usando la función helper
          const mappedUsers = response.map(mapBackendUserToFrontend)
          setUsers(mappedUsers)
        } catch (error) {
          console.error("[LOAD USERS ERROR]", error)
        }
      }
    }
    
    loadUsersList()
  }, [user?.rol, token])

  const login = async (nombre: string, contraseña: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      const response = await apiCall<LoginResponse>(
        "/auth/login",
        "POST",
        { nombre, contraseña },
        false // No incluir auth para login
      )

      const { token: newToken, usuario } = response
      
      // Mapear usuario del backend al formato del frontend
      const mappedUser = mapBackendUserToFrontend(usuario)
      
      setToken(newToken)
      setUser(mappedUser)
      localStorage.setItem("ecotienda_token", newToken)
      localStorage.setItem("ecotienda_user", JSON.stringify(mappedUser))
      
      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      console.error("[LOGIN ERROR]", errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true)
      const response = await apiCall<RegisterResponse>(
        "/auth/registro",
        "POST",
        data,
        false // No incluir auth para registro
      )

      return { success: true }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido"
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setUsers([])
    localStorage.removeItem("ecotienda_token")
    localStorage.removeItem("ecotienda_user")
  }

  const loadUsers = async () => {
    try {
      // Solo admins pueden cargar usuarios
      if (user?.rol !== "admin") return
      
      const response = await apiCall<any[]>(
        "/admin/clientes",
        "GET",
        undefined,
        true // Incluir token de autenticación
      )

      // Mapear todos los usuarios usando la función helper
      const mappedUsers = response.map(mapBackendUserToFrontend)
      setUsers(mappedUsers)
    } catch (error) {
      console.error("[LOAD USERS ERROR]", error)
    }
  }

  const updateUser = (userId: string, data: Partial<User>) => {
    // Temporal: Placeholder para compatibilidad
    // TODO: Conectar con endpoint del backend cuando esté disponible
    if (user?.id === userId) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("ecotienda_user", JSON.stringify(updatedUser))
    }
  }

  const updateUserPoints = async (userId: string, puntos: number, kilos: number) => {
    try {
      // Llamar al endpoint del backend para agregar puntos
      await apiCall(
        "/admin/clientes/puntos",
        "POST",
        {
          usuario_id: userId,
          puntos: puntos,
          kilos: kilos
        },
        true // Incluir token de autenticación
      )

      // Refrescar la lista de usuarios para que vea los cambios
      if (user?.rol === "admin" && token) {
        const response = await apiCall<any[]>(
          "/admin/clientes",
          "GET",
          undefined,
          true
        )

        // Mapear todos los usuarios usando la función helper
        const mappedUsers = response.map(mapBackendUserToFrontend)
        setUsers(mappedUsers)
      }
    } catch (error) {
      console.error("[UPDATE POINTS ERROR]", error)
      throw error // Propagar el error para que el componente lo maneje
    }
  }

  return (
    <AuthContext.Provider value={{ user, users, token, isLoading, login, register, logout, loadUsers, updateUser, updateUserPoints }}>
      {children}
    </AuthContext.Provider>
  )
}


export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
