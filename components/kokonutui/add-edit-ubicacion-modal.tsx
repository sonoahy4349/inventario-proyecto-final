"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast" // Import useToast

interface Ubicacion {
  id: string
  edificio: string
  planta: string
  servicio: string
  ubicacionInterna: string
}

interface AddEditUbicacionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (ubicacion: Omit<Ubicacion, "id"> | Ubicacion) => void
  initialData?: Ubicacion | null
}

// Mock Catalogs for Ubicaciones
const EDIFICIOS = ["Principal", "Anexo", "Consultorios Externos", "Maternidad"]
const PLANTAS = ["Planta Baja", "1er Piso", "2do Piso", "3er Piso", "Sótano"]

export default function AddEditUbicacionModal({ isOpen, onClose, onSave, initialData }: AddEditUbicacionModalProps) {
  const [edificio, setEdificio] = useState(initialData?.edificio || "")
  const [planta, setPlanta] = useState(initialData?.planta || "")
  const [servicio, setServicio] = useState(initialData?.servicio || "")
  const [ubicacionInterna, setUbicacionInterna] = useState(initialData?.ubicacionInterna || "")
  const { toast } = useToast() // Initialize useToast

  useEffect(() => {
    if (initialData) {
      setEdificio(initialData.edificio)
      setPlanta(initialData.planta)
      setServicio(initialData.servicio)
      setUbicacionInterna(initialData.ubicacionInterna)
    } else {
      setEdificio("")
      setPlanta("")
      setServicio("")
      setUbicacionInterna("")
    }
  }, [initialData, isOpen])

  const handleSubmit = () => {
    if (!edificio || !planta || !servicio.trim() || !ubicacionInterna.trim()) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    const newOrUpdatedUbicacion: Ubicacion | Omit<Ubicacion, "id"> = initialData
      ? { ...initialData, edificio, planta, servicio, ubicacionInterna }
      : { edificio, planta, servicio, ubicacionInterna }

    onSave(newOrUpdatedUbicacion)
    onClose()
    toast({
      title: "Éxito",
      description: initialData ? "Ubicación actualizada correctamente." : "Ubicación agregada correctamente.",
      variant: "success",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Ubicación" : "Agregar Nueva Ubicación"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="edificio" className="text-right">
              Edificio
            </Label>
            <Select onValueChange={setEdificio} value={edificio}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un edificio" />
              </SelectTrigger>
              <SelectContent>
                {EDIFICIOS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="planta" className="text-right">
              Planta
            </Label>
            <Select onValueChange={setPlanta} value={planta}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona una planta" />
              </SelectTrigger>
              <SelectContent>
                {PLANTAS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="servicio" className="text-right">
              Servicio
            </Label>
            <Input
              id="servicio"
              value={servicio}
              onChange={(e) => setServicio(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ubicacionInterna" className="text-right">
              Ubicación Interna
            </Label>
            <Input
              id="ubicacionInterna"
              value={ubicacionInterna}
              onChange={(e) => setUbicacionInterna(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {initialData ? "Guardar Cambios" : "Agregar Ubicación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
