"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2, Search } from "lucide-react"
import AddEditResponsableModal from "./add-edit-responsable-modal" // Import the new modal
import { useToast } from "@/components/ui/use-toast" // Import useToast

interface Responsable {
  id: string
  nombreCompleto: string
  telefono?: string
  correo?: string
  estacionEquipoAsignado: string
}

const initialResponsables: Responsable[] = [
  {
    id: "RESP001",
    nombreCompleto: "Dr. Juan Pérez",
    telefono: "555-1234",
    correo: "juan.perez@hospital.com",
    estacionEquipoAsignado: "Urgencias-01 (CPU EQ001)",
  },
  {
    id: "RESP002",
    nombreCompleto: "Lic. Ana García",
    telefono: "555-5678",
    correo: "ana.garcia@hospital.com",
    estacionEquipoAsignado: "Laboratorio (Impresora IMP001)",
  },
  {
    id: "RESP003",
    nombreCompleto: "Enf. María López",
    telefono: "",
    correo: "maria.lopez@hospital.com",
    estacionEquipoAsignado: "Urgencias-02 (Laptop LAP002)",
  },
  {
    id: "RESP004",
    nombreCompleto: "Ing. Carlos Ruiz",
    telefono: "555-9012",
    correo: "carlos.ruiz@hospital.com",
    estacionEquipoAsignado: "TI (Servidor)",
  },
]

export default function ResponsablesContent() {
  const [responsables, setResponsables] = useState<Responsable[]>(initialResponsables)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingResponsable, setEditingResponsable] = useState<Responsable | null>(null)
  const { toast } = useToast() // Initialize useToast

  const filteredResponsables = responsables.filter((responsable) =>
    Object.values(responsable).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddResponsable = (newResponsable: Omit<Responsable, "id" | "estacionEquipoAsignado">) => {
    const newId = `RESP${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`
    setResponsables((prev) => [...prev, { ...newResponsable, id: newId, estacionEquipoAsignado: "N/A" }]) // Default for new
    toast({
      title: "Éxito",
      description: "Responsable agregado correctamente.",
      variant: "success",
    })
  }

  const handleEditResponsable = (updatedResponsable: Responsable) => {
    setResponsables((prev) => prev.map((resp) => (resp.id === updatedResponsable.id ? updatedResponsable : resp)))
    toast({
      title: "Éxito",
      description: "Responsable actualizado correctamente.",
      variant: "success",
    })
  }

  const handleDelete = (id: string) => {
    console.log(`Eliminar responsable con ID: ${id}`)
    setResponsables(responsables.filter((responsable) => responsable.id !== id))
    toast({
      title: "Éxito",
      description: "Responsable eliminado correctamente.",
      variant: "success",
    })
  }

  const openAddModal = () => {
    setEditingResponsable(null)
    setIsModalOpen(true)
  }

  const openEditModal = (responsable: Responsable) => {
    setEditingResponsable(responsable)
    setIsModalOpen(true)
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
                  <TableHead>ID</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Estación/Equipo Asignado</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResponsables.map((responsable) => (
                  <TableRow key={responsable.id}>
                    <TableCell className="font-medium">{responsable.id}</TableCell>
                    {/* */}
                    <TableCell>{responsable.nombreCompleto}</TableCell>
                    {/* */}
                    <TableCell>{responsable.telefono || "N/A"}</TableCell>
                    {/* */}
                    <TableCell>{responsable.correo || "N/A"}</TableCell>
                    {/* */}
                    <TableCell>{responsable.estacionEquipoAsignado}</TableCell>
                    {/* */}
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(responsable)}
                          aria-label={`Editar ${responsable.nombreCompleto}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(responsable.id)}
                          aria-label={`Eliminar ${responsable.nombreCompleto}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredResponsables.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
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
