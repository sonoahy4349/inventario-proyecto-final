"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast" // Import useToast

interface Responsable {
  id: string
  nombreCompleto: string
  telefono?: string
  correo?: string
  estacionEquipoAsignado?: string // This field is for display, not edited here
}

interface AddEditResponsableModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (responsable: Omit<Responsable, "id" | "estacionEquipoAsignado"> | Responsable) => void
  initialData?: Responsable | null
}

export default function AddEditResponsableModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddEditResponsableModalProps) {
  const [nombreCompleto, setNombreCompleto] = useState(initialData?.nombreCompleto || "")
  const [telefono, setTelefono] = useState(initialData?.telefono || "")
  const [correo, setCorreo] = useState(initialData?.correo || "")
  const { toast } = useToast() // Initialize useToast

  useEffect(() => {
    if (initialData) {
      setNombreCompleto(initialData.nombreCompleto)
      setTelefono(initialData.telefono || "")
      setCorreo(initialData.correo || "")
    } else {
      setNombreCompleto("")
      setTelefono("")
      setCorreo("")
    }
  }, [initialData, isOpen])

  const handleSubmit = () => {
    if (!nombreCompleto.trim()) {
      toast({
        title: "Error",
        description: "El nombre completo es obligatorio.",
        variant: "destructive",
      })
      return
    }

    const newOrUpdatedResponsable: Responsable | Omit<Responsable, "id" | "estacionEquipoAsignado"> = initialData
      ? { ...initialData, nombreCompleto, telefono, correo }
      : { nombreCompleto, telefono, correo }

    onSave(newOrUpdatedResponsable)
    onClose()
    toast({
      title: "Éxito",
      description: initialData ? "Responsable actualizado correctamente." : "Responsable agregado correctamente.",
      variant: "success",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Responsable" : "Agregar Nuevo Responsable"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nombreCompleto" className="text-right">
              Nombre Completo
            </Label>
            <Input
              id="nombreCompleto"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="telefono" className="text-right">
              Teléfono
            </Label>
            <Input
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="col-span-3"
              type="tel"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="correo" className="text-right">
              Correo
            </Label>
            <Input
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="col-span-3"
              type="email"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {initialData ? "Guardar Cambios" : "Agregar Responsable"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
