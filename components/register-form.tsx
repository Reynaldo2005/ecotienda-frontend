"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Leaf, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

interface RegisterFormProps {
  onBack: () => void
  onLogin: () => void
}

export function RegisterForm({ onBack, onLogin }: RegisterFormProps) {
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    direccion: "",
    telefono: "",
    contraseña: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.contraseña !== formData.confirmPassword) {
      toast.error("Las contrasenas no coinciden")
      return
    }

    if (formData.contraseña.length < 6) {
      toast.error("La contrasena debe tener al menos 6 caracteres")
      return
    }

    setIsLoading(true)

    const result = await register({
      nombre: formData.nombre,
      apellido: formData.apellido,
      correo: formData.correo,
      direccion: formData.direccion,
      telefono: formData.telefono,
      contraseña: formData.contraseña,
    })

    if (result.success) {
      toast.success("Registro exitoso. Bienvenido a EcoTienda!")
      onLogin()
    } else {
      toast.error(result.error || "Error al registrarse")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/10 to-background p-4 py-8">
      <div className="w-full max-w-lg">
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
            <CardTitle className="text-2xl font-[family-name:var(--font-heading)]">Crear Cuenta</CardTitle>
            <CardDescription>Unete a EcoTienda y comienza a reciclar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input
                    id="apellido"
                    name="apellido"
                    placeholder="Tu apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="correo">Correo Electronico</Label>
                <Input
                  id="correo"
                  name="correo"
                  type="email"
                  placeholder="tu@correo.com"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección / Junta vecinal o asociación de vivienda</Label>
                <Input
                  id="direccion"
                  name="direccion"
                  placeholder="Tu direccion completa"
                  value={formData.direccion}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Telefono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    placeholder="Tu telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contraseña">Contrasena</Label>
                <div className="relative">
                  <Input
                    id="contraseña"
                    name="contraseña"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimo 6 caracteres"
                    value={formData.contraseña}
                    onChange={handleChange}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contrasena</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repite tu contrasena"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Crear Cuenta"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              ¿Ya tienes cuenta?{" "}
              <button
                onClick={onLogin}
                className="font-medium text-primary hover:underline"
              >
                Inicia sesion
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
