"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, ToggleRight, ToggleLeft, Search } from "lucide-react"
import AddEditDireccionModal from "./add-edit-direccion-modal"
import { useToast } from "@/components/ui/use-toast"

// Datos simulados
const MOCK_DIRECCIONES = [
  {
    id: "1",
    name: "Dirección General",
    description: "Dirección administrativa principal del hospital",
    status: "Activa" as const,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Dirección Médica",
    description: "Dirección encargada de los servicios médicos",
    status: "Activa" as const,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Dirección de Enfermería",
    description: "Dirección del personal de enfermería",
    status: "Activa" as const,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Dirección de Recursos Humanos",
    description: "Gestión del personal del hospital",
    status: "Inactiva" as const,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

interface AdministrativeDepartmentDB {
  id: string
  name: string
  description: string
  status: "Activa" | "Inactiva"
  created_at: string
  updated_at: string
}

export default function DireccionesContent() {
  const [direcciones, setDirecciones] = useState<AdministrativeDepartmentDB[]>(MOCK_DIRECCIONES)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDireccion, setEditingDireccion] = useState<AdministrativeDepartmentDB | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const filteredDirecciones = useMemo(() => {
    return direcciones.filter((direccion) =>
      Object.values(direccion).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [direcciones, searchTerm])

  const handleAddDireccion = async (
    newDireccionData: Omit<AdministrativeDepartmentDB, "id" | "created_at" | "updated_at">,
  ) => {
    const newDireccion: AdministrativeDepartmentDB = {
      ...newDireccionData,
      id: (direcciones.length + 1).toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setDirecciones((prev) => [...prev, newDireccion])
    toast({
      title: "Éxito",
      description: "Dirección agregada correctamente.",
      variant: "default",
    })
  }

  const handleEditDireccion = async (updatedDireccionData: AdministrativeDepartmentDB) => {
    setDirecciones((prev) =>
      prev.map((dir) =>
        dir.id === updatedDireccionData.id ? { ...updatedDireccionData, updated_at: new Date().toISOString() } : dir,
      ),
    )
    toast({
      title: "Éxito",
      description: "Dirección actualizada correctamente.",
      variant: "default",
    })
  }

  const handleToggleStatus = async (id: string, currentStatus: "Activa" | "Inactiva") => {
    const newStatus = currentStatus === "Activa" ? "Inactiva" : "Activa"
    setDirecciones((prev) =>
      prev.map((dir) => (dir.id === id ? { ...dir, status: newStatus, updated_at: new Date().toISOString() } : dir)),
    )
    toast({
      title: "Éxito",
      description: `Estado de dirección actualizado a "${newStatus}".`,
      variant: "default",
    })
  }

  const openAddModal = () => {
    setEditingDireccion(null)
    setIsModalOpen(true)
  }

  const openEditModal = (direccion: AdministrativeDepartmentDB) => {
    setEditingDireccion(direccion)
    setIsModalOpen(true)
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
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDirecciones.map((direccion) => (
                  <TableRow key={direccion.id}>
                    <TableCell className="font-medium">{direccion.id}</TableCell>
                    <TableCell>{direccion.name}</TableCell>
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
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
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
