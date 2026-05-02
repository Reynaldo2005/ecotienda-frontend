"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Recycle, Star, Scale, Loader2, MapPin, Phone } from "lucide-react"

interface Material {
  id: number
  nombre: string
  descripcion: string
  puntos_por_kilo: number
  soles_por_kilo: number
  unidades_referencia: string | null
}

const imagenesMateriales: Record<string, string> = {
  "Botas": "/materiales/Botas.jpeg",
  "Cartones": "/materiales/carton.jpeg",
  "Chatarra": "/materiales/Chatarra.jpeg", 
  "Fierros": "/materiales/Fierro.jpg",
  "Latas de Atún": "/materiales/Latas-atun.jpg",
  "Latas de cerveza (aluminio)": "/materiales/latas-cerveza.jpeg",
  "Latas de leche grande": "/materiales/Latas-leche.jpg",
  "Latas de leche pequeña": "/materiales/Latas-leche-pequeña.jpeg",
  "Plástico film": "/materiales/plastico-film.jpeg",
  "Plásticos (Botellas)": "/materiales/botellas-plastico.jpeg",
  "Plásticos duros": "/materiales/Plastico-duros.jpg",
  "PVC (tubos)": "/materiales/Tubos.jpg",
  "Tapas de botella de gaseosa": "/materiales/Tapas-botellas.jpg"
};

export function InicioTab() {
  const [materiales, setMateriales] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    cargarMateriales()
  }, [])

  const cargarMateriales = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/materiales`)
      const data = await response.json()
      setMateriales(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error al cargar materiales")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">

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
              
      {/* Info Cards */}
      <div className="grid gap-4">

        {/* "¿Cómo ganar puntos?" ahora va PRIMERO */}
        <Card className="overflow-hidden border-0 shadow-md">
          {/* Header con fondo verde */}
          <div className="bg-primary px-6 py-5 flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <Star className="h-6 w-6 text-white fill-white" />
            </div>
            <h2 className="text-white text-xl font-bold">¿Cómo ganar puntos?</h2>
            {/* Jirafa */}
            <div className="ml-3" style={{ animation: "flotar 3s ease-in-out infinite" }}>
              <style>{`@keyframes flotar { 0%,100%{transform:translateY(0px)} 50%{transform:translateY(-6px)} }`}</style>
              <svg width="45" height="55" viewBox="0 0 45 55">
                {/* Cuello largo */}
                <rect x="18" y="8" width="9" height="28" rx="4" fill="#F4A836"/>
                {/* Manchas del cuello */}
                <ellipse cx="20" cy="14" rx="3" ry="2" fill="#C17A1A" opacity="0.6"/>
                <ellipse cx="24" cy="22" rx="2.5" ry="2" fill="#C17A1A" opacity="0.6"/>
                <ellipse cx="19" cy="30" rx="2" ry="1.5" fill="#C17A1A" opacity="0.6"/>
                {/* Cuerpo */}
                <ellipse cx="22" cy="42" rx="12" ry="9" fill="#F4A836"/>
                {/* Manchas cuerpo */}
                <ellipse cx="17" cy="40" rx="3" ry="2.5" fill="#C17A1A" opacity="0.6"/>
                <ellipse cx="26" cy="44" rx="3" ry="2" fill="#C17A1A" opacity="0.6"/>
                {/* Cabeza */}
                <ellipse cx="22" cy="7" rx="8" ry="6" fill="#F4A836"/>
                {/* Orejas */}
                <ellipse cx="14" cy="6" rx="3" ry="2" fill="#F4A836" transform="rotate(-20 14 6)"/>
                <ellipse cx="30" cy="6" rx="3" ry="2" fill="#F4A836" transform="rotate(20 30 6)"/>
                {/* Cuernitos */}
                <rect x="17" y="1" width="3" height="5" rx="1.5" fill="#C17A1A"/>
                <circle cx="18.5" cy="1" r="1.5" fill="#8B5A00"/>
                <rect x="25" y="1" width="3" height="5" rx="1.5" fill="#C17A1A"/>
                <circle cx="26.5" cy="1" r="1.5" fill="#8B5A00"/>
                {/* Ojos */}
                <circle cx="18" cy="6" r="2" fill="white"/>
                <circle cx="26" cy="6" r="2" fill="white"/>
                <circle cx="18.5" cy="6.5" r="1" fill="#1a1a1a"/>
                <circle cx="26.5" cy="6.5" r="1" fill="#1a1a1a"/>
                <circle cx="18.8" cy="6.2" r="0.4" fill="white"/>
                <circle cx="26.8" cy="6.2" r="0.4" fill="white"/>
                {/* Nariz */}
                <ellipse cx="22" cy="10" rx="3" ry="1.5" fill="#E08A20"/>
                {/* Patitas */}
                <rect x="12" y="49" width="4" height="6" rx="2" fill="#F4A836"/>
                <rect x="18" y="50" width="4" height="6" rx="2" fill="#F4A836"/>
                <rect x="24" y="50" width="4" height="6" rx="2" fill="#F4A836"/>
                <rect x="30" y="49" width="4" height="6" rx="2" fill="#F4A836"/>
              </svg>
            </div>
          </div>

          <CardContent className="p-0">
            {/* Pasos numerados */}
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
              
              <div className="flex flex-col items-center text-center gap-3 p-6">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">1</span>
                </div>
                <p className="font-semibold text-foreground">Junta tus materiales</p>
                <p className="text-sm text-muted-foreground">
                  Reúne los residuos reciclables que tengas en casa según la lista de materiales aceptados.
                </p>
              </div>

              <div className="flex flex-col items-center text-center gap-3 p-6">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">2</span>
                </div>
                <p className="font-semibold text-foreground">Llévalo al centro</p>
                <p className="text-sm text-muted-foreground">
                  Acércate al centro de reciclaje de la Municipalidad de José Crespo y Castillo en Aucayacu.
                </p>
              </div>

              <div className="flex flex-col items-center text-center gap-3 p-6">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-primary font-bold text-lg">3</span>
                </div>
                <p className="font-semibold text-foreground">¡Gana tus puntos!</p>
                <p className="text-sm text-muted-foreground">
                  La municipalidad de Aucayacu pesará tus materiales y te asignará los puntos correspondientes al instante.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* "¿Qué debo reciclar?" ahora va SEGUNDO */}
       <Card className="border border-green-200 overflow-hidden">

      {/* Header igual al de arriba */}
      <div className="bg-green-700 px-4 py-3 flex items-center gap-2">
        <Recycle className="h-5 w-5 text-white" />
        <h3 className="text-white font-semibold text-lg">
          ¿Qué debo reciclar?
        </h3>
        {/* Perrito */}
          <div className="ml-3" style={{ animation: "flotar 2.5s ease-in-out infinite" }}>
            <svg width="45" height="45" viewBox="0 0 45 45">
              {/* Cuerpo */}
              <ellipse cx="22" cy="32" rx="13" ry="10" fill="#C8A882"/>
              {/* Cabeza */}
              <circle cx="22" cy="16" r="12" fill="#C8A882"/>
              {/* Orejas caídas */}
              <ellipse cx="10" cy="18" rx="5" ry="8" fill="#A0785A" transform="rotate(-10 10 18)"/>
              <ellipse cx="34" cy="18" rx="5" ry="8" fill="#A0785A" transform="rotate(10 34 18)"/>
              {/* Cara */}
              <ellipse cx="22" cy="19" rx="8" ry="6" fill="#E8C9A0"/>
              {/* Ojos */}
              <circle cx="17" cy="13" r="2.5" fill="white"/>
              <circle cx="27" cy="13" r="2.5" fill="white"/>
              <circle cx="17.5" cy="13.5" r="1.3" fill="#1a1a1a"/>
              <circle cx="27.5" cy="13.5" r="1.3" fill="#1a1a1a"/>
              <circle cx="17.8" cy="13.2" r="0.5" fill="white"/>
              <circle cx="27.8" cy="13.2" r="0.5" fill="white"/>
              {/* Nariz */}
              <ellipse cx="22" cy="18" rx="3" ry="2" fill="#7A4A2A"/>
              {/* Boca */}
              <path d="M 19 21 Q 22 24 25 21" stroke="#7A4A2A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
              {/* Lengua */}
              <ellipse cx="22" cy="24" rx="2.5" ry="2" fill="#E87070"/>
              {/* Patitas */}
              <ellipse cx="12" cy="41" rx="5" ry="3.5" fill="#C8A882"/>
              <ellipse cx="32" cy="41" rx="5" ry="3.5" fill="#C8A882"/>
              {/* Colita */}
              <path d="M 35 28 Q 42 22 40 18" stroke="#C8A882" strokeWidth="4" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
      </div>
      <CardContent className="bg-green-50 p-5">
        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">

          {/* Frase */}
          <p className="italic text-green-800 font-medium">
            “Reciclar no es solo cuidar el planeta, es cuidar el futuro donde tú y los tuyos vivirán.” 🌱
          </p>

          {/* Texto */}
          <p>
            En el centro de reciclaje de la Municipalidad de Aucayacu
            aceptamos una variedad de materiales reciclables.
          </p>

          {/* Caja tipo "bloque informativo" como el de arriba */}
          <div className="bg-white border border-green-200 rounded-lg p-4">
            <p className="font-semibold text-green-800">
              Materiales aceptados:
            </p>
            <p className="text-sm text-gray-600">
              Estos son los materiales y los puntos que puedes ganar, si comienzas a reciclar.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

      {/* Materials Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Materiales Aceptados
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-lg border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Material</TableHead>
                    <TableHead className="text-center w-15">Imagen</TableHead>
                    <TableHead className="text-right">Puntos/kg</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {materiales.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell className="font-medium">
                      {material.nombre}
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <img
                          src={imagenesMateriales[material.nombre] ?? "/materiales/default.jpg"}
                          alt={material.nombre}
                          className="h-24 w-24 min-w-[96px] object-cover rounded-xl border border-green-200 shadow-sm"
                        />
                      </TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-sm font-semibold text-primary">
                            <Star className="h-3 w-3" />
                            {material.puntos_por_kilo}
                          </span>
                        </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}