"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Recycle, Gift, Users, Phone, Mail, MapPin, Play, TreePine, Sprout } from "lucide-react"

interface LandingPageProps {
  onLogin: () => void
  onRegister: () => void
}

export function LandingPage({ onLogin, onRegister }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/30">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <img 
              src="/ecotienda-logo(2).jpg" 
              alt="EcoTienda Logo" 
              width={44} 
              height={44} 
              className="rounded-full"
            />
            <span className="text-xl font-bold text-primary font-[family-name:var(--font-heading)]">EcoTienda</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onLogin} className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Iniciar Sesion
            </Button>
            <Button onClick={onRegister} className="bg-primary hover:bg-primary/90">
              Registrarse
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative overflow-hidden py-20 md:py-32"
        style={{
          backgroundImage: "url('/aucayacu(5).jpg')", 
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        >
          <div className="absolute inset-0 bg-primary/35" />
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <TreePine className="h-24 w-24 text-primary" />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20">
          <Sprout className="h-20 w-20 text-primary" />
        </div>
        <div className="absolute top-40 right-20 opacity-10">
          <Leaf className="h-16 w-16 text-primary rotate-45" />
        </div>
        
        <div className="absolute top-6 left-6">
        <Image
          src="/Logo de ambiental.jpeg"
          alt="Logo Ambiental"
          width={80}
          height={80}
          className="rounded-full shadow-md border-2 border-white/50"
        />
      </div>
      <div className="absolute top-6 right-6">
    <Image
      src="/Logo de la municipalidad.jpeg"
      alt="Logo Municipalidad"
      width={80}
      height={80}
      className="rounded-full shadow-md border-2 border-white/50"
    />
  </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center">
            <img 
              src="/ecotienda-logo.jpg" 
              alt="EcoTienda Logo" 
              style={{ width: "150px", height: "150px" }}
              className="rounded-full object-cover"
            />
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl font-[family-name:var(--font-heading)] text-balance ">
              Recicla, Acumula y Gana
            </h1>
            <p className="mb-8 max-w-2xl text-lg text-white/90 md:text-xl text-pretty drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Unete a EcoTienda, la app municipal de reciclaje de la ciudad de Aucayacu. Contactanos o lleva tus residuos al centro de reciclaje, acumula puntos y canjealos por productos y regalos. 
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" onClick={onRegister} className="gap-2">
                <Gift className="h-5 w-5" />
                Comenzar Ahora
              </Button>
              <Button size="lg" variant="outline" onClick={onLogin}>
                Ya tengo cuenta
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Que hacemos Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex justify-center items-center">
            <div className="relative inline-block">
              
              {/* Caja verde con el título */}
              <div className="bg-primary rounded-2xl px-8 py-4 shadow-lg relative z-10">
                <h2 className="text-3xl font-bold text-white md:text-4xl font-[family-name:var(--font-heading)]">
                  ¿Que es EcoTienda?
                </h2>
              </div>

              {/* Monito asomándose por la derecha */}
              <div 
                className="absolute -right-8 -top-6 z-0"
                style={{ animation: "flotar 3s ease-in-out infinite" }}
              >
                <svg width="60" height="70" viewBox="0 0 60 70">
                  {/* Cuerpo del monito */}
                  <ellipse cx="30" cy="45" rx="14" ry="16" fill="#8B4513" />
                  {/* Cabeza */}
                  <circle cx="30" cy="25" r="16" fill="#8B4513" />
                  {/* Cara */}
                  <ellipse cx="30" cy="28" rx="10" ry="8" fill="#D2691E" />
                  {/* Ojos */}
                  <circle cx="25" cy="23" r="3" fill="white" />
                  <circle cx="35" cy="23" r="3" fill="white" />
                  <circle cx="25.5" cy="23.5" r="1.5" fill="#1a1a1a" />
                  <circle cx="35.5" cy="23.5" r="1.5" fill="#1a1a1a" />
                  {/* Brillito en los ojos */}
                  <circle cx="26" cy="23" r="0.5" fill="white" />
                  <circle cx="36" cy="23" r="0.5" fill="white" />
                  {/* Nariz */}
                  <ellipse cx="30" cy="29" rx="3" ry="2" fill="#5C2A00" />
                  {/* Sonrisa */}
                  <path d="M 25 33 Q 30 37 35 33" stroke="#5C2A00" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  {/* Orejas */}
                  <circle cx="14" cy="22" r="6" fill="#8B4513" />
                  <circle cx="14" cy="22" r="3.5" fill="#D2691E" />
                  <circle cx="46" cy="22" r="6" fill="#8B4513" />
                  <circle cx="46" cy="22" r="3.5" fill="#D2691E" />
                  {/* Manos asomándose en el borde */}
                  <ellipse cx="18" cy="52" rx="5" ry="4" fill="#8B4513" />
                  <ellipse cx="42" cy="52" rx="5" ry="4" fill="#8B4513" />
                </svg>
              </div>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {/*Trajeta de reciclaje*/}
            <Card 
              className="border-primary/10 overflow-hidden relative"
              style={{
                backgroundImage: "url('/reciclaje.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-white/70" /> {/* overlay blanco */}
                <CardContent className="flex flex-col items-center p-6 text-center relative z-10">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Recycle className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Recicla</h3>
                  <p className="text-muted-foreground">
                    Lleva tus materiales reciclados a la planta de valorización (ubicado en la carretera Fernando Belaunde Terri, antes de llegar a Yacusisa, frente al vivero Agroforestal de la cruz SAC) o también ubicanos en la municipalidad distrital (Ubicado en el frontis de la plaza de armas) 
                  </p>
                </CardContent>
              </Card>
            {/*Trajeta de Acumular puntos*/}
            <Card 
              className="border-primary/15 overflow-hidden relative"
              style={{
                backgroundImage: "url('/puntos-acumulados.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 bg-white/65" />
                <CardContent className="flex flex-col items-center p-6 text-center relative z-10">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/20">
                    <Gift className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">Acumula Puntos</h3>
                  <p className="text-muted-foreground">
                    Por cada kilogramo de material reciclado gana puntos y canjealos
                  </p>
                </CardContent>
              </Card>
              {/*Trajeta de canjear puntos*/}
            <Card 
              className="border-primary/10 overflow-hidden relative"
              style={{
                backgroundImage: "url('/premios.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
            <div className="absolute inset-0 bg-white/65" />
              <CardContent className="flex flex-col items-center p-6 text-center relative z-10">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">Canjea Premios</h3>
                <p className="text-muted-foreground">
                  Usa tus puntos para obtener productos y regalos de la EcoTineda.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="bg-primary/5 py-16 md:py-24">
      
        <div className="container mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-6 items-center">

            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl font-[family-name:var(--font-heading)]">
                Nuestra Vision
              </h2>
              <p className="text-lg text-muted-foreground text-pretty">
                Hagamos un Aucayacu más limpio y sostenible. EcoTienda es una iniciativa municipal que busca fomentar el reciclaje en nuestra comunidad, recompensando a los ciudadanos por sus buenas practicas ambientales. Juntos podemos reducir la contaminacion, preservar nuestros recursos naturales y construir un futuro mejor para las proximas generaciones. 
              </p>
              <p>"Cada residuo que reciclas es un paso más hacia un Aucayacu más limpio y crear una cultura ambiental más conciente” 🌱</p>
            </div>
            
            <div className="aspect-video overflow-hidden rounded-xl border">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/watch?v=AKyRXCZPa3E"
                title="Video Aucayacu"
                allowFullScreen
              />
            </div>
              <div className="flex flex-wrap justify-center gap-6">
            </div>
          </div>
        </div>
      </section>

      {/* Tutorial Video Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-center items-center">
            <div className="relative inline-block">
              {/* Caja verde con el título */}
              <div className="bg-primary rounded-2xl px-8 py-4 shadow-lg relative z-10">
                <h2 className="text-3xl font-bold text-white md:text-4xl font-[family-name:var(--font-heading)]">
                  ¿Como funciona?
                </h2>
              </div>

              {/* Elefante asomándose por la derecha */}
              <div
                className="absolute -right-14 -top-0 z-20"
                style={{ animation: "flotar 3s ease-in-out infinite" }}
              >
                <svg width="70" height="80" viewBox="0 0 70 80">
                  <ellipse cx="35" cy="55" rx="18" ry="16" fill="#7a8fa6" />
                  <circle cx="35" cy="30" r="20" fill="#7a8fa6" />
                  <ellipse cx="35" cy="34" rx="13" ry="10" fill="#a0b4c8" />
                  <circle cx="28" cy="26" r="3.5" fill="white" />
                  <circle cx="42" cy="26" r="3.5" fill="white" />
                  <circle cx="28.5" cy="26.5" r="1.8" fill="#1a1a1a" />
                  <circle cx="42.5" cy="26.5" r="1.8" fill="#1a1a1a" />
                  <circle cx="29" cy="26" r="0.6" fill="white" />
                  <circle cx="43" cy="26" r="0.6" fill="white" />
                  <ellipse cx="14" cy="28" rx="10" ry="13" fill="#6b7f94" />
                  <ellipse cx="14" cy="28" rx="6" ry="8" fill="#a0b4c8" />
                  <ellipse cx="56" cy="28" rx="10" ry="13" fill="#6b7f94" />
                  <ellipse cx="56" cy="28" rx="6" ry="8" fill="#a0b4c8" />
                  <path d="M 30 40 Q 22 50 28 58" stroke="#7a8fa6" strokeWidth="7" fill="none" strokeLinecap="round"/>
                  <ellipse cx="30" cy="43" rx="3" ry="1.5" fill="white" transform="rotate(-20 30 43)" />
                  <path d="M 28 38 Q 35 43 42 38" stroke="#5a6f82" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  <ellipse cx="20" cy="64" rx="6" ry="4" fill="#7a8fa6" />
                  <ellipse cx="50" cy="64" rx="6" ry="4" fill="#7a8fa6" />
                </svg>
              </div>
            </div>
          </div>
          <p className="mb-8 text-center text-muted-foreground">
            Mira este video tutorial para aprender a usar EcoTienda
          </p>
          <div className="mx-auto max-w-4xl">
            <div className="aspect-video overflow-hidden rounded-xl border bg-muted">
              {/* Placeholder for video - user will add their own */}
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/watch?v=7hdJ1sEjZjQ"
                title="Video Tutorial EcoTienda"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-primary justify-center md:py-24">
        <div className="container justify-center px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-primary-foreground md:text-4xl font-[family-name:var(--font-heading)]">
            Contactanos
          </h2>
          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <Card className="border-0 bg-primary-foreground/10 backdrop-blur">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Phone className="mb-4 h-10 w-10 text-primary-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-primary-foreground">Telefono</h3>
                <p className="text-primary-foreground/80">(+51) 929 420 327</p>
                <p className="text-primary-foreground/80">(+51) 962 672 038</p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-primary-foreground/10 backdrop-blur">
            <CardContent className="flex flex-col items-center p-6 text-center">
              <MapPin className="mb-4 h-10 w-10 text-primary-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-primary-foreground">Ubicanos</h3>
              <p className="text-primary-foreground/80">
                La carretera Fernando Belaunde Terry, antes de llegar a Yacusisa, frente al vivero Agroforestal de la Cruz SAC.
              </p>
            </CardContent>
          </Card>
            <Card className="border-0 bg-primary-foreground/10 backdrop-blur">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <MapPin className="mb-4 h-10 w-10 text-primary-foreground" />
                <h3 className="mb-2 text-lg font-semibold text-primary-foreground">Dirección</h3>
                <p className="text-primary-foreground/80">Centro de Reciclaje Municipal</p>
                <p className="text-primary-foreground/80">Municipalidad, frente a la plaza de armas, jr. Aucayacu</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gradient-to-r from-primary/5 via-card to-primary/5 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <Image 
              src="/ecotienda-logo.jpg" 
              alt="EcoTienda Logo" 
              width={36} 
              height={36} 
              className="rounded-full"
            />
            <span className="text-lg font-bold text-primary font-[family-name:var(--font-heading)]">EcoTienda</span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Juntos por un Aucayacu más verde y sostenible
          </p>
          <p className="text-xs text-muted-foreground">
            © 2026 EcoTienda - Municipalidad de Aucayacu. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
