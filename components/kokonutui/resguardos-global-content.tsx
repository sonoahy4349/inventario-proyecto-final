"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Eye, FilePlus, Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Resguardo } from "@/lib/types" // Import Resguardo type

// Mock data for resguardos (copied from resguardos-modal for independence)
const MOCK_RESGUARDOS: Resguardo[] = [
  {
    id: "RES001",
    tipo: "Asignación Inicial",
    fechaCreacion: "2023-01-15",
    firmado: true,
    url: "/resguardo-001.pdf",
    itemId: "EST001",
  },
  {
    id: "RES002",
    tipo: "Mantenimiento Preventivo",
    fechaCreacion: "2023-06-20",
    firmado: false,
    url: "",
    itemId: "EST001",
  },
  {
    id: "RES003",
    tipo: "Cambio de Responsable",
    fechaCreacion: "2024-03-10",
    firmado: true,
    url: "/resguardo-003.pdf",
    itemId: "EST001",
  },
  {
    id: "RES004",
    tipo: "Creación Inicial",
    fechaCreacion: "2024-01-01",
    firmado: true,
    url: "/resguardo-lap001.pdf",
    itemId: "EQ003",
  },
  { id: "RES005", tipo: "Cancelación", fechaCreacion: "2024-02-10", firmado: false, url: "", itemId: "EQ003" },
  {
    id: "RES006",
    tipo: "Cambio de Responsable",
    fechaCreacion: "2024-04-05",
    firmado: true,
    url: "/resguardo-lap002.pdf",
    itemId: "EQ008",
  },
  {
    id: "RES007",
    tipo: "Creación Inicial",
    fechaCreacion: "2023-11-20",
    firmado: true,
    url: "/resguardo-imp001.pdf",
    itemId: "EQ004",
  },
]

const TIPOS_RESGUARDO = [
  "Todos",
  "Asignación Inicial",
  "Mantenimiento Preventivo",
  "Creación Inicial",
  "Cancelación",
  "Cambio de Responsable",
]

export default function ResguardosGlobalContent() {
  const [resguardos, setResguardos] = useState<Resguardo[]>(MOCK_RESGUARDOS)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterTipo, setFilterTipo] = useState("Todos")
  const [filterFirmado, setFilterFirmado] = useState("Todos") // "Todos", "Si", "No"
  const { toast } = useToast()

  const filteredResguardos = useMemo(() => {
    let currentResguardos = resguardos

    // Apply search term filter
    if (searchTerm) {
      currentResguardos = currentResguardos.filter((resguardo) =>
        Object.values(resguardo).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply type filter
    if (filterTipo !== "Todos") {
      currentResguardos = currentResguardos.filter((resguardo) => resguardo.tipo === filterTipo)
    }

    // Apply signed status filter
    if (filterFirmado === "Si") {
      currentResguardos = currentResguardos.filter((resguardo) => resguardo.firmado)
    } else if (filterFirmado === "No") {
      currentResguardos = currentResguardos.filter((resguardo) => !resguardo.firmado)
    }

    return currentResguardos
  }, [resguardos, searchTerm, filterTipo, filterFirmado])

  const handleDownloadTxt = (movimiento: Resguardo) => {
    const content = `
Detalles del Resguardo ID: ${movimiento.id}

Tipo de Resguardo: ${movimiento.tipo}
Fecha de Creación: ${movimiento.fechaCreacion}
Firmado: ${movimiento.firmado ? "Sí" : "No"}
ID del Item Asociado: ${movimiento.itemId}
URL (si aplica): ${movimiento.url || "N/A"}

---
Generado por el Sistema de Inventario de TI del Hospital.
Fecha de descarga: ${new Date().toLocaleString()}
    `.trim()

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `resguardo_${movimiento.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url) // Clean up the URL object
    toast({
      title: "Éxito",
      description: `Detalles del resguardo ${movimiento.id} descargados.`,
      variant: "success",
    })
  }

  const handleVisualize = (url: string) => {
    if (url) {
      console.log(`Visualizando resguardo de: ${url}`)
      window.open(url, "_blank")
      toast({
        title: "Información",
        description: `Abriendo resguardo para visualización: ${url}`,
        variant: "default",
      })
    } else {
      toast({
        title: "Error",
        description: "No hay URL para visualizar este resguardo.",
        variant: "destructive",
      })
    }
  }

  const handleGenerate = () => {
    toast({
      title: "Información",
      description:
        "Simulando generación de nuevo resguardo. (Desde la vista global, necesitarías seleccionar un item primero)",
      variant: "default",
    })
  }

  const handleUpload = () => {
    toast({
      title: "Información",
      description: "Simulando subida de resguardo. (Desde la vista global)",
      variant: "default",
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión Global de Resguardos</h1>
      <p className="text-muted-foreground">Consulta y administra todos los documentos de resguardo del sistema</p>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">Lista de Resguardos</CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-[200px]">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar resguardo..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select onValueChange={setFilterTipo} value={filterTipo}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_RESGUARDO.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setFilterFirmado} value={filterFirmado}>
              <SelectTrigger className="w-full sm:w-[120px]">
                <SelectValue placeholder="Firmado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                <SelectItem value="Si">Sí</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleGenerate} variant="outline" className="w-full sm:w-auto bg-transparent">
              <FilePlus className="mr-2 h-4 w-4" />
              Generar
            </Button>
            <Button onClick={handleUpload} variant="outline" className="w-full sm:w-auto bg-transparent">
              <Upload className="mr-2 h-4 w-4" />
              Subir
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Resguardo</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Fecha Creación</TableHead>
                  <TableHead>ID Item</TableHead>
                  <TableHead className="text-center">Firmado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResguardos.map((resguardo) => (
                  <TableRow key={resguardo.id}>
                    <TableCell className="font-medium">{resguardo.id}</TableCell>
                    <TableCell>{resguardo.tipo}</TableCell>
                    <TableCell>{resguardo.fechaCreacion}</TableCell>
                    <TableCell>{resguardo.itemId}</TableCell>
                    <TableCell className="text-center">
                      {resguardo.firmado ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" title="Firmado" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mx-auto" title="No Firmado" />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownloadTxt(resguardo)}
                          aria-label={`Descargar TXT del resguardo ${resguardo.id}`}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleVisualize(resguardo.url || "")}
                          disabled={!resguardo.url}
                          aria-label={`Visualizar resguardo ${resguardo.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredResguardos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No se encontraron resguardos.
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
