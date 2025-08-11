"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { LocationDB } from "@/lib/types"

interface AddEditUbicacionModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (ubicacion: Omit<LocationDB, "id" | "created_at" | "updated_at"> | LocationDB) => void
  initialData?: LocationDB | null
}

// Mock Catalogs for Ubicaciones
const EDIFICIOS = ["Principal", "Anexo", "Consultorios Externos", "Maternidad"]
const PLANTAS = ["Planta Baja", "1er Piso", "2do Piso", "3er Piso", "Sótano"]

export default function AddEditUbicacionModal({ isOpen, onClose, onSave, initialData }: AddEditUbicacionModalProps) {
  const [building, setBuilding] = useState(initialData?.building || "")
  const [floor, setFloor] = useState(initialData?.floor || "")
  const [serviceArea, setServiceArea] = useState(initialData?.service_area || "")
  const [internalLocation, setInternalLocation] = useState(initialData?.internal_location || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const { toast } = useToast()

  useEffect(() => {
    if (initialData) {
      setBuilding(initialData.building)
      setFloor(initialData.floor)
      setServiceArea(initialData.service_area)
      setInternalLocation(initialData.internal_location)
      setDescription(initialData.description || "")
    } else {
      setBuilding("")
      setFloor("")
      setServiceArea("")
      setInternalLocation("")
      setDescription("")
    }
  }, [initialData, isOpen])

  const handleSubmit = () => {
    if (!building || !floor || !serviceArea.trim() || !internalLocation.trim()) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos obligatorios.",
        variant: "destructive",
      })
      return
    }

    const ubicacionData = initialData
      ? {
          ...initialData,
          building,
          floor,
          service_area: serviceArea,
          internal_location: internalLocation,
          description: description || undefined,
        }
      : {
          building,
          floor,
          service_area: serviceArea,
          internal_location: internalLocation,
          description: description || undefined,
        }

    onSave(ubicacionData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Ubicación" : "Agregar Nueva Ubicación"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="building" className="text-right">
              Edificio
            </Label>
            <Select onValueChange={setBuilding} value={building}>
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
            <Label htmlFor="floor" className="text-right">
              Planta
            </Label>
            <Select onValueChange={setFloor} value={floor}>
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
            <Label htmlFor="serviceArea" className="text-right">
              Servicio
            </Label>
            <Input
              id="serviceArea"
              value={serviceArea}
              onChange={(e) => setServiceArea(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="internalLocation" className="text-right">
              Ubicación Interna
            </Label>
            <Input
              id="internalLocation"
              value={internalLocation}
              onChange={(e) => setInternalLocation(e.target.value)}
              className="col-span-3"
              required
            />
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
              placeholder="Descripción opcional..."
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
