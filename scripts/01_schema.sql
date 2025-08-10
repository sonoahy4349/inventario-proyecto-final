-- scripts/01_schema.sql

-- Habilitar la extensión uuid-ossp para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabla de Usuarios del Sistema (vinculada a auth.users)
-- Esta tabla DEBE crearse antes de la función get_user_role, ya que la función la referencia.
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'Usuario' CHECK (role IN ('Administrador', 'Usuario')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Habilitar RLS para la tabla users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Función para obtener el rol del usuario (para RLS)
-- Esta función DEBE definirse después de la tabla public.users.
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS text AS $$
  SELECT role FROM public.users WHERE id = user_id;
$$ LANGUAGE sql STABLE;

-- Ahora que la función existe, podemos definir las políticas RLS que la usan.
-- Es buena práctica eliminar las políticas existentes antes de crearlas para evitar conflictos.

-- Drop existing policies for public.users if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow authenticated users to update their own profile" ON public.users;
DROP POLICY IF EXISTS "Allow admins to manage all user profiles" ON public.users;

-- Create policies for public.users
CREATE POLICY "Allow authenticated users to read their own profile" ON public.users
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Allow authenticated users to update their own profile" ON public.users
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow admins to manage all user profiles" ON public.users
FOR ALL USING (public.get_user_role(auth.uid()) = 'Administrador');


-- Tabla de Responsables (personas a cargo de equipos/estaciones)
CREATE TABLE IF NOT EXISTS public.responsables (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name text NOT NULL,
  phone text,
  email text UNIQUE,
  user_id uuid UNIQUE REFERENCES public.users(id) ON DELETE SET NULL, -- Un responsable puede ser un usuario del sistema
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para la tabla responsables
ALTER TABLE public.responsables ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for public.responsables if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read responsables" ON public.responsables;
DROP POLICY IF EXISTS "Allow admins to manage responsables" ON public.responsables;

-- Create policies for public.responsables
CREATE POLICY "Allow authenticated users to read responsables" ON public.responsables
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to manage responsables" ON public.responsables
FOR ALL USING (public.get_user_role(auth.uid()) = 'Administrador');


-- Tabla de Ubicaciones Físicas
CREATE TABLE IF NOT EXISTS public.locations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  building text NOT NULL,
  floor text NOT NULL,
  service_area text NOT NULL,
  internal_location text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (building, floor, service_area, internal_location) -- Evitar ubicaciones duplicadas
);

-- RLS para la tabla locations
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for public.locations if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read locations" ON public.locations;
DROP POLICY IF EXISTS "Allow admins to manage locations" ON public.locations;

-- Create policies for public.locations
CREATE POLICY "Allow authenticated users to read locations" ON public.locations
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to manage locations" ON public.locations
FOR ALL USING (public.get_user_role(auth.uid()) = 'Administrador');


-- Tabla de Direcciones Administrativas
CREATE TABLE IF NOT EXISTS public.administrative_departments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  description text,
  status text NOT NULL DEFAULT 'Activa' CHECK (status IN ('Activa', 'Inactiva')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para la tabla administrative_departments
ALTER TABLE public.administrative_departments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for public.administrative_departments if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read departments" ON public.administrative_departments;
DROP POLICY IF EXISTS "Allow admins to manage departments" ON public.administrative_departments;

-- Create policies for public.administrative_departments
CREATE POLICY "Allow all users to read departments" ON public.administrative_departments
FOR SELECT USING (true);

CREATE POLICY "Allow admins to manage departments" ON public.administrative_departments
FOR ALL USING (public.get_user_role(auth.uid()) = 'Administrador');


-- Tabla de Tipos de Equipo (Catálogo)
CREATE TABLE IF NOT EXISTS public.equipment_types (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE, -- e.g., 'CPU', 'Monitor', 'Laptop', 'Impresora'
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para la tabla equipment_types
ALTER TABLE public.equipment_types ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for public.equipment_types if they exist
DROP POLICY IF EXISTS "Allow all users to read equipment types" ON public.equipment_types;
DROP POLICY IF EXISTS "Allow admins to manage equipment types" ON public.equipment_types;

-- Create policies for public.equipment_types
CREATE POLICY "Allow all users to read equipment types" ON public.equipment_types
FOR SELECT USING (true);

CREATE POLICY "Allow admins to manage equipment types" ON public.equipment_types
FOR ALL USING (public.get_user_role(auth.uid()) = 'Administrador');


-- Tabla de Estados de Equipo (Catálogo)
CREATE TABLE IF NOT EXISTS public.equipment_status (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE, -- e.g., 'Activo', 'En Reparación', 'De Baja', 'Asignado', 'Disponible'
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para la tabla equipment_status
ALTER TABLE public.equipment_status ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for public.equipment_status if they exist
DROP POLICY IF EXISTS "Allow all users to read equipment status" ON public.equipment_status;
DROP POLICY IF EXISTS "Allow admins to manage equipment status" ON public.equipment_status;

-- Create policies for public.equipment_status
CREATE POLICY "Allow all users to read equipment status" ON public.equipment_status
FOR SELECT USING (true);

CREATE POLICY "Allow admins to manage equipment status" ON public.equipment_status
FOR ALL USING (public.get_user_role(auth.uid()) = 'Administrador');


-- Tabla principal de Equipos
CREATE TABLE IF NOT EXISTS public.equipment (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_id text UNIQUE NOT NULL, -- Nuevo campo para IDs como EQ001
  equipment_type_id uuid NOT NULL REFERENCES public.equipment_types(id),
  brand text NOT NULL,
  model text NOT NULL,
  serial_number text UNIQUE NOT NULL,
  current_status_id uuid NOT NULL REFERENCES public.equipment_status(id),
  current_location_id uuid NOT NULL REFERENCES public.locations(id),
  current_responsible_id uuid REFERENCES public.responsables(id) ON DELETE SET NULL, -- NULL si no está asignado
  assigned_station_id uuid UNIQUE, -- FK a stations.id, NULL si no es parte de una estación (solo para CPU/Monitor)
  purchase_date date,
  warranty_end_date date,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para la tabla equipment
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for public.equipment if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read equipment" ON public.equipment;
DROP POLICY IF EXISTS "Allow admins to manage equipment" ON public.equipment;

-- Create policies for public.equipment
CREATE POLICY "Allow authenticated users to read equipment" ON public.equipment
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to manage equipment" ON public.equipment
FOR ALL USING (public.get_user_role(auth.uid()) = 'Administrador');


-- Tabla de Detalles Específicos de Impresoras (relación 1 a 1 con equipment)
CREATE TABLE IF NOT EXISTS public.printer_details (
  equipment_id uuid PRIMARY KEY REFERENCES public.equipment(id) ON DELETE CASCADE,
  profile text, -- e.g., 'Color', 'Monocromática', 'Red', 'WiFi', 'USB'
  printer_type text, -- e.g., 'Láser', 'Inyección de Tinta', 'Térmica'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para la tabla printer_details
ALTER TABLE public.printer_details ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for public.printer_details if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read printer details" ON public.printer_details;
DROP POLICY IF EXISTS "Allow admins to manage printer details" ON public.printer_details;

-- Create policies for public.printer_details
CREATE POLICY "Allow authenticated users to read printer details" ON public.printer_details
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to manage printer details" ON public.printer_details
FOR ALL USING (public.get_user_role(auth.uid()) = 'Administrador');


-- Tabla de Estaciones de Trabajo (CPU + Monitor + Accesorios)
CREATE TABLE IF NOT EXISTS public.stations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_id text UNIQUE NOT NULL, -- Nuevo campo para IDs como EST001
  name text NOT NULL UNIQUE,
  cpu_id uuid NOT NULL UNIQUE REFERENCES public.equipment(id), -- Un CPU solo puede estar en una estación
  monitor_id uuid NOT NULL UNIQUE REFERENCES public.equipment(id), -- Un Monitor solo puede estar en una estación
  current_responsible_id uuid NOT NULL REFERENCES public.responsables(id),
  current_location_id uuid NOT NULL REFERENCES public.locations(id),
  station_status_id uuid NOT NULL REFERENCES public.equipment_status(id), -- Estado de la estación (Activa, En Mantenimiento, etc.)
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- RLS para la tabla stations
ALTER TABLE public.stations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for public.stations if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read stations" ON public.stations;
DROP POLICY IF EXISTS "Allow admins to manage stations" ON public.stations;

-- Create policies for public.stations
CREATE POLICY "Allow authenticated users to read stations" ON public.stations
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to manage stations" ON public.stations
FOR ALL USING (public.get_user_role(auth.uid()) = 'Administrador');


-- Tabla de Accesorios de Estaciones (muchos a muchos)
CREATE TABLE IF NOT EXISTS public.station_accessories (
  station_id uuid NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
  accessory_name text NOT NULL, -- Nombre del accesorio (ej. 'Mouse', 'Teclado', 'Cable de Red')
  PRIMARY KEY (station_id, accessory_name),
  created_at timestamptz DEFAULT now()
);

-- RLS para la tabla station_accessories
ALTER TABLE public.station_accessories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for public.station_accessories if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read station accessories" ON public.station_accessories;
DROP POLICY IF EXISTS "Allow admins to manage station accessories" ON public.station_accessories;

-- Create policies for public.station_accessories
CREATE POLICY "Allow authenticated users to read station accessories" ON public.station_accessories
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to manage station accessories" ON public.station_accessories
FOR ALL USING (public.get_user_role(auth.uid()) = 'Administrador');


-- Tabla de Resguardos (documentos generados)
CREATE TABLE IF NOT EXISTS public.resguardos (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  resguardo_type text NOT NULL, -- e.g., 'Asignación Inicial', 'Mantenimiento Preventivo'
  created_at timestamptz DEFAULT now(),
  is_signed boolean DEFAULT FALSE,
  document_url text, -- URL al documento generado (PDF, DOCX)
  equipment_id uuid REFERENCES public.equipment(id) ON DELETE SET NULL, -- FK si el resguardo es para un equipo individual
  station_id uuid REFERENCES public.stations(id) ON DELETE SET NULL, -- FK si el resguardo es para una estación
  -- Asegura que solo uno de equipment_id o station_id esté presente
  CONSTRAINT chk_one_item_id CHECK (
      (equipment_id IS NOT NULL AND station_id IS NULL) OR
      (equipment_id IS NULL AND station_id IS NOT NULL)
  )
);

-- RLS para la tabla resguardos
ALTER TABLE public.resguardos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for public.resguardos if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read resguardos" ON public.resguardos;
DROP POLICY IF EXISTS "Allow admins to manage resguardos" ON public.resguardos;

-- Create policies for public.resguardos
CREATE POLICY "Allow authenticated users to read resguardos" ON public.resguardos
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to manage resguardos" ON public.resguardos
FOR ALL USING (public.get_user_role(auth.uid()) = 'Administrador');


-- Tabla de Movimientos (historial de acciones)
CREATE TABLE IF NOT EXISTS public.movements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES public.users(id), -- Quién realizó la acción
  timestamp timestamptz DEFAULT now(),
  movement_type text NOT NULL, -- e.g., 'Equipo Agregado', 'Estación Editada', 'Resguardo Generado', 'Equipo de Baja'
  description text NOT NULL,
  equipment_id uuid REFERENCES public.equipment(id) ON DELETE SET NULL,
  station_id uuid REFERENCES public.stations(id) ON DELETE SET NULL,
  responsible_id uuid REFERENCES public.responsables(id) ON DELETE SET NULL,
  location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL,
  resguardo_id uuid REFERENCES public.resguardos(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS para la tabla movements
ALTER TABLE public.movements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for public.movements if they exist
DROP POLICY IF EXISTS "Allow authenticated users to read movements" ON public.movements;
DROP POLICY IF EXISTS "Allow admins to manage movements" ON public.movements;

-- Create policies for public.movements
CREATE POLICY "Allow authenticated users to read movements" ON public.movements
FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow admins to manage movements" ON public.movements
FOR ALL USING (public.get_user_role(auth.uid()) = 'Administrador');


-- Trigger para actualizar `updated_at` automáticamente
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar el trigger a las tablas que tienen `updated_at`
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name IN ('users', 'responsables', 'locations', 'administrative_departments', 'equipment_types', 'equipment_status', 'equipment', 'printer_details', 'stations', 'resguardos', 'movements')
  LOOP
      EXECUTE format('
          CREATE OR REPLACE TRIGGER set_timestamp
          BEFORE UPDATE ON public.%I
          FOR EACH ROW
          EXECUTE FUNCTION update_timestamp();
      ', t);
  END LOOP;
END;
$$ LANGUAGE plpgsql;
