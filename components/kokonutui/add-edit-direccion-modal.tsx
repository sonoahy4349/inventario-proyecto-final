"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { AdministrativeDepartmentDB } from "@/lib/types"

interface AddEditDireccionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (
    direccion: Omit<AdministrativeDepartmentDB, "id" | "created_at" | "updated_at"> | AdministrativeDepartmentDB,
  ) => void
  initialData?: AdministrativeDepartmentDB | null
}

export default function AddEditDireccionModal({ isOpen, onClose, onSave, initialData }: AddEditDireccionModalProps) {
  const [name, setName] = useState(initialData?.name || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const { toast } = useToast()

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setDescription(initialData.description)
    } else {
      setName("")
      setDescription("")
    }
  }, [initialData, isOpen])

  const handleSubmit = () => {
    if (!name.trim() || !description.trim()) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos.",
        variant: "destructive",
      })
      return
    }

    const newOrUpdatedDireccion:
      | AdministrativeDepartmentDB
      | Omit<AdministrativeDepartmentDB, "id" | "created_at" | "updated_at"> = initialData
      ? { ...initialData, name, description }
      : { name, description, status: "Activa" }

    onSave(newOrUpdatedDireccion)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Dirección" : "Agregar Nueva Dirección"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right">
              Descripción
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3 min-h-[80px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {initialData ? "Guardar Cambios" : "Agregar Dirección"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
