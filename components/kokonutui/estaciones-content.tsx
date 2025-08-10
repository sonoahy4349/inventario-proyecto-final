"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2, Search, FolderOpen } from "lucide-react"
import AddEstacionModal from "./add-estacion-modal"
import ResguardosModal from "./resguardos-modal"
import { useToast } from "@/components/ui/use-toast"
import type { Estacion } from "@/lib/types" // Import Estacion type

// Mock data for available CPUs and Monitors (should come from Equipos data)
const MOCK_AVAILABLE_CPUS = [
  { id: "EQ001", marca: "Dell", modelo: "OptiPlex 7010" },
  { id: "EQ005", marca: "HP", modelo: "ProDesk 600 G1" },
  { id: "EQ009", marca: "Acer", modelo: "Veriton X4640G" },
]

const MOCK_AVAILABLE_MONITORS = [
  { id: "EQ002", marca: "HP", modelo: "EliteDisplay E231" },
  { id: "EQ006", marca: "Samsung", modelo: "SyncMaster S24D300H" },
  { id: "EQ010", marca: "LG", modelo: "24MP400-B" },
]

const initialEstaciones: Estacion[] = [
  {
    id: "EST001",
    cpu: { id: "EQ001", marca: "Dell", modelo: "OptiPlex 7010" },
    monitor: { id: "EQ002", marca: "HP", modelo: "EliteDisplay E231" },
    responsable: "Dr. Juan Pérez",
    servicio: "Urgencias",
    ubicacion: "Edificio Principal, 1er Piso, Estación de Enfermería 1",
    estado: "Activa",
    accesorios: ["Cable de Red", "Mouse", "Teclado"],
  },
  {
    id: "EST002",
    cpu: { id: "EQ005", marca: "HP", modelo: "ProDesk 600 G1" },
    monitor: { id: "EQ006", marca: "Samsung", modelo: "SyncMaster S24D300H" },
    responsable: "Enf. María López",
    servicio: "Laboratorio",
    ubicacion: "Edificio Principal, 2do Piso, Área de Análisis Clínicos",
    estado: "En Mantenimiento",
    accesorios: ["Cable de Corriente", "Office (Licencia)"],
  },
]

export default function EstacionesContent() {
  const [estaciones, setEstaciones] = useState<Estacion[]>(initialEstaciones)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddEditEstacionModalOpen, setIsAddEditEstacionModalOpen] = useState(false)
  const [editingEstacion, setEditingEstacion] = useState<Estacion | null>(null)
  const [isResguardosModalOpen, setIsResguardosModalOpen] = useState(false)
  const [selectedStationForResguardos, setSelectedStationForResguardos] = useState<Estacion | null>(null) // Changed to full object
  const { toast } = useToast()

  const filteredEstaciones = useMemo(() => {
    return estaciones.filter((estacion) =>
      Object.values(estacion).some((value) => {
        if (typeof value === "object" && value !== null) {
          return Object.values(value).some((subValue) =>
            String(subValue).toLowerCase().includes(searchTerm.toLowerCase()),
          )
        }
        return String(value).toLowerCase().includes(searchTerm.toLowerCase())
      }),
    )
  }, [estaciones, searchTerm])

  const handleAddEstacion = (newEstacion: Estacion) => {
    setEstaciones((prevEstaciones) => {
      // Check if it's an edit operation
      const existingIndex = prevEstaciones.findIndex((e) => e.id === newEstacion.id)
      if (existingIndex > -1) {
        const updatedEstaciones = [...prevEstaciones]
        updatedEstaciones[existingIndex] = newEstacion
        toast({
          title: "Éxito",
          description: "Estación actualizada correctamente.",
          variant: "success",
        })
        return updatedEstaciones
      }
      // Otherwise, it's a new station
      toast({
        title: "Éxito",
        description: "Estación agregada correctamente.",
        variant: "success",
      })
      return [...prevEstaciones, newEstacion]
    })
  }

  const handleDelete = (id: string) => {
    console.log(`Eliminar estación con ID: ${id}`)
    setEstaciones(estaciones.filter((estacion) => estacion.id !== id))
    toast({
      title: "Éxito",
      description: "Estación eliminada correctamente.",
      variant: "success",
    })
  }

  const openAddModal = () => {
    setEditingEstacion(null)
    setIsAddEditEstacionModalOpen(true)
  }

  const openEditModal = (estacion: Estacion) => {
    setEditingEstacion(estacion)
    setIsAddEditEstacionModalOpen(true)
  }

  const handleOpenResguardos = (estacion: Estacion) => {
    // Changed to receive full station object
    setSelectedStationForResguardos(estacion)
    setIsResguardosModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Estaciones</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">Lista de Estaciones</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar estación..."
                className="pl-8 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={openAddModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Estación
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{filteredEstaciones.length} estaciones encontradas</p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Estación</TableHead>
                  <TableHead>CPU (ID, Marca, Modelo)</TableHead>
                  <TableHead>Monitor (ID, Marca, Modelo)</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Accesorios</TableHead>
                  <TableHead className="text-center">Resguardos</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEstaciones.map((estacion) => (
                  <TableRow key={estacion.id}>
                    <TableCell className="font-medium">{estacion.id}</TableCell>
                    <TableCell>
                      {estacion.cpu.id} ({estacion.cpu.marca} {estacion.cpu.modelo})
                    </TableCell>
                    <TableCell>
                      {estacion.monitor.id} ({estacion.monitor.marca} {estacion.monitor.modelo})
                    </TableCell>
                    <TableCell>{estacion.responsable}</TableCell>
                    <TableCell>{estacion.servicio}</TableCell>
                    <TableCell>{estacion.ubicacion}</TableCell>
                    <TableCell>{estacion.estado}</TableCell>
                    <TableCell>
                      {estacion.accesorios && estacion.accesorios.length > 0 ? estacion.accesorios.join(", ") : "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenResguardos(estacion)} // Pass full station object
                        aria-label={`Abrir resguardos para estación ${estacion.id}`}
                      >
                        <FolderOpen className="h-4 w-4 mr-2" />
                        Abrir
                      </Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(estacion)}
                          aria-label={`Editar estación ${estacion.id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(estacion.id)}
                          aria-label={`Eliminar estación ${estacion.id}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEstaciones.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center text-muted-foreground">
                      No se encontraron estaciones.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddEstacionModal
        isOpen={isAddEditEstacionModalOpen}
        onClose={() => setIsAddEditEstacionModalOpen(false)}
        onAddEstacion={handleAddEstacion}
        availableCPUs={MOCK_AVAILABLE_CPUS}
        availableMonitors={MOCK_AVAILABLE_MONITORS}
        initialData={editingEstacion}
      />

      <ResguardosModal
        isOpen={isResguardosModalOpen}
        onClose={() => setIsResguardosModalOpen(false)}
        selectedItemData={selectedStationForResguardos} // Pass full station object
      />
    </div>
  )
}
