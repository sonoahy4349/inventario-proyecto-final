"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2, Search, HardDrive, Laptop, Printer, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import AddEquipoModal from "./add-equipo-modal"
import ResguardosModal from "./resguardos-modal"
import { useToast } from "@/components/ui/use-toast"

// Datos simulados
const MOCK_EQUIPMENT_TYPES = [
  {
    id: "1",
    name: "CPU",
    description: "Unidad Central de Procesamiento",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Monitor",
    description: "Monitor de computadora",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "Laptop",
    description: "Computadora portátil",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Impresora",
    description: "Impresora",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

const MOCK_EQUIPMENT_STATUSES = [
  {
    id: "1",
    name: "Activo",
    description: "Equipo en funcionamiento",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "En Reparación",
    description: "Equipo en mantenimiento",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "De Baja",
    description: "Equipo dado de baja",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    name: "Disponible",
    description: "Equipo disponible para asignación",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

const MOCK_LOCATIONS = [
  {
    id: "0",
    building: "Edificio Principal",
    floor: "Planta Baja",
    service_area: "Almacén TI",
    internal_location: "Almacén Principal",
    description: "Almacén de Tecnologías de la Información",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "1",
    building: "Edificio A",
    floor: "Planta Baja",
    service_area: "Urgencias",
    internal_location: "Consultorio 1",
    description: "Consultorio de urgencias",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    building: "Edificio A",
    floor: "Primer Piso",
    service_area: "Laboratorio",
    internal_location: "Lab Principal",
    description: "Laboratorio principal",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    building: "Edificio B",
    floor: "Segundo Piso",
    service_area: "Administración",
    internal_location: "Oficina 201",
    description: "Oficina administrativa",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

const MOCK_RESPONSABLES = [
  {
    id: "0",
    full_name: "N/A",
    phone: null,
    email: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "1",
    full_name: "Dr. Juan Pérez",
    phone: "555-0001",
    email: "juan.perez@hospital.com",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    full_name: "Lic. María García",
    phone: "555-0002",
    email: "maria.garcia@hospital.com",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    full_name: "Ing. Carlos López",
    phone: "555-0003",
    email: "carlos.lopez@hospital.com",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

const MOCK_EQUIPOS = [
  {
    id: "1",
    display_id: "CPU001",
    brand: "Dell",
    model: "OptiPlex 7090",
    serial_number: "DL123456789",
    equipment_type: MOCK_EQUIPMENT_TYPES[0],
    current_status: MOCK_EQUIPMENT_STATUSES[0],
    current_location: MOCK_LOCATIONS[1],
    current_responsible: MOCK_RESPONSABLES[1],
    assigned_station: null,
    printer_details: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    display_id: "MON001",
    brand: "Samsung",
    model: "24 inch LED",
    serial_number: "SM987654321",
    equipment_type: MOCK_EQUIPMENT_TYPES[1],
    current_status: MOCK_EQUIPMENT_STATUSES[0],
    current_location: MOCK_LOCATIONS[1],
    current_responsible: MOCK_RESPONSABLES[1],
    assigned_station: null,
    printer_details: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    display_id: "LAP001",
    brand: "HP",
    model: "EliteBook 840",
    serial_number: "HP456789123",
    equipment_type: MOCK_EQUIPMENT_TYPES[2],
    current_status: MOCK_EQUIPMENT_STATUSES[0],
    current_location: MOCK_LOCATIONS[2],
    current_responsible: MOCK_RESPONSABLES[2],
    assigned_station: null,
    printer_details: null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    display_id: "IMP001",
    brand: "Epson",
    model: "EcoTank L3250",
    serial_number: "EP789123456",
    equipment_type: MOCK_EQUIPMENT_TYPES[3],
    current_status: MOCK_EQUIPMENT_STATUSES[0],
    current_location: MOCK_LOCATIONS[3],
    current_responsible: MOCK_RESPONSABLES[3],
    assigned_station: null,
    printer_details: {
      equipment_id: "4",
      profile: "Color",
      printer_type: "Inyección de Tinta",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
]

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

interface PrinterDetailsDB {
  equipment_id: string
  profile?: string
  printer_type?: string
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
  printer_details?: PrinterDetailsDB | null
  created_at: string
  updated_at: string
}

type FilterTab = "todos" | "cpu_monitor" | "laptop" | "impresora"

export default function EquiposContent() {
  const [equipos, setEquipos] = useState<PopulatedEquipo[]>(MOCK_EQUIPOS)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<FilterTab>("todos")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isResguardosModalOpen, setIsResguardosModalOpen] = useState(false)
  const [selectedItemForResguardos, setSelectedItemForResguardos] = useState<PopulatedEquipo | null>(null)
  const [editingEquipo, setEditingEquipo] = useState<PopulatedEquipo | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()

  const filteredEquipos = useMemo(() => {
    let currentEquipos = equipos

    if (activeTab === "cpu_monitor") {
      currentEquipos = equipos.filter((e) => e.equipment_type?.name === "CPU" || e.equipment_type?.name === "Monitor")
    } else if (activeTab === "laptop") {
      currentEquipos = equipos.filter((e) => e.equipment_type?.name === "Laptop")
    } else if (activeTab === "impresora") {
      currentEquipos = equipos.filter((e) => e.equipment_type?.name === "Impresora")
    }

    return currentEquipos.filter((equipo) =>
      Object.values(equipo).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase())),
    )
  }, [equipos, searchTerm, activeTab])

  const getTableHeaders = () => {
    const commonHeaders = ["ID", "Tipo", "Marca", "Modelo", "No. de Serie"]
    const actionsHeader = "Acciones"
    const resguardosHeader = "Resguardos"

    switch (activeTab) {
      case "cpu_monitor":
      case "todos":
        return [
          ...commonHeaders,
          "Estado",
          "Estación Asignada",
          "Responsable",
          "Ubicación",
          "Servicio",
          resguardosHeader,
          actionsHeader,
        ]
      case "laptop":
        return [
          ...commonHeaders,
          "Estado",
          "Responsable",
          "Dirección",
          "Ubicación",
          "Servicio",
          resguardosHeader,
          actionsHeader,
        ]
      case "impresora":
        return [
          ...commonHeaders,
          "Dirección",
          "Ubicación",
          "Perfil",
          "Tipo (Impresora)",
          "Servicio",
          resguardosHeader,
          actionsHeader,
        ]
      default:
        return []
    }
  }

  const renderTableCell = (equipo: PopulatedEquipo, header: string) => {
    switch (header) {
      case "ID":
        return equipo.display_id
      case "Tipo":
        return equipo.equipment_type?.name || "N/A"
      case "Marca":
        return equipo.brand
      case "Modelo":
        return equipo.model
      case "No. de Serie":
        return equipo.serial_number
      case "Estado":
        return equipo.current_status?.name || "N/A"
      case "Estación Asignada":
        return equipo.assigned_station?.display_id || "N/A"
      case "Responsable":
        return equipo.current_responsible?.full_name || "N/A"
      case "Ubicación":
        return (
          `${equipo.current_location?.building || ""} ${equipo.current_location?.floor || ""}, ${equipo.current_location?.service_area || ""}, ${equipo.current_location?.internal_location || ""}`.trim() ||
          "N/A"
        )
      case "Servicio":
        return equipo.current_location?.service_area || "N/A"
      case "Perfil":
        return equipo.printer_details?.profile || "N/A"
      case "Tipo (Impresora)":
        return equipo.printer_details?.printer_type || "N/A"
      case "Dirección":
        return equipo.current_location?.service_area || "N/A"
      case "Resguardos":
        if (equipo.equipment_type?.name === "Laptop" || equipo.equipment_type?.name === "Impresora") {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenResguardos(equipo)}
              aria-label={`Abrir resguardos para ${equipo.equipment_type?.name} ${equipo.model}`}
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Abrir
            </Button>
          )
        }
        return "N/A"
      case "Acciones":
        return (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openEditModal(equipo)}
              aria-label={`Editar ${equipo.equipment_type?.name} ${equipo.model}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(equipo.id, equipo.display_id)}
              aria-label={`Eliminar ${equipo.equipment_type?.name} ${equipo.model}`}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )
      default:
        return "N/A"
    }
  }

  const openEditModal = (equipo: PopulatedEquipo) => {
    setEditingEquipo(equipo)
    setIsAddModalOpen(true)
  }

  const handleDelete = async (id: string, displayId: string) => {
    if (confirm(`¿Estás seguro de que quieres eliminar el equipo ${displayId}?`)) {
      setEquipos((prev) => prev.filter((equipo) => equipo.id !== id))
      toast({
        title: "Éxito",
        description: `Equipo ${displayId} eliminado correctamente.`,
        variant: "default",
      })
    }
  }

  const handleAddOrUpdateEquipo = async (equipoData: any) => {
    const {
      id,
      display_id,
      tipo,
      marca,
      modelo,
      noSerie,
      estado,
      responsable,
      ubicacion,
      servicio,
      estacionAsignada,
      tipoImpresora,
      perfil,
    } = equipoData

    // Find objects for selected names
    const equipmentType = MOCK_EQUIPMENT_TYPES.find((t) => t.name === tipo)
    const status = MOCK_EQUIPMENT_STATUSES.find((s) => s.name === estado)
    const location = MOCK_LOCATIONS.find(
      (l) => `${l.building}, ${l.floor}, ${l.service_area}, ${l.internal_location}` === ubicacion,
    )
    const responsible = MOCK_RESPONSABLES.find((r) => r.full_name === responsable)

    if (!equipmentType || !status || !location) {
      toast({
        title: "Error de datos",
        description: "No se pudieron encontrar los datos seleccionados.",
        variant: "destructive",
      })
      return
    }

    const newEquipo: PopulatedEquipo = {
      id: editingEquipo ? editingEquipo.id : (equipos.length + 1).toString(),
      display_id: display_id,
      brand: marca,
      model: modelo,
      serial_number: noSerie,
      equipment_type: equipmentType,
      current_status: status,
      current_location: location,
      current_responsible: responsible,
      assigned_station: null,
      printer_details:
        tipo === "Impresora"
          ? {
              equipment_id: editingEquipo ? editingEquipo.id : (equipos.length + 1).toString(),
              profile: perfil,
              printer_type: tipoImpresora,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : null,
      created_at: editingEquipo ? editingEquipo.created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (editingEquipo) {
      setEquipos((prev) => prev.map((equipo) => (equipo.id === editingEquipo.id ? newEquipo : equipo)))
      toast({
        title: "Éxito",
        description: "Equipo actualizado correctamente.",
        variant: "default",
      })
    } else {
      setEquipos((prev) => [...prev, newEquipo])
      toast({
        title: "Éxito",
        description: "Equipo agregado correctamente.",
        variant: "default",
      })
    }
  }

  const handleOpenResguardos = (item: PopulatedEquipo) => {
    setSelectedItemForResguardos(item)
    setIsResguardosModalOpen(true)
  }

  const headers = getTableHeaders()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventario</h1>
      <p className="text-muted-foreground">Gestión de equipos en el inventario del hospital</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={activeTab === "todos" ? "default" : "outline"}
          onClick={() => setActiveTab("todos")}
          className={cn(activeTab === "todos" && "bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900")}
        >
          Todos los equipos
        </Button>
        <Button
          variant={activeTab === "cpu_monitor" ? "default" : "outline"}
          onClick={() => setActiveTab("cpu_monitor")}
          className={cn(activeTab === "cpu_monitor" && "bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900")}
        >
          <HardDrive className="mr-2 h-4 w-4" /> CPU y Monitores
        </Button>
        <Button
          variant={activeTab === "laptop" ? "default" : "outline"}
          onClick={() => setActiveTab("laptop")}
          className={cn(activeTab === "laptop" && "bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900")}
        >
          <Laptop className="mr-2 h-4 w-4" /> Laptops
        </Button>
        <Button
          variant={activeTab === "impresora" ? "default" : "outline"}
          onClick={() => setActiveTab("impresora")}
          className={cn(activeTab === "impresora" && "bg-gray-900 text-white dark:bg-gray-50 dark:text-gray-900")}
        >
          <Printer className="mr-2 h-4 w-4" /> Impresoras
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-bold">Lista de Equipos</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o ID"
                className="pl-8 w-[200px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={() => setIsAddModalOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Equipo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{filteredEquipos.length} equipos encontrados</p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {headers.map((header) => (
                    <TableHead key={header}>{header}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEquipos.map((equipo) => (
                  <TableRow key={equipo.id}>
                    {headers.map((header) => (
                      <TableCell key={`${equipo.id}-${header}`}>{renderTableCell(equipo, header)}</TableCell>
                    ))}
                  </TableRow>
                ))}
                {filteredEquipos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={headers.length} className="text-center text-muted-foreground">
                      No se encontraron equipos.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddEquipoModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingEquipo(null)
        }}
        onSave={handleAddOrUpdateEquipo}
        initialData={editingEquipo}
        equipmentTypes={MOCK_EQUIPMENT_TYPES}
        equipmentStatuses={MOCK_EQUIPMENT_STATUSES}
        locations={MOCK_LOCATIONS}
        responsables={MOCK_RESPONSABLES}
      />
      <ResguardosModal
        isOpen={isResguardosModalOpen}
        onClose={() => setIsResguardosModalOpen(false)}
        selectedItemData={selectedItemForResguardos}
      />
    </div>
  )
}
