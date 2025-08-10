"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2, Search } from "lucide-react"
import AddEditUsuarioModal from "./add-edit-usuario-modal" // New modal for add/edit
import { useToast } from "@/components/ui/use-toast" // Import useToast

type UserRole = "Administrador" | "Usuario"
type UserStatus = "Activo" | "Inactivo"

interface User {
  id: string
  nombre: string
  email: string
  rol: UserRole
  estado: UserStatus
}

const initialUsers: User[] = [
  {
    id: "USR001",
    nombre: "Juan Pérez López",
    email: "juan.perez@hospital.com",
    rol: "Administrador",
    estado: "Activo",
  },
  { id: "USR002", nombre: "María González", email: "maria.gonzalez@hospital.com", rol: "Usuario", estado: "Activo" },
  { id: "USR003", nombre: "Carlos Ruiz", email: "carlos.ruiz@hospital.com", rol: "Usuario", estado: "Inactivo" },
]

interface GestionUsuariosProps {
  currentUserRole: UserRole
}

export default function GestionUsuarios({ currentUserRole }: GestionUsuariosProps) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const { toast } = useToast() // Initialize useToast

  const canManageUsers = currentUserRole === "Administrador"

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleAddUser = (newUser: Omit<User, "id">) => {
    const newId = `USR${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`
    setUsers((prev) => [...prev, { ...newUser, id: newId }])
    toast({
      title: "Éxito",
      description: "Usuario agregado correctamente.",
      variant: "success",
    })
  }

  const handleEditUser = (updatedUser: User) => {
    setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    toast({
      title: "Éxito",
      description: "Usuario actualizado correctamente.",
      variant: "success",
    })
  }

  const handleDeleteUser = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      setUsers(users.filter((user) => user.id !== id))
      toast({
        title: "Éxito",
        description: "Usuario eliminado correctamente.",
        variant: "success",
      })
    }
  }

  const openAddModal = () => {
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const openEditModal = (user: User) => {
    setEditingUser(user)
    setIsModalOpen(true)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-lg font-bold">Gestión de Usuarios</CardTitle>
          <p className="text-muted-foreground text-sm">Administrar usuarios del sistema</p>
        </div>
        {canManageUsers && (
          <Button onClick={openAddModal}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuario..."
            className="pl-8 w-[200px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                {canManageUsers && <TableHead className="text-center">Acciones</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.nombre}</TableCell>
                  {/* */}
                  <TableCell>{user.email}</TableCell>
                  {/* */}
                  <TableCell>{user.rol}</TableCell>
                  {/* */}
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.estado === "Activo"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {user.estado}
                    </span>
                  </TableCell>
                  {/* */}
                  {canManageUsers && (
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(user)}
                          aria-label={`Editar ${user.nombre}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteUser(user.id)}
                          aria-label={`Eliminar ${user.nombre}`}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={canManageUsers ? 5 : 4} className="text-center text-muted-foreground">
                    No se encontraron usuarios.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <AddEditUsuarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={editingUser ? handleEditUser : handleAddUser}
        initialData={editingUser}
      />
    </Card>
  )
}
