"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface EquipmentTypeDB {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

interface EquipmentStatusDB {
  id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

interface LocationDB {
  id: string
  building: string
  floor: string
  service_area: string
  internal_location: string
  description?: string
  created_at: string
  updated_at: string
}

interface ResponsableDB {
  id: string
  full_name: string
  phone?: string
  email?: string
  created_at: string
  updated_at: string
}

interface PopulatedEquipo {
  id: string
  display_id: string
  brand: string
  model: string
  serial_number: string
  equipment_type: EquipmentTypeDB
  current_status: EquipmentStatusDB
  current_location: LocationDB
  current_responsible?: ResponsableDB
  assigned_station?: { display_id: string } | null
  printer_details?: any | null
  created_at: string
  updated_at: string
}

interface AddEquipoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (equipo: any) => void
  initialData?: PopulatedEquipo | null
  equipmentTypes: EquipmentTypeDB[]
  equipmentStatuses: EquipmentStatusDB[]
  locations: LocationDB[]
  responsables: ResponsableDB[]
}

// Mock Catalogs
const MARCAS = ["Dell", "HP", "Lenovo", "Samsung", "Epson", "Brother", "Acer", "Asus", "LG", "Canon", "Xerox"]
const SERVICIOS = ["Urgencias", "Laboratorio", "Administración", "Radiología", "Farmacia", "TI"]
const PERFILES_IMPRESORA = ["Color", "Monocromática", "Red", "WiFi", "USB"]
const TIPOS_IMPRESORA = ["Láser", "Inyección de Tinta", "Térmica"]
const ESTACIONES_EXISTENTES = ["Urgencias-01", "Laboratorio-03", "Radiología-05", "Oficina TI-01"]

export default function AddEquipoModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  equipmentTypes,
  equipmentStatuses,
  locations,
  responsables,
}: AddEquipoModalProps) {
  const [selectedEquipoType, setSelectedEquipoType] = useState<string>("")
  const [formData, setFormData] = useState<any>({})
  const [newStationName, setNewStationName] = useState("")
  const [isAddingNewStation, setIsAddingNewStation] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Populate form for editing
        setSelectedEquipoType(initialData.equipment_type?.name || "")
        setFormData({
          marca: initialData.brand || "",
          modelo: initialData.model || "",
          noSerie: initialData.serial_number || "",
          estado: initialData.current_status?.name || "",
          responsable: initialData.current_responsible?.full_name || "",
          ubicacion:
            `${initialData.current_location?.building || ""}, ${initialData.current_location?.floor || ""}, ${initialData.current_location?.service_area || ""}, ${initialData.current_location?.internal_location || ""}`.trim() ||
            "",
          servicio: initialData.current_location?.service_area || "",
          estacionAsignada: initialData.assigned_station?.display_id || "",
          tipoImpresora: initialData.printer_details?.printer_type || "",
          perfil: initialData.printer_details?.profile || "",
        })
      } else {
        // Reset form for adding new with defaults
        setSelectedEquipoType("")
        setFormData({
          marca: "",
          modelo: "",
          noSerie: "",
          responsable: "N/A",
          ubicacion: "Edificio Principal, Planta Baja, Almacén TI, Almacén Principal",
          estado: "Activo",
          servicio: "Almacén TI",
          estacionAsignada: "",
          tipoImpresora: "",
          perfil: "",
        })
        setNewStationName("")
        setIsAddingNewStation(false)
      }
    }
  }, [initialData, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev: any) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }))
    if (id === "estacionAsignada" && value === "nueva_estacion") {
      setIsAddingNewStation(true)
    } else if (id === "estacionAsignada") {
      setIsAddingNewStation(false)
      setNewStationName("")
    }
  }

  const handleSubmit = () => {
    if (!selectedEquipoType) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un tipo de equipo.",
        variant: "destructive",
      })
      return
    }

    // Basic validation
    if (!formData.marca || !formData.modelo || !formData.noSerie) {
      toast({
        title: "Error",
        description: "Por favor, completa todos los campos obligatorios (Marca, Modelo, No. de Serie).",
        variant: "destructive",
      })
      return
    }

    // Generate display_id only for new equipment
    const generatedDisplayId = initialData
      ? initialData.display_id
      : `${selectedEquipoType.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 999)
          .toString()
          .padStart(3, "0")}`

    const newEquipoData = {
      id: initialData?.id,
      display_id: generatedDisplayId,
      tipo: selectedEquipoType,
      ...formData,
    }

    if (isAddingNewStation) {
      newEquipoData.estacionAsignada = newStationName
    }

    onSave(newEquipoData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Equipo" : "Agregar Nuevo Equipo"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tipoEquipo" className="text-right">
              Tipo de Equipo
            </Label>
            <Select onValueChange={(value: string) => setSelectedEquipoType(value)} value={selectedEquipoType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {equipmentTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedEquipoType && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="marca" className="text-right">
                  Marca *
                </Label>
                <Select onValueChange={(value) => handleSelectChange("marca", value)} value={formData.marca || ""}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona una marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {MARCAS.map((marca) => (
                      <SelectItem key={marca} value={marca}>
                        {marca}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="modelo" className="text-right">
                  Modelo *
                </Label>
                <Input id="modelo" value={formData.modelo || ""} onChange={handleInputChange} className="col-span-3" />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="noSerie" className="text-right">
                  No. de Serie *
                </Label>
                <Input
                  id="noSerie"
                  value={formData.noSerie || ""}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>

              {/* Fields specific to CPU, Monitor, Laptop */}
              {(selectedEquipoType === "CPU" ||
                selectedEquipoType === "Monitor" ||
                selectedEquipoType === "Laptop") && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="estado" className="text-right">
                      Estado
                    </Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("estado", value)}
                      value={formData.estado || ""}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                      <SelectContent>
                        {equipmentStatuses.map((status) => (
                          <SelectItem key={status.id} value={status.name}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="responsable" className="text-right">
                      Responsable
                    </Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("responsable", value)}
                      value={formData.responsable || ""}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecciona un responsable" />
                      </SelectTrigger>
                      <SelectContent>
                        {responsables.map((resp) => (
                          <SelectItem key={resp.id} value={resp.full_name}>
                            {resp.full_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Fields specific to Impresora */}
              {selectedEquipoType === "Impresora" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="tipoImpresora" className="text-right">
                      Tipo (Impresora)
                    </Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("tipoImpresora", value)}
                      value={formData.tipoImpresora || ""}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecciona un tipo de impresora" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_IMPRESORA.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="perfil" className="text-right">
                      Perfil
                    </Label>
                    <Select
                      onValueChange={(value) => handleSelectChange("perfil", value)}
                      value={formData.perfil || ""}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Selecciona un perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        {PERFILES_IMPRESORA.map((perfil) => (
                          <SelectItem key={perfil} value={perfil}>
                            {perfil}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Common fields for all types */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ubicacion" className="text-right">
                  Ubicación
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("ubicacion", value)}
                  value={formData.ubicacion || ""}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona una ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc) => {
                      const displayLoc = `${loc.building}, ${loc.floor}, ${loc.service_area}, ${loc.internal_location}`
                      return (
                        <SelectItem key={loc.id} value={displayLoc}>
                          {displayLoc}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="servicio" className="text-right">
                  Servicio
                </Label>
                <Select
                  onValueChange={(value) => handleSelectChange("servicio", value)}
                  value={formData.servicio || ""}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICIOS.map((servicio) => (
                      <SelectItem key={servicio} value={servicio}>
                        {servicio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Estación field for CPU and Monitor */}
              {(selectedEquipoType === "CPU" || selectedEquipoType === "Monitor") && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="estacionAsignada" className="text-right">
                    Estación Asignada
                  </Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("estacionAsignada", value)}
                    value={formData.estacionAsignada || ""}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Selecciona o crea una estación" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTACIONES_EXISTENTES.map((estacion) => (
                        <SelectItem key={estacion} value={estacion}>
                          {estacion}
                        </SelectItem>
                      ))}
                      <SelectItem value="nueva_estacion">
                        <span className="font-semibold text-blue-500">Crear nueva estación...</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {isAddingNewStation && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="newStationName" className="text-right">
                    Nombre Nueva Estación
                  </Label>
                  <Input
                    id="newStationName"
                    value={newStationName}
                    onChange={(e) => setNewStationName(e.target.value)}
                    className="col-span-3"
                    placeholder="Ej. Quirófano-03"
                  />
                </div>
              )}
            </>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {initialData ? "Guardar Cambios" : "Agregar Equipo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
