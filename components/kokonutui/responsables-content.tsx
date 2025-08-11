"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2, Search } from "lucide-react"
import AddEditResponsableModal from "./add-edit-responsable-modal"
import { useToast } from "@/components/ui/use-toast"
import { getResponsables, insertResponsable, updateResponsable, deleteResponsable } from "@/lib/supabase/queries"
import type { ResponsableDB } from "@/lib/types"

export default function ResponsablesContent() {
  const [responsables, setResponsables] = useState<ResponsableDB[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingResponsable, setEditingResponsable] = useState<ResponsableDB | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const data = await getResponsables()
      if (data) {
        setResponsables(data)
      }
    } catch (error) {
      console.error("Error loading responsables:", error)
      toast({
        title: "Error",
        description: "Error al cargar los responsables. Por favor, recarga la página.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredResponsables = responsables.filter((responsable) =>
    Object.values(responsable).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddResponsable = async (newResponsableData: Omit<ResponsableDB, "id" | "created_at" | "updated_at">) => {
    const result = await insertResponsable(newResponsableData)
    if (result) {
      await loadData() // Reload data to get the latest
      toast({
        title: "Éxito",
        description: "Responsable agregado correctamente.",
        variant: "success",
      })
    } else {
      toast({
        title: "Error",
        description: "Error al agregar el responsable.",
        variant: "destructive",
      })
    }
  }

  const handleEditResponsable = async (updatedResponsableData: ResponsableDB) => {
    const result = await updateResponsable(updatedResponsableData.id, {
      full_name: updatedResponsableData.full_name,
      phone: updatedResponsableData.phone,
      email: updatedResponsableData.email,
    })
    if (result) {
      await loadData() // Reload data to get the latest
      toast({
        title: "Éxito",
        description: "Responsable actualizado correctamente.",
        variant: "success",
      })
    } else {
      toast({
        title: "Error",
        description: "Error al actualizar el responsable.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${name}?`)) {
      const success = await deleteResponsable(id)
      if (success) {
        setResponsables((prev) => prev.filter((responsable) => responsable.id !== id))
        toast({
          title: "Éxito",
          description: "Responsable eliminado correctamente.",
          variant: "success",
        })
      } else {
        toast({
          title: "Error",
          description: "Error al eliminar el responsable.",
          variant: "destructive",
        })
      }
    }
  }

  const openAddModal = () => {
    setEditingResponsable(null)
    setIsModalOpen(true)
  }

  const openEditModal = (responsable: ResponsableDB) => {
    setEditingResponsable(responsable)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Responsables</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando responsables...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Responsables</h1>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">Lista de Responsables</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar responsable..."
                className="pl-8 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={openAddModal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Responsable
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResponsables.map((responsable) => (
                  <TableRow key={responsable.id}>
                    <TableCell className="font-medium">{responsable.full_name}</TableCell>
                    <TableCell>{responsable.phone || "N/A"}</TableCell>
                    <TableCell>{responsable.email || "N/A"}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(responsable)}
                          aria-label={`Editar ${responsable.full_name}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(responsable.id, responsable.full_name)}
                          aria-label={`Eliminar ${responsable.full_name}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredResponsables.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No se encontraron responsables.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddEditResponsableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={editingResponsable ? handleEditResponsable : handleAddResponsable}
        initialData={editingResponsable}
      />
    </div>
  )
}
