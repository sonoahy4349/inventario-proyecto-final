"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Save } from "lucide-react"
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

interface AddEditUsuarioModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (user: Omit<User, "id"> | User) => void
  initialData?: User | null
}

export default function AddEditUsuarioModal({ isOpen, onClose, onSave, initialData }: AddEditUsuarioModalProps) {
  const [nombre, setNombre] = useState(initialData?.nombre || "")
  const [email, setEmail] = useState(initialData?.email || "")
  const [rol, setRol] = useState<UserRole>(initialData?.rol || "Usuario")
  const [estado, setEstado] = useState<UserStatus>(initialData?.estado || "Activo")
  const { toast } = useToast() // Initialize useToast

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre)
      setEmail(initialData.email)
      setRol(initialData.rol)
      setEstado(initialData.estado)
    } else {
      setNombre("")
      setEmail("")
      setRol("Usuario")
      setEstado("Activo")
    }
  }, [initialData, isOpen])

  const handleSubmit = () => {
    if (!nombre.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Nombre y Email son obligatorios.",
        variant: "destructive",
      })
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Error",
        description: "Por favor, introduce un email válido.",
        variant: "destructive",
      })
      return
    }

    const newOrUpdatedUser: User | Omit<User, "id"> = initialData
      ? { ...initialData, nombre, email, rol, estado }
      : { nombre, email, rol, estado }

    onSave(newOrUpdatedUser)
    onClose()
    toast({
      title: "Éxito",
      description: initialData ? "Usuario actualizado correctamente." : "Usuario agregado correctamente.",
      variant: "success",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Usuario" : "Agregar Nuevo Usuario"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nombre" className="text-right">
              Nombre
            </Label>
            <Input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              type="email"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rol" className="text-right">
              Rol
            </Label>
            <Select onValueChange={(value: UserRole) => setRol(value)} value={rol}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Administrador">Administrador</SelectItem>
                <SelectItem value="Usuario">Usuario</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estado" className="text-right">
              Estado
            </Label>
            <Select onValueChange={(value: UserStatus) => setEstado(value)} value={estado}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Activo">Activo</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {initialData ? "Guardar Cambios" : "Agregar Usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
