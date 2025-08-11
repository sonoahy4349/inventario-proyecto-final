"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2, Search, HardDrive, Laptop, Printer, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import AddEquipoModal from "./add-equipo-modal"
import ResguardosModal from "./resguardos-modal"
import { useToast } from "@/components/ui/use-toast"
import {
  getPopulatedEquipos,
  getEquipmentTypes,
  getEquipmentStatuses,
  getLocations,
  getResponsables,
  deleteEquipo,
} from "@/lib/supabase/queries"
import type { PopulatedEquipo, EquipmentTypeDB, EquipmentStatusDB, LocationDB, ResponsableDB } from "@/lib/types"

type FilterTab = "todos" | "cpu_monitor" | "laptop" | "impresora"

export default function EquiposContent() {
  const [equipos, setEquipos] = useState<PopulatedEquipo[]>([])
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentTypeDB[]>([])
  const [equipmentStatuses, setEquipmentStatuses] = useState<EquipmentStatusDB[]>([])
  const [locations, setLocations] = useState<LocationDB[]>([])
  const [responsables, setResponsables] = useState<ResponsableDB[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<FilterTab>("todos")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isResguardosModalOpen, setIsResguardosModalOpen] = useState(false)
  const [selectedItemForResguardos, setSelectedItemForResguardos] = useState<PopulatedEquipo | null>(null)
  const [editingEquipo, setEditingEquipo] = useState<PopulatedEquipo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { toast } = useToast()

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [equiposData, typesData, statusesData, locationsData, responsablesData] = await Promise.all([
        getPopulatedEquipos(),
        getEquipmentTypes(),
        getEquipmentStatuses(),
        getLocations(),
        getResponsables(),
      ])

      if (equiposData) setEquipos(equiposData)
      if (typesData) setEquipmentTypes(typesData)
      if (statusesData) setEquipmentStatuses(statusesData)
      if (locationsData) setLocations(locationsData)
      if (responsablesData) setResponsables(responsablesData)
    } catch (error) {
      console.error("Error loading data:", error)
      toast({
        title: "Error",
        description: "Error al cargar los datos. Por favor, recarga la página.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

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
        return equipo.assigned_station?.id || "N/A"
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
      const success = await deleteEquipo(id)
      if (success) {
        setEquipos((prev) => prev.filter((equipo) => equipo.id !== id))
        toast({
          title: "Éxito",
          description: `Equipo ${displayId} eliminado correctamente.`,
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: "Error al eliminar el equipo.",
          variant: "destructive",
        })
      }
    }
  }

  const handleAddOrUpdateEquipo = async (equipoData: any) => {
    // Reload data after successful operation
    await loadData()
    toast({
      title: "Éxito",
      description: editingEquipo ? "Equipo actualizado correctamente." : "Equipo agregado correctamente.",
      variant: "default",
    })
  }

  const handleOpenResguardos = (item: PopulatedEquipo) => {
    setSelectedItemForResguardos(item)
    setIsResguardosModalOpen(true)
  }

  const headers = getTableHeaders()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventario</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando equipos...</p>
          </div>
        </div>
      </div>
    )
  }

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
        equipmentTypes={equipmentTypes}
        equipmentStatuses={equipmentStatuses}
        locations={locations}
        responsables={responsables}
      />
      <ResguardosModal
        isOpen={isResguardosModalOpen}
        onClose={() => setIsResguardosModalOpen(false)}
        selectedItemData={selectedItemForResguardos}
      />
    </div>
  )
}
