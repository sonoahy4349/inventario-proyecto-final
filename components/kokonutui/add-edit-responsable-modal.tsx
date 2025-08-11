"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { ResponsableDB } from "@/lib/types"

interface AddEditResponsableModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (responsable: Omit<ResponsableDB, "id" | "created_at" | "updated_at"> | ResponsableDB) => void
  initialData?: ResponsableDB | null
}

export default function AddEditResponsableModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddEditResponsableModalProps) {
  const [fullName, setFullName] = useState(initialData?.full_name || "")
  const [phone, setPhone] = useState(initialData?.phone || "")
  const [email, setEmail] = useState(initialData?.email || "")
  const { toast } = useToast()

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.full_name)
      setPhone(initialData.phone || "")
      setEmail(initialData.email || "")
    } else {
      setFullName("")
      setPhone("")
      setEmail("")
    }
  }, [initialData, isOpen])

  const handleSubmit = () => {
    if (!fullName.trim()) {
      toast({
        title: "Error",
        description: "El nombre completo es obligatorio.",
        variant: "destructive",
      })
      return
    }

    const responsableData = initialData
      ? { ...initialData, full_name: fullName, phone: phone || undefined, email: email || undefined }
      : { full_name: fullName, phone: phone || undefined, email: email || undefined }

    onSave(responsableData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Responsable" : "Agregar Nuevo Responsable"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">
              Nombre Completo
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Teléfono
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="col-span-3"
              type="tel"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Correo
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
