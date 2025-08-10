// lib/supabase/queries.ts
import { createClient } from "./client"
import type {
  Equipo,
  Estacion,
  PopulatedEquipo,
  PopulatedEstacion,
  ResponsableDB,
  LocationDB,
  EquipmentTypeDB,
  EquipmentStatusDB,
  PrinterDetailsDB,
  Resguardo,
  AdministrativeDepartmentDB,
} from "@/lib/types"

const supabase = createClient()

// =====================================================
// CATÁLOGOS - Funciones de lectura
// =====================================================

export async function getEquipmentTypes(): Promise<EquipmentTypeDB[] | null> {
  const { data, error } = await supabase
    .from("equipment_types")
    .select("*")
    .order("name")
  
  if (error) {
    console.error("Error fetching equipment types:", error)
    return null
  }
  return data
}

export async function getEquipmentStatuses(): Promise<EquipmentStatusDB[] | null> {
  const { data, error } = await supabase
    .from("equipment_status")
    .select("*")
    .order("name")
  
  if (error) {
    console.error("Error fetching equipment statuses:", error)
    return null
  }
  return data
}

export async function getLocations(): Promise<LocationDB[] | null> {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("building, floor, service_area, internal_location")
  
  if (error) {
    console.error("Error fetching locations:", error)
    return null
  }
  return data
}

export async function getResponsables(): Promise<ResponsableDB[] | null> {
  const { data, error } = await supabase
    .from("responsables")
    .select("*")
    .order("full_name")
  
  if (error) {
    console.error("Error fetching responsables:", error)
    return null
  }
  return data
}

export async function getAdministrativeDepartments(): Promise<AdministrativeDepartmentDB[] | null> {
  const { data, error } = await supabase
    .from("administrative_departments")
    .select("*")
    .eq("status", "Activa")
    .order("name")
  
  if (error) {
    console.error("Error fetching administrative departments:", error)
    return null
  }
  return data
}

// =====================================================
// EQUIPOS - Funciones principales
// =====================================================

export async function getPopulatedEquipos(): Promise<PopulatedEquipo[] | null> {
  const { data, error } = await supabase.from("equipment").select(`
    *,
    equipment_type:equipment_types(id, name, description),
    current_status:equipment_status(id, name, description),
    current_location:locations(id, building, floor, service_area, internal_location, description),
    current_responsible:responsables(id, full_name, phone, email),
    printer_details:printer_details(equipment_id, profile, printer_type)
  `).order("display_id")
  
  if (error) {
    console.error("Error fetching populated equipos:", error)
    return null
  }

  // Mapear los datos al formato PopulatedEquipo
  const populatedData: PopulatedEquipo[] = data.map((item: any) => ({
    id: item.id,
    display_id: item.display_id,
    brand: item.brand,
    model: item.model,
    serial_number: item.serial_number,
    purchase_date: item.purchase_date,
    warranty_end_date: item.warranty_end_date,
    notes: item.notes,
    created_at: item.created_at,
    updated_at: item.updated_at,
    equipment_type: item.equipment_type,
    current_status: item.current_status,
    current_location: item.current_location,
    current_responsible: item.current_responsible,
    assigned_station: item.assigned_station_id ? { id: item.assigned_station_id } : undefined,
    printer_details: item.printer_details && item.printer_details.length > 0 ? item.printer_details[0] : undefined,
  }))

  return populatedData
}

export async function getPopulatedEquipoById(id: string): Promise<PopulatedEquipo | null> {
  const { data, error } = await supabase
    .from("equipment")
    .select(`
      *,
      equipment_type:equipment_types(id, name, description),
      current_status:equipment_status(id, name, description),
      current_location:locations(id, building, floor, service_area, internal_location, description),
      current_responsible:responsables(id, full_name, phone, email),
      printer_details:printer_details(equipment_id, profile, printer_type)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching populated equipo by ID:", error)
    return null
  }

  const populatedData: PopulatedEquipo = {
    id: data.id,
    display_id: data.display_id,
    brand: data.brand,
    model: data.model,
    serial_number: data.serial_number,
    purchase_date: data.purchase_date,
    warranty_end_date: data.warranty_end_date,
    notes: data.notes,
    created_at: data.created_at,
    updated_at: data.updated_at,
    equipment_type: data.equipment_type,
    current_status: data.current_status,
    current_location: data.current_location,
    current_responsible: data.current_responsible,
    assigned_station: data.assigned_station_id ? { id: data.assigned_station_id } : undefined,
    printer_details: data.printer_details && data.printer_details.length > 0 ? data.printer_details[0] : undefined,
  }

  return populatedData
}

export async function insertEquipo(equipoData: {
  equipment_type_id: string
  brand: string
  model: string
  serial_number: string
  current_status_id: string
  current_location_id: string
  current_responsible_id?: string
  purchase_date?: string
  warranty_end_date?: string
  notes?: string
}): Promise<{ data: Equipo | null; error: any }> {
  
  const { data, error } = await supabase
    .from("equipment")
    .insert(equipoData)
    .select()
    .single()
  
  if (error) {
    console.error("Error inserting equipo:", error)
    return { data: null, error }
  }
  
  return { data, error: null }
}

export async function updateEquipo(
  id: string,
  equipoData: Partial<{
    brand: string
    model: string
    serial_number: string
    current_status_id: string
    current_location_id: string
    current_responsible_id: string
    purchase_date: string
    warranty_end_date: string
    notes: string
  }>
): Promise<{ data: Equipo | null; error: any }> {
  
  const { data, error } = await supabase
    .from("equipment")
    .update(equipoData)
    .eq("id", id)
    .select()
    .single()
  
  if (error) {
    console.error("Error updating equipo:", error)
    return { data: null, error }
  }
  
  return { data, error: null }
}

export async function deleteEquipo(id: string): Promise<{ success: boolean; error: any }> {
  const { error } = await supabase
    .from("equipment")
    .delete()
    .eq("id", id)
  
  if (error) {
    console.error("Error deleting equipo:", error)
    return { success: false, error }
  }
  
  return { success: true, error: null }
}

// =====================================================
// ESTACIONES - Funciones principales
// =====================================================

export async function getPopulatedStations(): Promise<PopulatedEstacion[] | null> {
  const { data, error } = await supabase.from("stations").select(`
    *,
    cpu:equipment!cpu_id(id, display_id, brand, model, serial_number, equipment_type_id, current_status_id, current_location_id, current_responsible_id),
    monitor:equipment!monitor_id(id, display_id, brand, model, serial_number, equipment_type_id, current_status_id, current_location_id, current_responsible_id),
    current_responsible:responsables(id, full_name, phone, email),
    current_location:locations(id, building, floor, service_area, internal_location, description),
    station_status:equipment_status(id, name, description),
    accessories:station_accessories(accessory_name)
  `).order("display_id")
  
  if (error) {
    console.error("Error fetching populated stations:", error)
    return null
  }

  // Mapear los datos al formato PopulatedEstacion
  const populatedData: PopulatedEstacion[] = data.map((item: any) => ({
    id: item.id,
    display_id: item.display_id,
    name: item.name,
    created_at: item.created_at,
    updated_at: item.updated_at,
    cpu: item.cpu,
    monitor: item.monitor,
    current_responsible: item.current_responsible,
    current_location: item.current_location,
    station_status: item.station_status,
    accessories: item.accessories.map((acc: { accessory_name: string }) => acc.accessory_name),
  }))

  return populatedData
}

export async function insertStation(stationData: {
  name: string
  cpu_id: string
  monitor_id: string
  current_responsible_id: string
  current_location_id: string
  station_status_id: string
  accessories?: string[]
}): Promise<{ data: any | null; error: any }> {
  
  const { data, error } = await supabase
    .from("stations")
    .insert({
      name: stationData.name,
      cpu_id: stationData.cpu_id,
      monitor_id: stationData.monitor_id,
      current_responsible_id: stationData.current_responsible_id,
      current_location_id: stationData.current_location_id,
      station_status_id: stationData.station_status_id,
    })
    .select()
    .single()
  
  if (error) {
    console.error("Error inserting station:", error)
    return { data: null, error }
  }

  // Insertar accesorios si existen
  if (stationData.accessories && stationData.accessories.length > 0) {
    const accessoryInserts = stationData.accessories.map(accessory => ({
      station_id: data.id,
      accessory_name: accessory
    }))
    
    const { error: accessoryError } = await supabase
      .from("station_accessories")
      .insert(accessoryInserts)
    
    if (accessoryError) {
      console.error("Error inserting station accessories:", accessoryError)
    }
  }
  
  return { data, error: null }
}

export async function updateStation(
  id: string,
  stationData: Partial<{
    name: string
    current_responsible_id: string
    current_location_id: string
    station_status_id: string
    accessories: string[]
  }>
): Promise<{ data: any | null; error: any }> {
  
  const { data, error } = await supabase
    .from("stations")
    .update({
      name: stationData.name,
      current_responsible_id: stationData.current_responsible_id,
      current_location_id: stationData.current_location_id,
      station_status_id: stationData.station_status_id,
    })
    .eq("id", id)
    .select()
    .single()
  
  if (error) {
    console.error("Error updating station:", error)
    return { data: null, error }
  }

  // Actualizar accesorios si se proporcionan
  if (stationData.accessories !== undefined) {
    // Eliminar accesorios existentes
    await supabase
      .from("station_accessories")
      .delete()
      .eq("station_id", id)
    
    // Insertar nuevos accesorios
    if (stationData.accessories.length > 0) {
      const accessoryInserts = stationData.accessories.map(accessory => ({
        station_id: id,
        accessory_name: accessory
      }))
      
      const { error: accessoryError } = await supabase
        .from("station_accessories")
        .insert(accessoryInserts)
      
      if (accessoryError) {
        console.error("Error updating station accessories:", accessoryError)
      }
    }
  }
  
  return { data, error: null }
}

export async function deleteStation(id: string): Promise<{ success: boolean; error: any }> {
  const { error } = await supabase
    .from("stations")
    .delete()
    .eq("id", id)
  
  if (error) {
    console.error("Error deleting station:", error)
    return { success: false, error }
  }
  
  return { success: true, error: null }
}

// =====================================================
// IMPRESORAS - Funciones específicas
// =====================================================

export async function insertPrinterDetails(printerData: {
  equipment_id: string
  profile?: string
  printer_type?: string
}): Promise<{ data: any | null; error: any }> {
  
  const { data, error } = await supabase
    .from("printer_details")
    .insert(printerData)
    .select()
    .single()
  
  if (error) {
    console.error("Error inserting printer details:", error)
    return { data: null, error }
  }
  
  return { data, error: null }
}

export async function updatePrinterDetails(
  equipment_id: string,
  printerData: {
    profile?: string
    printer_type?: string
  }
): Promise<{ data: any | null; error: any }> {
  
  const { data, error } = await supabase
    .from("printer_details")
    .update(printerData)
    .eq("equipment_id", equipment_id)
    .select()
    .single()
  
  if (error) {
    console.error("Error updating printer details:", error)
    return { data: null, error }
  }
  
  return { data, error: null }
}

// =====================================================
// RESGUARDOS - Funciones
// =====================================================

export async function getAllResguardos(): Promise<Resguardo[] | null> {
  const { data, error } = await supabase
    .from("resguardos")
    .select("*")
    .order("created_at", { ascending: false })
  
  if (error) {
    console.error("Error fetching all resguardos:", error)
    return null
  }
  return data
}

export async function getResguardosByItemId(itemId: string): Promise<Resguardo[] | null> {
  const { data, error } = await supabase
    .from("resguardos")
    .select("*")
    .or(`equipment_id.eq.${itemId},station_id.eq.${itemId}`)
    .order("created_at", { ascending: false })
  
  if (error) {
    console.error("Error fetching resguardos by item ID:", error)
    return null
  }
  return data
}

export async function insertResguardo(resguardoData: {
  resguardo_type: string
  equipment_id?: string
  station_id?: string
  document_url?: string
  is_signed?: boolean
}): Promise<{ data: Resguardo | null; error: any }> {
  
  const { data, error } = await supabase
    .from("resguardos")
    .insert(resguardoData)
    .select()
    .single()
  
  if (error) {
    console.error("Error inserting resguardo:", error)
    return { data: null, error }
  }
  
  return { data, error: null }
}

// =====================================================
// FUNCIONES DE UTILIDAD
// =====================================================

export async function getAvailableCPUs(): Promise<any[] | null> {
  const { data, error } = await supabase
    .from("equipment")
    .select(`
      *,
      equipment_type:equipment_types(name)
    `)
    .eq("equipment_types.name", "CPU")
    .eq("current_status.name", "Disponible")
    .is("assigned_station_id", null)
  
  if (error) {
    console.error("Error fetching available CPUs:", error)
    return null
  }
  return data
}

export async function getAvailableMonitors(): Promise<any[] | null> {
  const { data, error } = await supabase
    .from("equipment")
    .select(`
      *,
      equipment_type:equipment_types(name)
    `)
    .eq("equipment_types.name", "Monitor")
    .eq("current_status.name", "Disponible")
    .is("assigned_station_id", null)
  
  if (error) {
    console.error("Error fetching available monitors:", error)
    return null
  }
  return data
}

// =====================================================
// FUNCIONES DE ESTADÍSTICAS
// =====================================================

export async function getEquipmentStats(): Promise<{
  total: number
  by_type: { type: string; count: number }[]
  by_status: { status: string; count: number }[]
} | null> {
  
  const { data: totalData, error: totalError } = await supabase
    .from("equipment")
    .select("id", { count: "exact" })
  
  if (totalError) {
    console.error("Error fetching equipment total:", totalError)
    return null
  }

  const { data: byTypeData, error: byTypeError } = await supabase
    .from("equipment")
    .select(`
      equipment_type:equipment_types(name),
      count:id
    `)
  
  if (byTypeError) {
    console.error("Error fetching equipment by type:", byTypeError)
    return null
  }

  const { data: byStatusData, error: byStatusError } = await supabase
    .from("equipment")
    .select(`
      current_status:equipment_status(name),
      count:id
    `)
  
  if (byStatusError) {
    console.error("Error fetching equipment by status:", byStatusError)
    return null
  }

  return {
    total: totalData?.length || 0,
    by_type: [], // Procesar datos agregados
    by_status: [], // Procesar datos agregados
  }
}