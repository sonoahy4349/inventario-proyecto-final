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

// --- Fetching Catalog Data ---

export async function getEquipmentTypes(): Promise<EquipmentTypeDB[] | null> {
  const { data, error } = await supabase.from("equipment_types").select("*").order("name")
  if (error) {
    console.error("Error fetching equipment types:", error)
    return null
  }
  return data
}

export async function getEquipmentStatuses(): Promise<EquipmentStatusDB[] | null> {
  const { data, error } = await supabase.from("equipment_status").select("*").order("name")
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
  const { data, error } = await supabase.from("responsables").select("*").order("full_name")
  if (error) {
    console.error("Error fetching responsables:", error)
    return null
  }
  return data
}

export async function getAdministrativeDepartments(): Promise<AdministrativeDepartmentDB[] | null> {
  const { data, error } = await supabase.from("administrative_departments").select("*").order("name")
  if (error) {
    console.error("Error fetching administrative departments:", error)
    return null
  }
  return data
}

// --- Fetching Populated Equipment and Stations ---

export async function getPopulatedEquipos(): Promise<PopulatedEquipo[] | null> {
  const { data, error } = await supabase
    .from("equipment")
    .select(
      `
      *,
      equipment_type:equipment_types(id, name, description),
      current_status:equipment_status(id, name, description),
      current_location:locations(id, building, floor, service_area, internal_location, description),
      current_responsible:responsables(id, full_name, phone, email),
      printer_details:printer_details(equipment_id, profile, printer_type)
    `,
    )
    .order("display_id")

  if (error) {
    console.error("Error fetching populated equipos:", error)
    return null
  }

  // Map the data to the PopulatedEquipo interface
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

export async function getPopulatedStations(): Promise<PopulatedEstacion[] | null> {
  const { data, error } = await supabase
    .from("stations")
    .select(
      `
      *,
      cpu:equipment!cpu_id(
        id, display_id, brand, model, serial_number,
        equipment_type:equipment_types(id, name, description),
        current_status:equipment_status(id, name, description),
        current_location:locations(id, building, floor, service_area, internal_location, description),
        current_responsible:responsables(id, full_name, phone, email)
      ),
      monitor:equipment!monitor_id(
        id, display_id, brand, model, serial_number,
        equipment_type:equipment_types(id, name, description),
        current_status:equipment_status(id, name, description),
        current_location:locations(id, building, floor, service_area, internal_location, description),
        current_responsible:responsables(id, full_name, phone, email)
      ),
      current_responsible:responsables(id, full_name, phone, email),
      current_location:locations(id, building, floor, service_area, internal_location, description),
      station_status:equipment_status(id, name, description),
      accessories:station_accessories(accessory_name)
    `,
    )
    .order("display_id")

  if (error) {
    console.error("Error fetching populated stations:", error)
    return null
  }

  // Map the data to the PopulatedEstacion interface
  const populatedData: PopulatedEstacion[] = data.map((item: any) => ({
    id: item.id,
    display_id: item.display_id,
    name: item.name,
    created_at: item.created_at,
    updated_at: item.updated_at,
    cpu: {
      id: item.cpu.id,
      display_id: item.cpu.display_id,
      brand: item.cpu.brand,
      model: item.cpu.model,
      serial_number: item.cpu.serial_number,
      equipment_type: item.cpu.equipment_type,
      current_status: item.cpu.current_status,
      current_location: item.cpu.current_location,
      current_responsible: item.cpu.current_responsible,
      created_at: item.cpu.created_at,
      updated_at: item.cpu.updated_at,
    },
    monitor: {
      id: item.monitor.id,
      display_id: item.monitor.display_id,
      brand: item.monitor.brand,
      model: item.monitor.model,
      serial_number: item.monitor.serial_number,
      equipment_type: item.monitor.equipment_type,
      current_status: item.monitor.current_status,
      current_location: item.monitor.current_location,
      current_responsible: item.monitor.current_responsible,
      created_at: item.monitor.created_at,
      updated_at: item.monitor.updated_at,
    },
    current_responsible: item.current_responsible,
    current_location: item.current_location,
    station_status: item.station_status,
    accessories: item.accessories.map((acc: { accessory_name: string }) => acc.accessory_name),
  }))

  return populatedData
}

// --- Get Available Equipment for Stations ---

export async function getAvailableCPUs(): Promise<{ id: string; marca: string; modelo: string }[] | null> {
  const { data, error } = await supabase
    .from("equipment")
    .select(
      `
      id, display_id, brand, model,
      equipment_type:equipment_types(name)
    `,
    )
    .eq("equipment_types.name", "CPU")
    .is("assigned_station_id", null)
    .order("display_id")

  if (error) {
    console.error("Error fetching available CPUs:", error)
    return null
  }

  return data.map((item: any) => ({
    id: item.display_id,
    marca: item.brand,
    modelo: item.model,
  }))
}

export async function getAvailableMonitors(): Promise<{ id: string; marca: string; modelo: string }[] | null> {
  const { data, error } = await supabase
    .from("equipment")
    .select(
      `
      id, display_id, brand, model,
      equipment_type:equipment_types(name)
    `,
    )
    .eq("equipment_types.name", "Monitor")
    .is("assigned_station_id", null)
    .order("display_id")

  if (error) {
    console.error("Error fetching available monitors:", error)
    return null
  }

  return data.map((item: any) => ({
    id: item.display_id,
    marca: item.brand,
    modelo: item.model,
  }))
}

// --- Insert/Update/Delete Operations ---

export async function insertEquipo(
  equipoData: Omit<Equipo, "id" | "created_at" | "updated_at">,
): Promise<Equipo | null> {
  const { data, error } = await supabase.from("equipment").insert(equipoData).select().single()
  if (error) {
    console.error("Error inserting equipo:", error)
    return null
  }
  return data
}

export async function updateEquipo(
  id: string,
  equipoData: Partial<Omit<Equipo, "id" | "created_at" | "updated_at">>,
): Promise<Equipo | null> {
  const { data, error } = await supabase.from("equipment").update(equipoData).eq("id", id).select().single()
  if (error) {
    console.error("Error updating equipo:", error)
    return null
  }
  return data
}

export async function deleteEquipo(id: string): Promise<boolean> {
  const { error } = await supabase.from("equipment").delete().eq("id", id)
  if (error) {
    console.error("Error deleting equipo:", error)
    return false
  }
  return true
}

export async function insertPrinterDetails(
  details: Omit<PrinterDetailsDB, "created_at" | "updated_at">,
): Promise<PrinterDetailsDB | null> {
  const { data, error } = await supabase.from("printer_details").insert(details).select().single()
  if (error) {
    console.error("Error inserting printer details:", error)
    return null
  }
  return data
}

export async function updatePrinterDetails(
  equipmentId: string,
  details: Partial<Omit<PrinterDetailsDB, "equipment_id" | "created_at" | "updated_at">>,
): Promise<PrinterDetailsDB | null> {
  const { data, error } = await supabase
    .from("printer_details")
    .update(details)
    .eq("equipment_id", equipmentId)
    .select()
    .single()
  if (error) {
    console.error("Error updating printer details:", error)
    return null
  }
  return data
}

export async function insertStation(
  stationData: Omit<Estacion, "id" | "created_at" | "updated_at">,
  accessories: string[],
): Promise<Estacion | null> {
  const { data: station, error: stationError } = await supabase.from("stations").insert(stationData).select().single()
  if (stationError) {
    console.error("Error inserting station:", stationError)
    return null
  }

  if (accessories.length > 0) {
    const accessoryInserts = accessories.map((acc) => ({
      station_id: station.id,
      accessory_name: acc,
    }))
    const { error: accessoriesError } = await supabase.from("station_accessories").insert(accessoryInserts)
    if (accessoriesError) {
      console.error("Error inserting station accessories:", accessoriesError)
    }
  }
  return station
}

export async function updateStation(
  id: string,
  stationData: Partial<Omit<Estacion, "id" | "created_at" | "updated_at">>,
  accessories: string[],
): Promise<Estacion | null> {
  const { data: station, error: stationError } = await supabase
    .from("stations")
    .update(stationData)
    .eq("id", id)
    .select()
    .single()
  if (stationError) {
    console.error("Error updating station:", stationError)
    return null
  }

  // Update accessories: delete all existing and re-insert
  const { error: deleteAccessoriesError } = await supabase.from("station_accessories").delete().eq("station_id", id)
  if (deleteAccessoriesError) {
    console.error("Error deleting old station accessories:", deleteAccessoriesError)
  }

  if (accessories.length > 0) {
    const accessoryInserts = accessories.map((acc) => ({
      station_id: id,
      accessory_name: acc,
    }))
    const { error: insertAccessoriesError } = await supabase.from("station_accessories").insert(accessoryInserts)
    if (insertAccessoriesError) {
      console.error("Error inserting new station accessories:", insertAccessoriesError)
    }
  }
  return station
}

export async function deleteStation(id: string): Promise<boolean> {
  const { error } = await supabase.from("stations").delete().eq("id", id)
  if (error) {
    console.error("Error deleting station:", error)
    return false
  }
  return true
}

export async function insertResponsable(
  responsableData: Omit<ResponsableDB, "id" | "created_at" | "updated_at">,
): Promise<ResponsableDB | null> {
  const { data, error } = await supabase.from("responsables").insert(responsableData).select().single()
  if (error) {
    console.error("Error inserting responsable:", error)
    return null
  }
  return data
}

export async function updateResponsable(
  id: string,
  responsableData: Partial<Omit<ResponsableDB, "id" | "created_at" | "updated_at">>,
): Promise<ResponsableDB | null> {
  const { data, error } = await supabase.from("responsables").update(responsableData).eq("id", id).select().single()
  if (error) {
    console.error("Error updating responsable:", error)
    return null
  }
  return data
}

export async function deleteResponsable(id: string): Promise<boolean> {
  const { error } = await supabase.from("responsables").delete().eq("id", id)
  if (error) {
    console.error("Error deleting responsable:", error)
    return false
  }
  return true
}

export async function insertLocation(
  locationData: Omit<LocationDB, "id" | "created_at" | "updated_at">,
): Promise<LocationDB | null> {
  const { data, error } = await supabase.from("locations").insert(locationData).select().single()
  if (error) {
    console.error("Error inserting location:", error)
    return null
  }
  return data
}

export async function updateLocation(
  id: string,
  locationData: Partial<Omit<LocationDB, "id" | "created_at" | "updated_at">>,
): Promise<LocationDB | null> {
  const { data, error } = await supabase.from("locations").update(locationData).eq("id", id).select().single()
  if (error) {
    console.error("Error updating location:", error)
    return null
  }
  return data
}

export async function deleteLocation(id: string): Promise<boolean> {
  const { error } = await supabase.from("locations").delete().eq("id", id)
  if (error) {
    console.error("Error deleting location:", error)
    return false
  }
  return true
}

export async function insertAdministrativeDepartment(
  departmentData: Omit<AdministrativeDepartmentDB, "id" | "created_at" | "updated_at">,
): Promise<AdministrativeDepartmentDB | null> {
  const { data, error } = await supabase.from("administrative_departments").insert(departmentData).select().single()
  if (error) {
    console.error("Error inserting administrative department:", error)
    return null
  }
  return data
}

export async function updateAdministrativeDepartment(
  id: string,
  departmentData: Partial<Omit<AdministrativeDepartmentDB, "id" | "created_at" | "updated_at">>,
): Promise<AdministrativeDepartmentDB | null> {
  const { data, error } = await supabase
    .from("administrative_departments")
    .update(departmentData)
    .eq("id", id)
    .select()
    .single()
  if (error) {
    console.error("Error updating administrative department:", error)
    return null
  }
  return data
}

export async function deleteAdministrativeDepartment(id: string): Promise<boolean> {
  const { error } = await supabase.from("administrative_departments").delete().eq("id", id)
  if (error) {
    console.error("Error deleting administrative department:", error)
    return false
  }
  return true
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

export async function getAllResguardos(): Promise<Resguardo[] | null> {
  const { data, error } = await supabase.from("resguardos").select("*").order("created_at", { ascending: false })
  if (error) {
    console.error("Error fetching all resguardos:", error)
    return null
  }
  return data
}

export async function insertResguardo(resguardoData: Omit<Resguardo, "id" | "created_at">): Promise<Resguardo | null> {
  const { data, error } = await supabase.from("resguardos").insert(resguardoData).select().single()
  if (error) {
    console.error("Error inserting resguardo:", error)
    return null
  }
  return data
}

export async function getPopulatedEquipoById(id: string): Promise<PopulatedEquipo | null> {
  const { data, error } = await supabase
    .from("equipment")
    .select(
      `
      *,
      equipment_type:equipment_types(id, name, description),
      current_status:equipment_status(id, name, description),
      current_location:locations(id, building, floor, service_area, internal_location, description),
      current_responsible:responsables(id, full_name, phone, email),
      printer_details:printer_details(equipment_id, profile, printer_type)
    `,
    )
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

export async function getPopulatedStationById(id: string): Promise<PopulatedEstacion | null> {
  const { data, error } = await supabase
    .from("stations")
    .select(
      `
      *,
      cpu:equipment!cpu_id(
        id, display_id, brand, model, serial_number,
        equipment_type:equipment_types(id, name, description),
        current_status:equipment_status(id, name, description),
        current_location:locations(id, building, floor, service_area, internal_location, description),
        current_responsible:responsables(id, full_name, phone, email)
      ),
      monitor:equipment!monitor_id(
        id, display_id, brand, model, serial_number,
        equipment_type:equipment_types(id, name, description),
        current_status:equipment_status(id, name, description),
        current_location:locations(id, building, floor, service_area, internal_location, description),
        current_responsible:responsables(id, full_name, phone, email)
      ),
      current_responsible:responsables(id, full_name, phone, email),
      current_location:locations(id, building, floor, service_area, internal_location, description),
      station_status:equipment_status(id, name, description),
      accessories:station_accessories(accessory_name)
    `,
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching populated station by ID:", error)
    return null
  }

  const populatedData: PopulatedEstacion = {
    id: data.id,
    display_id: data.display_id,
    name: data.name,
    created_at: data.created_at,
    updated_at: data.updated_at,
    cpu: {
      id: data.cpu.id,
      display_id: data.cpu.display_id,
      brand: data.cpu.brand,
      model: data.cpu.model,
      serial_number: data.cpu.serial_number,
      equipment_type: data.cpu.equipment_type,
      current_status: data.cpu.current_status,
      current_location: data.cpu.current_location,
      current_responsible: data.cpu.current_responsible,
      created_at: data.cpu.created_at,
      updated_at: data.cpu.updated_at,
    },
    monitor: {
      id: data.monitor.id,
      display_id: data.monitor.display_id,
      brand: data.monitor.brand,
      model: data.monitor.model,
      serial_number: data.monitor.serial_number,
      equipment_type: data.monitor.equipment_type,
      current_status: data.monitor.current_status,
      current_location: data.monitor.current_location,
      current_responsible: data.monitor.current_responsible,
      created_at: data.monitor.created_at,
      updated_at: data.monitor.updated_at,
    },
    current_responsible: data.current_responsible,
    current_location: data.current_location,
    station_status: data.station_status,
    accessories: data.accessories.map((acc: { accessory_name: string }) => acc.accessory_name),
  }

  return populatedData
}
