"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

interface LoginFormProps {
  onBack: () => void
  onRegister: () => void
}

export function LoginForm({ onBack, onRegister }: LoginFormProps) {
  const { login } = useAuth()
  const [nombre, setNombre] = useState("")
  const [contraseña, setContraseña] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await login(nombre, contraseña)
    
    if (result.success) {
      toast.success("Bienvenido a EcoTienda")
    } else {
      toast.error(result.error || "Error al iniciar sesion")
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </button>

        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
              <Leaf className="h-9 w-9 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-[family-name:var(--font-heading)]">Iniciar Sesion</CardTitle>
            <CardDescription>Ingresa tus datos para acceder a EcoTienda</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de Usuario</Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre de usuario"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contrasena</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contrasena"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-muted-foreground">
              ¿No tienes cuenta?{" "}
              <button
                onClick={onRegister}
                className="font-medium text-primary hover:underline"
              >
                Registrate aqui
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
