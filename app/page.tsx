"use client"

import { useState } from "react"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { StoreProvider } from "@/lib/store-context"
import { LandingPage } from "@/components/landing-page"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { UserDashboard } from "@/components/user-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Spinner } from "@/components/ui/spinner"

function AppContent() {
  const { user, isLoading } = useAuth()
  const [view, setView] = useState<"landing" | "login" | "register">("landing")

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-muted-foreground">Cargando EcoTienda...</p>
        </div>
      </div>
    )
  }

  if (user) {
    if (user.isAdmin) {
      return <AdminDashboard />
    }
    return <UserDashboard />
  }

  if (view === "login") {
    return <LoginForm onBack={() => setView("landing")} onRegister={() => setView("register")} />
  }

  if (view === "register") {
    return <RegisterForm onBack={() => setView("landing")} onLogin={() => setView("login")} />
  }

  return (
    <LandingPage
      onLogin={() => setView("login")}
      onRegister={() => setView("register")}
    />
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </AuthProvider>
  )
}
