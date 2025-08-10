"use client"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, Save } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox" // Import Checkbox
import { useToast } from "@/components/ui/use-toast" // Import useToast

interface AddEstacionModalProps {
  isOpen: boolean
  onClose: () => void
  onAddEstacion: (estacion: any) => void
  availableCPUs: { id: string; marca: string; modelo: string }[]
  availableMonitors: { id: string; marca: string; modelo: string }[]
  initialData?: any // For editing
}

type EstacionEstado = "Activa" | "Inactiva" | "En Mantenimiento" | "De Baja"

// Mock Catalogs (re-using from equipos-content for consistency)
const RESPONSABLES = ["Dr. Juan Pérez", "Lic. Ana García", "Enf. María López", "Ing. Carlos Ruiz"]
const UBICACIONES = [
  "Edificio Principal, 1er Piso, Urgencias-01",
  "Edificio Principal, 2do Piso, Laboratorio-03",
  "Edificio Anexo, Planta Baja, Administración",
  "Edificio Principal, 3er Piso, Radiología-05",
  "Edificio Principal, 1er Piso, Farmacia",
  "Oficina TI-01",
]
const SERVICIOS = ["Urgencias", "Laboratorio", "Administración", "Radiología", "Farmacia", "TI"]
const ESTADOS_ESTACION: EstacionEstado[] = ["Activa", "Inactiva", "En Mantenimiento", "De Baja"]

const ACCESORIOS_DISPONIBLES = [
  "Cable de Red",
  "Mouse",
  "Cable de Corriente",
  "Teclado",
  "Office (Licencia)",
  "Webcam",
  "Auriculares",
  "Adaptador HDMI",
]

export default function AddEstacionModal({
  isOpen,
  onClose,
  onAddEstacion,
  availableCPUs,
  availableMonitors,
  initialData,
}: AddEstacionModalProps) {
  const [formData, setFormData] = useState<any>({
    cpuId: "",
    monitorId: "",
    responsable: "",
    servicio: "",
    ubicacion: "",
    estado: "",
    accesorios: [],
  })
  const { toast } = useToast() // Initialize useToast

  useEffect(() => {
    if (initialData) {
      setFormData({
        cpuId: initialData.cpu.id,
        monitorId: initialData.monitor.id,
        responsable: initialData.responsable,
        servicio: initialData.servicio,
        ubicacion: initialData.ubicacion,
        estado: initialData.estado,
        accesorios: initialData.accesorios || [],
      })
    } else {
      setFormData({
        cpuId: "",
        monitorId: "",
        responsable: "",
        servicio: "",
        ubicacion: "",
        estado: "",
        accesorios: [],
      })
    }
  }, [initialData, isOpen])

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }))
  }

  const handleAccessoryChange = (accessory: string, checked: boolean) => {
    setFormData((prev: any) => {
      const currentAccesorios = prev.accesorios || []
      if (checked) {
        return { ...prev, accesorios: [...currentAccesorios, accessory] }
      } else {
        return { ...prev, accesorios: currentAccesorios.filter((a: string) => a !== accessory) }
      }
    })
  }

  const handleSubmit = () => {
    const selectedCpu = availableCPUs.find((cpu) => cpu.id === formData.cpuId)
    const selectedMonitor = availableMonitors.find((monitor) => monitor.id === formData.monitorId)

    if (!selectedCpu || !selectedMonitor) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un CPU y un Monitor válidos.",
        variant: "destructive",
      })
      return
    }

    const newEstacion = {
      id:
        initialData?.id ||
        `EST${Math.floor(Math.random() * 1000)
          .toString()
          .padStart(3, "0")}`,
      cpu: selectedCpu,
      monitor: selectedMonitor,
      responsable: formData.responsable,
      servicio: formData.servicio,
      ubicacion: formData.ubicacion,
      estado: formData.estado,
      accesorios: formData.accesorios,
    }
    onAddEstacion(newEstacion) // This function now handles both add and edit
    resetForm()
    onClose()
    toast({
      title: "Éxito",
      description: initialData ? "Estación actualizada correctamente." : "Estación creada correctamente.",
      variant: "success",
    })
  }

  const resetForm = () => {
    setFormData({
      cpuId: "",
      monitorId: "",
      responsable: "",
      servicio: "",
      ubicacion: "",
      estado: "",
      accesorios: [],
    })
  }

  const isFormValid =
    formData.cpuId &&
    formData.monitorId &&
    formData.responsable &&
    formData.servicio &&
    formData.ubicacion &&
    formData.estado

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (open ? null : onClose())}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Editar Estación" : "Agregar Nueva Estación"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cpuId" className="text-right">
              CPU Principal
            </Label>
            <Select onValueChange={(value) => handleSelectChange("cpuId", value)} value={formData.cpuId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un CPU" />
              </SelectTrigger>
              <SelectContent>
                {availableCPUs.map((cpu) => (
                  <SelectItem key={cpu.id} value={cpu.id}>
                    {cpu.id} ({cpu.marca} {cpu.modelo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="monitorId" className="text-right">
              Monitor Secundario
            </Label>
            <Select onValueChange={(value) => handleSelectChange("monitorId", value)} value={formData.monitorId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un Monitor" />
              </SelectTrigger>
              <SelectContent>
                {availableMonitors.map((monitor) => (
                  <SelectItem key={monitor.id} value={monitor.id}>
                    {monitor.id} ({monitor.marca} {monitor.modelo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="responsable" className="text-right">
              Responsable
            </Label>
            <Select onValueChange={(value) => handleSelectChange("responsable", value)} value={formData.responsable}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un responsable" />
              </SelectTrigger>
              <SelectContent>
                {RESPONSABLES.map((resp) => (
                  <SelectItem key={resp} value={resp}>
                    {resp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="servicio" className="text-right">
              Servicio
            </Label>
            <Select onValueChange={(value) => handleSelectChange("servicio", value)} value={formData.servicio}>
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

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ubicacion" className="text-right">
              Ubicación
            </Label>
            <Select onValueChange={(value) => handleSelectChange("ubicacion", value)} value={formData.ubicacion}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona una ubicación" />
              </SelectTrigger>
              <SelectContent>
                {UBICACIONES.map((ubicacion) => (
                  <SelectItem key={ubicacion} value={ubicacion}>
                    {ubicacion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="estado" className="text-right">
              Estado de la Estación
            </Label>
            <Select onValueChange={(value) => handleSelectChange("estado", value)} value={formData.estado}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS_ESTACION.map((estado) => (
                  <SelectItem key={estado} value={estado}>
                    {estado}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Accesorios</Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              {ACCESORIOS_DISPONIBLES.map((accessory) => (
                <div key={accessory} className="flex items-center space-x-2">
                  <Checkbox
                    id={`acc-${accessory}`}
                    checked={formData.accesorios.includes(accessory)}
                    onCheckedChange={(checked) => handleAccessoryChange(accessory, checked as boolean)}
                  />
                  <label
                    htmlFor={`acc-${accessory}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {accessory}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!isFormValid}>
            {initialData ? <Save className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />}
            {initialData ? "Guardar Cambios" : "Crear Estación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
