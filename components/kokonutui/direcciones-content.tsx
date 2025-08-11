"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, ToggleRight, ToggleLeft, Search } from "lucide-react"
import AddEditDireccionModal from "./add-edit-direccion-modal"
import { useToast } from "@/components/ui/use-toast"
import {
  getAdministrativeDepartments,
  insertAdministrativeDepartment,
  updateAdministrativeDepartment,
} from "@/lib/supabase/queries"
import type { AdministrativeDepartmentDB } from "@/lib/types"

export default function DireccionesContent() {
  const [direcciones, setDirecciones] = useState<AdministrativeDepartmentDB[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDireccion, setEditingDireccion] = useState<AdministrativeDepartmentDB | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const data = await getAdministrativeDepartments()
      if (data) {
        setDirecciones(data)
      }
    } catch (error) {
      console.error("Error loading administrative departments:", error)
      toast({
        title: "Error",
        description: "Error al cargar las direcciones. Por favor, recarga la página.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDirecciones = useMemo(() => {
    return direcciones.filter((direccion) =>
      Object.values(direccion).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [direcciones, searchTerm])

  const handleAddDireccion = async (
    newDireccionData: Omit<AdministrativeDepartmentDB, "id" | "created_at" | "updated_at">,
  ) => {
    const result = await insertAdministrativeDepartment(newDireccionData)
    if (result) {
      await loadData() // Reload data to get the latest
      toast({
        title: "Éxito",
        description: "Dirección agregada correctamente.",
        variant: "default",
      })
    } else {
      toast({
        title: "Error",
        description: "Error al agregar la dirección.",
        variant: "destructive",
      })
    }
  }

  const handleEditDireccion = async (updatedDireccionData: AdministrativeDepartmentDB) => {
    const result = await updateAdministrativeDepartment(updatedDireccionData.id, {
      name: updatedDireccionData.name,
      description: updatedDireccionData.description,
      status: updatedDireccionData.status,
    })
    if (result) {
      await loadData() // Reload data to get the latest
      toast({
        title: "Éxito",
        description: "Dirección actualizada correctamente.",
        variant: "default",
      })
    } else {
      toast({
        title: "Error",
        description: "Error al actualizar la dirección.",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: "Activa" | "Inactiva") => {
    const newStatus = currentStatus === "Activa" ? "Inactiva" : "Activa"
    const result = await updateAdministrativeDepartment(id, { status: newStatus })
    if (result) {
      setDirecciones((prev) => prev.map((dir) => (dir.id === id ? { ...dir, status: newStatus } : dir)))
      toast({
        title: "Éxito",
        description: `Estado de dirección actualizado a "${newStatus}".`,
        variant: "default",
      })
    } else {
      toast({
        title: "Error",
        description: "Error al actualizar el estado de la dirección.",
        variant: "destructive",
      })
    }
  }

  const openAddModal = () => {
    setEditingDireccion(null)
    setIsModalOpen(true)
  }

  const openEditModal = (direccion: AdministrativeDepartmentDB) => {
    setEditingDireccion(direccion)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Direcciones Administrativas</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando direcciones...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Direcciones Administrativas</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">Lista de Direcciones</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar dirección..."
                className="pl-8 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={openAddModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Dirección
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDirecciones.map((direccion) => (
                  <TableRow key={direccion.id}>
                    <TableCell className="font-medium">{direccion.name}</TableCell>
                    <TableCell>{direccion.description}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          direccion.status === "Activa"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        }`}
                      >
                        {direccion.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(direccion)}
                          aria-label={`Editar ${direccion.name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(direccion.id, direccion.status)}
                          aria-label={
                            direccion.status === "Activa" ? `Desactivar ${direccion.name}` : `Activar ${direccion.name}`
                          }
                        >
                          {direccion.status === "Activa" ? (
                            <ToggleRight className="h-4 w-4 text-red-500" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-emerald-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDirecciones.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No se encontraron direcciones.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddEditDireccionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={editingDireccion ? handleEditDireccion : handleAddDireccion}
        initialData={editingDireccion}
      />
    </div>
  )
}
