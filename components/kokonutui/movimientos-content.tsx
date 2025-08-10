"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download } from "lucide-react"

interface Movimiento {
  id: string
  usuario: string
  equipoEstacion: string
  fecha: string
  tipoMovimiento: string
  detalles: string // Detailed information for the TXT file
}

const initialMovimientos: Movimiento[] = [
  {
    id: "MOV001",
    usuario: "Juan Pérez López",
    equipoEstacion: "CPU EQ001",
    fecha: "2024-07-20 10:30",
    tipoMovimiento: "Equipo Agregado",
    detalles: "Se agregó un nuevo CPU Dell OptiPlex 7010 (SN-CPU-001) a la estación Urgencias-01.",
  },
  {
    id: "MOV002",
    usuario: "María González",
    equipoEstacion: "Estación EST001",
    fecha: "2024-07-20 11:15",
    tipoMovimiento: "Estación Editada",
    detalles: "Se actualizó la estación EST001. Se añadió el accesorio 'Webcam'.",
  },
  {
    id: "MOV003",
    usuario: "Carlos Ruiz",
    equipoEstacion: "Laptop EQ003",
    fecha: "2024-07-21 09:00",
    tipoMovimiento: "Resguardo Generado",
    detalles: "Se generó el resguardo RES004 para la Laptop Lenovo ThinkPad X1 Carbon (EQ003).",
  },
  {
    id: "MOV004",
    usuario: "Juan Pérez López",
    equipoEstacion: "Impresora EQ004",
    fecha: "2024-07-21 14:45",
    tipoMovimiento: "Equipo de Baja",
    detalles: "La impresora Epson EcoTank L3150 (EQ004) fue marcada como 'De Baja' por obsolescencia.",
  },
  {
    id: "MOV005",
    usuario: "María González",
    equipoEstacion: "Ubicación UB002",
    fecha: "2024-07-22 08:30",
    tipoMovimiento: "Ubicación Editada",
    detalles: "Se actualizó la ubicación UB002: 'Área de Análisis Clínicos' en el 2do Piso del Edificio Principal.",
  },
]

export default function MovimientosContent() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>(initialMovimientos)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMovimientos = useMemo(() => {
    return movimientos.filter((movimiento) =>
      Object.values(movimiento).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [movimientos, searchTerm])

  const handleDownloadTxt = (movimiento: Movimiento) => {
    const content = `
Detalles del Movimiento ID: ${movimiento.id}

Usuario: ${movimiento.usuario}
Equipo/Estación Afectada: ${movimiento.equipoEstacion}
Fecha y Hora: ${movimiento.fecha}
Tipo de Movimiento: ${movimiento.tipoMovimiento}

Descripción:
${movimiento.detalles}

---
Generado por el Sistema de Inventario de TI del Hospital.
Fecha de descarga: ${new Date().toLocaleString()}
    `.trim()

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `movimiento_${movimiento.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url) // Clean up the URL object
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Registro de Movimientos</h1>
      <p className="text-muted-foreground">Historial de todas las acciones realizadas en el sistema</p>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">Lista de Movimientos</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar movimiento..."
              className="pl-8 w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Equipo/Estación</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo de Movimiento</TableHead>
                  <TableHead className="text-center">Detalles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovimientos.map((movimiento) => (
                  <TableRow key={movimiento.id}>
                    <TableCell className="font-medium">{movimiento.id}</TableCell>
                    {/* */}
                    <TableCell>{movimiento.usuario}</TableCell>
                    {/* */}
                    <TableCell>{movimiento.equipoEstacion}</TableCell>
                    {/* */}
                    <TableCell>{movimiento.fecha}</TableCell>
                    {/* */}
                    <TableCell>{movimiento.tipoMovimiento}</TableCell>
                    {/* */}
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadTxt(movimiento)}
                        aria-label={`Descargar detalles del movimiento ${movimiento.id}`}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Descargar TXT
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMovimientos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No se encontraron movimientos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
