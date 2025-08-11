"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2, Search, FolderOpen } from "lucide-react"
import AddEstacionModal from "./add-estacion-modal"
import ResguardosModal from "./resguardos-modal"
import { useToast } from "@/components/ui/use-toast"
import { getPopulatedStations, getAvailableCPUs, getAvailableMonitors, deleteStation } from "@/lib/supabase/queries"
import type { PopulatedEstacion } from "@/lib/types"

export default function EstacionesContent() {
  const [estaciones, setEstaciones] = useState<PopulatedEstacion[]>([])
  const [availableCPUs, setAvailableCPUs] = useState<{ id: string; marca: string; modelo: string }[]>([])
  const [availableMonitors, setAvailableMonitors] = useState<{ id: string; marca: string; modelo: string }[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddEditEstacionModalOpen, setIsAddEditEstacionModalOpen] = useState(false)
  const [editingEstacion, setEditingEstacion] = useState<PopulatedEstacion | null>(null)
  const [isResguardosModalOpen, setIsResguardosModalOpen] = useState(false)
  const [selectedStationForResguardos, setSelectedStationForResguardos] = useState<PopulatedEstacion | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [estacionesData, cpusData, monitorsData] = await Promise.all([
        getPopulatedStations(),
        getAvailableCPUs(),
        getAvailableMonitors(),
      ])

      if (estacionesData) setEstaciones(estacionesData)
      if (cpusData) setAvailableCPUs(cpusData)
      if (monitorsData) setAvailableMonitors(monitorsData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Error al cargar los datos. Por favor, recarga la página.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleAddEstacion = async (newEstacion: any) => {
    // Reload data after successful operation
    await loadData()
    toast({
      title: "Éxito",
      description: editingEstacion ? "Estación actualizada correctamente." : "Estación agregada correctamente.",
      variant: "success",
    })
  }

  const handleDelete = async (id: string, displayId: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la estación ${displayId}?`)) {
      const success = await deleteStation(id)
      if (success) {
        setEstaciones((prev) => prev.filter((estacion) => estacion.id !== id))
        toast({
          title: "Éxito",
          description: "Estación eliminada correctamente.",
          variant: "success",
        })
      } else {
        toast({
          title: "Error",
          description: "Error al eliminar la estación.",
          variant: "destructive",
        })
      }
    }
  }

  const openAddModal = () => {
    setEditingEstacion(null)
    setIsAddEditEstacionModalOpen(true)
  }

  const openEditModal = (estacion: PopulatedEstacion) => {
    setEditingEstacion(estacion)
    setIsAddEditEstacionModalOpen(true)
  }

  const handleOpenResguardos = (estacion: PopulatedEstacion) => {
    setSelectedStationForResguardos(estacion)
    setIsResguardosModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Estaciones</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando estaciones...</p>
          </div>
        </div>
      </div>
    )
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
                  <TableHead>Nombre</TableHead>
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
                    <TableCell className="font-medium">{estacion.display_id}</TableCell>
                    <TableCell>{estacion.name}</TableCell>
                    <TableCell>
                      {estacion.cpu.display_id} ({estacion.cpu.brand} {estacion.cpu.model})
                    </TableCell>
                    <TableCell>
                      {estacion.monitor.display_id} ({estacion.monitor.brand} {estacion.monitor.model})
                    </TableCell>
                    <TableCell>{estacion.current_responsible.full_name}</TableCell>
                    <TableCell>{estacion.current_location.service_area}</TableCell>
                    <TableCell>
                      {`${estacion.current_location.building}, ${estacion.current_location.floor}, ${estacion.current_location.service_area}, ${estacion.current_location.internal_location}`}
                    </TableCell>
                    <TableCell>{estacion.station_status.name}</TableCell>
                    <TableCell>
                      {estacion.accessories && estacion.accessories.length > 0
                        ? estacion.accessories.join(", ")
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenResguardos(estacion)}
                        aria-label={`Abrir resguardos para estación ${estacion.display_id}`}
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
                          aria-label={`Editar estación ${estacion.display_id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(estacion.id, estacion.display_id)}
                          aria-label={`Eliminar estación ${estacion.display_id}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEstaciones.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-muted-foreground">
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
        availableCPUs={availableCPUs}
        availableMonitors={availableMonitors}
        initialData={editingEstacion}
      />

      <ResguardosModal
        isOpen={isResguardosModalOpen}
        onClose={() => setIsResguardosModalOpen(false)}
        selectedItemData={selectedStationForResguardos}
      />
    </div>
  )
}
