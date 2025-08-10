"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Upload, Eye, FilePlus, CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Estacion, Equipo, Resguardo } from "@/lib/types"
import { generateResguardoHtml } from "@/lib/resguardo-html-generator"

interface ResguardosModalProps {
  isOpen: boolean
  onClose: () => void
  selectedItemData: Estacion | Equipo | null
}

// Mock data for resguardos, now including itemId
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

const TIPOS_RESGUARDO_GENERACION = [
  "Asignación Inicial",
  "Mantenimiento Preventivo",
  "Cambio de Responsable",
  "Creación Inicial",
  "Cancelación",
]

export default function ResguardosModal({ isOpen, onClose, selectedItemData }: ResguardosModalProps) {
  const { toast } = useToast()
  const [selectedResguardoType, setSelectedResguardoType] = useState(TIPOS_RESGUARDO_GENERACION[0])

  // Filter resguardos based on the passed itemId
  const filteredResguardos = MOCK_RESGUARDOS.filter((resguardo) => resguardo.itemId === selectedItemData?.id)

  const handleDownload = (url: string) => {
    if (url) {
      console.log(`Descargando resguardo de: ${url}`)
      toast({
        title: "Información",
        description: `Simulando descarga de: ${url}`,
        variant: "default",
      })
    } else {
      toast({
        title: "Error",
        description: "No hay URL de descarga disponible para este resguardo.",
        variant: "destructive",
      })
    }
  }

  const handleGenerate = async () => {
    if (!selectedItemData) {
      toast({
        title: "Error",
        description: "No hay datos de item seleccionados para generar el resguardo.",
        variant: "destructive",
      })
      return
    }

    try {
      const fileName = `resguardo_${selectedItemData.display_id}_${selectedResguardoType.replace(/\s/g, "_")}.pdf`

      // Generate HTML content
      const htmlContent = generateResguardoHtml(selectedItemData, selectedResguardoType)

      // Create a new window for printing/PDF generation
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(htmlContent)
        printWindow.document.close()

        // Wait for content to load, then trigger print dialog
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print()
            printWindow.close()
          }, 500)
        }

        toast({
          title: "Éxito",
          description: `Resguardo de "${selectedResguardoType}" para ${selectedItemData.display_id} generado. Use la opción "Guardar como PDF" en el diálogo de impresión.`,
          variant: "success",
        })
      } else {
        // Fallback: download as HTML if popup is blocked
        const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = fileName.replace(".pdf", ".html")
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast({
          title: "Información",
          description: `Se descargó como HTML. Abra el archivo y use "Imprimir > Guardar como PDF" para obtener el PDF.`,
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error al generar resguardo:", error)
      toast({
        title: "Error",
        description: "Hubo un problema al generar el resguardo. Consulta la consola para más detalles.",
        variant: "destructive",
      })
    }
  }

  const handleUpload = () => {
    console.log(`Subiendo resguardo para item: ${selectedItemData?.id}`)
    toast({
      title: "Información",
      description: `Simulando subida de resguardo para item ${selectedItemData?.id}`,
      variant: "default",
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Resguardos de {selectedItemData?.id || "Item Seleccionado"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col sm:flex-row justify-end gap-2 mb-4">
            <Select onValueChange={setSelectedResguardoType} value={selectedResguardoType}>
              <SelectTrigger className="w-full sm:w-[220px]">
                <SelectValue placeholder="Tipo de Resguardo" />
              </SelectTrigger>
              <SelectContent>
                {TIPOS_RESGUARDO_GENERACION.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleGenerate} variant="outline" disabled={!selectedItemData}>
              <FilePlus className="mr-2 h-4 w-4" />
              Generar PDF
            </Button>
            <Button onClick={handleUpload} variant="outline" disabled={!selectedItemData}>
              <Upload className="mr-2 h-4 w-4" />
              Subir Resguardo
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Resguardo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha Creación</TableHead>
                <TableHead className="text-center">Firmado</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResguardos.length > 0 ? (
                filteredResguardos.map((resguardo) => (
                  <TableRow key={resguardo.id}>
                    <TableCell className="font-medium">{resguardo.id}</TableCell>
                    <TableCell>{resguardo.tipo}</TableCell>
                    <TableCell>{resguardo.fechaCreacion}</TableCell>
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
                          onClick={() => handleDownload(resguardo.url || "")}
                          disabled={!resguardo.url}
                          aria-label={`Descargar resguardo ${resguardo.id}`}
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No hay resguardos para este item.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
