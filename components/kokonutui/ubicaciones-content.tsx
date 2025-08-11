"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2, Search } from "lucide-react"
import AddEditUbicacionModal from "./add-edit-ubicacion-modal"
import { useToast } from "@/components/ui/use-toast"
import { getLocations, insertLocation, updateLocation, deleteLocation } from "@/lib/supabase/queries"
import type { LocationDB } from "@/lib/types"

export default function UbicacionesContent() {
  const [ubicaciones, setUbicaciones] = useState<LocationDB[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUbicacion, setEditingUbicacion] = useState<LocationDB | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const data = await getLocations()
      if (data) {
        setUbicaciones(data)
      }
    } catch (error) {
      console.error("Error loading locations:", error)
      toast({
        title: "Error",
        description: "Error al cargar las ubicaciones. Por favor, recarga la página.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUbicaciones = ubicaciones.filter((ubicacion) =>
    Object.values(ubicacion).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddUbicacion = async (newUbicacionData: Omit<LocationDB, "id" | "created_at" | "updated_at">) => {
    const result = await insertLocation(newUbicacionData)
    if (result) {
      await loadData() // Reload data to get the latest
      toast({
        title: "Éxito",
        description: "Ubicación agregada correctamente.",
        variant: "success",
      })
    } else {
      toast({
        title: "Error",
        description: "Error al agregar la ubicación.",
        variant: "destructive",
      })
    }
  }

  const handleEditUbicacion = async (updatedUbicacionData: LocationDB) => {
    const result = await updateLocation(updatedUbicacionData.id, {
      building: updatedUbicacionData.building,
      floor: updatedUbicacionData.floor,
      service_area: updatedUbicacionData.service_area,
      internal_location: updatedUbicacionData.internal_location,
      description: updatedUbicacionData.description,
    })
    if (result) {
      await loadData() // Reload data to get the latest
      toast({
        title: "Éxito",
        description: "Ubicación actualizada correctamente.",
        variant: "success",
      })
    } else {
      toast({
        title: "Error",
        description: "Error al actualizar la ubicación.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string, locationName: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar la ubicación ${locationName}?`)) {
      const success = await deleteLocation(id)
      if (success) {
        setUbicaciones((prev) => prev.filter((ubicacion) => ubicacion.id !== id))
        toast({
          title: "Éxito",
          description: "Ubicación eliminada correctamente.",
          variant: "success",
        })
      } else {
        toast({
          title: "Error",
          description: "Error al eliminar la ubicación.",
          variant: "destructive",
        })
      }
    }
  }

  const openAddModal = () => {
    setEditingUbicacion(null)
    setIsModalOpen(true)
  }

  const openEditModal = (ubicacion: LocationDB) => {
    setEditingUbicacion(ubicacion)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Ubicaciones</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando ubicaciones...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Ubicaciones</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">Lista de Ubicaciones</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ubicación..."
                className="pl-8 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={openAddModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Ubicación
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Edificio</TableHead>
                  <TableHead>Planta</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Ubicación Interna</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUbicaciones.map((ubicacion) => (
                  <TableRow key={ubicacion.id}>
                    <TableCell className="font-medium">{ubicacion.building}</TableCell>
                    <TableCell>{ubicacion.floor}</TableCell>
                    <TableCell>{ubicacion.service_area}</TableCell>
                    <TableCell>{ubicacion.internal_location}</TableCell>
                    <TableCell>{ubicacion.description || "N/A"}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(ubicacion)}
                          aria-label={`Editar ${ubicacion.internal_location}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(ubicacion.id, ubicacion.internal_location)}
                          aria-label={`Eliminar ${ubicacion.internal_location}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUbicaciones.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No se encontraron ubicaciones.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddEditUbicacionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={editingUbicacion ? handleEditUbicacion : handleAddUbicacion}
        initialData={editingUbicacion}
      />
    </div>
  )
}
