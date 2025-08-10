"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2, Search } from "lucide-react"
import AddEditUbicacionModal from "./add-edit-ubicacion-modal" // Import the new modal
import { useToast } from "@/components/ui/use-toast" // Import useToast

interface Ubicacion {
  id: string
  edificio: string
  planta: string
  servicio: string
  ubicacionInterna: string
}

const initialUbicaciones: Ubicacion[] = [
  {
    id: "UB001",
    edificio: "Principal",
    planta: "1er Piso",
    servicio: "Urgencias",
    ubicacionInterna: "Estación de Enfermería 1",
  },
  {
    id: "UB002",
    edificio: "Principal",
    planta: "2do Piso",
    servicio: "Laboratorio",
    ubicacionInterna: "Área de Análisis Clínicos",
  },
  {
    id: "UB003",
    edificio: "Anexo",
    planta: "Planta Baja",
    servicio: "Administración",
    ubicacionInterna: "Oficina de Gerencia",
  },
  {
    id: "UB004",
    edificio: "Principal",
    planta: "3er Piso",
    servicio: "Radiología",
    ubicacionInterna: "Sala de Rayos X 2",
  },
  {
    id: "UB005",
    edificio: "Principal",
    planta: "1er Piso",
    servicio: "Farmacia",
    ubicacionInterna: "Mostrador Principal",
  },
]

export default function UbicacionesContent() {
  const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>(initialUbicaciones)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUbicacion, setEditingUbicacion] = useState<Ubicacion | null>(null)
  const { toast } = useToast() // Initialize useToast

  const filteredUbicaciones = ubicaciones.filter((ubicacion) =>
    Object.values(ubicacion).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddUbicacion = (newUbicacion: Omit<Ubicacion, "id">) => {
    const newId = `UB${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`
    setUbicaciones((prev) => [...prev, { ...newUbicacion, id: newId }])
    toast({
      title: "Éxito",
      description: "Ubicación agregada correctamente.",
      variant: "success",
    })
  }

  const handleEditUbicacion = (updatedUbicacion: Ubicacion) => {
    setUbicaciones((prev) => prev.map((ub) => (ub.id === updatedUbicacion.id ? updatedUbicacion : ub)))
    toast({
      title: "Éxito",
      description: "Ubicación actualizada correctamente.",
      variant: "success",
    })
  }

  const handleDelete = (id: string) => {
    console.log(`Eliminar ubicación con ID: ${id}`)
    setUbicaciones(ubicaciones.filter((ubicacion) => ubicacion.id !== id))
    toast({
      title: "Éxito",
      description: "Ubicación eliminada correctamente.",
      variant: "success",
    })
  }

  const openAddModal = () => {
    setEditingUbicacion(null)
    setIsModalOpen(true)
  }

  const openEditModal = (ubicacion: Ubicacion) => {
    setEditingUbicacion(ubicacion)
    setIsModalOpen(true)
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
                  <TableHead>ID</TableHead>
                  <TableHead>Edificio</TableHead>
                  <TableHead>Planta</TableHead>
                  <TableHead>Servicio</TableHead>
                  <TableHead>Ubicación Interna</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUbicaciones.map((ubicacion) => (
                  <TableRow key={ubicacion.id}>
                    <TableCell className="font-medium">{ubicacion.id}</TableCell>
                    {/* */}
                    <TableCell>{ubicacion.edificio}</TableCell>
                    {/* */}
                    <TableCell>{ubicacion.planta}</TableCell>
                    {/* */}
                    <TableCell>{ubicacion.servicio}</TableCell>
                    {/* */}
                    <TableCell>{ubicacion.ubicacionInterna}</TableCell>
                    {/* */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(ubicacion)}
                          aria-label={`Editar ${ubicacion.ubicacionInterna}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(ubicacion.id)}
                          aria-label={`Eliminar ${ubicacion.ubicacionInterna}`}
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
