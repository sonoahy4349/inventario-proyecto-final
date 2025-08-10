// lib/types.ts

export interface ResponsableDB {
  id: string
  full_name: string
  phone?: string
  email?: string
  user_id?: string // UUID of the associated user in auth.users
  created_at: string
  updated_at: string
}

export interface LocationDB {
  id: string
  building: string
  floor: string
  service_area: string
  internal_location: string
  description?: string
  created_at: string
  updated_at: string
}

export interface EquipmentTypeDB {
  id: string
  name: string // e.g., 'CPU', 'Monitor', 'Laptop', 'Impresora'
  description?: string
  created_at: string
  updated_at: string
}

export interface EquipmentStatusDB {
  id: string
  name: string // e.g., 'Activo', 'En Reparación', 'De Baja', 'Asignado', 'Disponible', 'En Mantenimiento'
  description?: string
  created_at: string
  updated_at: string
}

export interface PrinterDetailsDB {
  equipment_id: string // FK to equipment.id
  profile?: string // e.g., 'Color', 'Monocromática', 'Red', 'WiFi', 'USB'
  printer_type?: string // e.g., 'Láser', 'Inyección de Tinta', 'Térmica'
  created_at: string
  updated_at: string
}

export interface AdministrativeDepartmentDB {
  id: string
  name: string
  description?: string
  status: "Activa" | "Inactiva"
  created_at: string
  updated_at: string
}

export interface Equipo {
  id: string
  display_id: string // e.g., EQ001
  equipment_type_id: string // FK to equipment_types.id
  brand: string
  model: string
  serial_number: string
  current_status_id: string // FK to equipment_status.id
  current_location_id: string // FK to locations.id
  current_responsible_id?: string // FK to responsables.id, optional
  assigned_station_id?: string // FK to stations.id, only for CPU/Monitor, optional
  purchase_date?: string // ISO date string
  warranty_end_date?: string // ISO date string
  notes?: string
  created_at?: string
  updated_at?: string
}

export interface Estacion {
  id: string
  display_id: string // e.g., EST001
  name: string
  cpu_id: string // FK to equipment.id (CPU)
  monitor_id: string // FK to equipment.id (Monitor)
  current_responsible_id: string // FK to responsables.id
  current_location_id: string // FK to locations.id
  station_status_id: string // FK to equipment_status.id
  created_at?: string
  updated_at?: string
  // Accessories are in a separate join table, fetched separately
}

export interface Resguardo {
  id: string
  resguardo_type: string // e.g., "Asignación Inicial", "Mantenimiento Preventivo"
  created_at: string // ISO date string
  is_signed: boolean
  document_url?: string // URL para descargar/visualizar
  equipment_id?: string // The ID of the equipment this resguardo belongs to
  station_id?: string // The ID of the station this resguardo belongs to
}

export interface MovementDB {
  id: string
  user_id: string // FK to public.users.id
  timestamp: string // ISO date string
  movement_type: string
  description: string
  equipment_id?: string
  station_id?: string
  responsible_id?: string
  location_id?: string
  resguardo_id?: string
  created_at: string
}

// --- Populated Interfaces for UI display (with joined data) ---

export interface PopulatedEquipo
  extends Omit<
    Equipo,
    "equipment_type_id" | "current_status_id" | "current_location_id" | "current_responsible_id" | "assigned_station_id"
  > {
  equipment_type: EquipmentTypeDB
  current_status: EquipmentStatusDB
  current_location: LocationDB
  current_responsible?: ResponsableDB
  assigned_station?: Estacion // Simplified, could be PopulatedEstacion
  printer_details?: PrinterDetailsDB // For printers
}

export interface PopulatedEstacion
  extends Omit<
    Estacion,
    "cpu_id" | "monitor_id" | "current_responsible_id" | "current_location_id" | "station_status_id"
  > {
  cpu: PopulatedEquipo // The actual CPU equipment object
  monitor: PopulatedEquipo // The actual Monitor equipment object
  current_responsible: ResponsableDB
  current_location: LocationDB
  station_status: EquipmentStatusDB
  accessories: string[] // List of accessory names
}

// Combined type for items that can have resguardos
export type ResguardableItem = PopulatedEstacion | PopulatedEquipo
