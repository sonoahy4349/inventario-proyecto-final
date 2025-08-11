-- =====================================================
-- DATOS INICIALES PARA EL SISTEMA
-- =====================================================

-- Insertar tipos de equipo
INSERT INTO public.equipment_types (name, description) VALUES
('CPU', 'Unidad Central de Procesamiento'),
('Monitor', 'Monitor de computadora'),
('Laptop', 'Computadora portátil'),
('Impresora', 'Impresora de documentos')
ON CONFLICT (name) DO NOTHING;

-- Insertar estados de equipo
INSERT INTO public.equipment_status (name, description) VALUES
('Activo', 'Equipo en funcionamiento normal'),
('En Reparación', 'Equipo en proceso de reparación'),
('De Baja', 'Equipo dado de baja'),
('Disponible', 'Equipo disponible para asignación'),
('En Mantenimiento', 'Equipo en mantenimiento preventivo')
ON CONFLICT (name) DO NOTHING;

-- Insertar ubicaciones
INSERT INTO public.locations (building, floor, service_area, internal_location, description) VALUES
('Edificio Principal', 'Planta Baja', 'Almacén TI', 'Almacén Principal', 'Almacén de Tecnologías de la Información'),
('Edificio Principal', '1er Piso', 'Urgencias', 'Estación de Enfermería 1', 'Primera estación de enfermería en urgencias'),
('Edificio Principal', '2do Piso', 'Laboratorio', 'Área de Análisis Clínicos', 'Área principal de análisis clínicos'),
('Edificio Anexo', 'Planta Baja', 'Administración', 'Oficina de Gerencia', 'Oficina principal de gerencia'),
('Edificio Principal', '3er Piso', 'Radiología', 'Sala de Rayos X 2', 'Segunda sala de rayos X'),
('Edificio Principal', '1er Piso', 'Farmacia', 'Mostrador Principal', 'Mostrador principal de farmacia')
ON CONFLICT (building, floor, service_area, internal_location) DO NOTHING;

-- Insertar direcciones administrativas
INSERT INTO public.administrative_departments (name, description, status) VALUES
('Dirección General', 'Dirección administrativa principal del hospital', 'Activa'),
('Dirección Médica', 'Dirección encargada de los servicios médicos', 'Activa'),
('Dirección de Enfermería', 'Dirección del personal de enfermería', 'Activa'),
('Dirección de Recursos Humanos', 'Gestión del personal del hospital', 'Activa'),
('Dirección de Tecnologías de la Información', 'Gestión de sistemas y tecnología', 'Activa')
ON CONFLICT (name) DO NOTHING;

-- Insertar responsables
INSERT INTO public.responsables (full_name, phone, email) VALUES
('Dr. Juan Pérez', '555-1234', 'juan.perez@hospital.com'),
('Lic. Ana García', '555-5678', 'ana.garcia@hospital.com'),
('Enf. María López', '555-9012', 'maria.lopez@hospital.com'),
('Ing. Carlos Ruiz', '555-3456', 'carlos.ruiz@hospital.com'),
('Dra. Patricia Hernández', '555-7890', 'patricia.hernandez@hospital.com')
ON CONFLICT (email) DO NOTHING;

-- Obtener IDs para las relaciones
DO $$
DECLARE
    cpu_type_id uuid;
    monitor_type_id uuid;
    laptop_type_id uuid;
    printer_type_id uuid;
    active_status_id uuid;
    available_status_id uuid;
    almacen_location_id uuid;
    urgencias_location_id uuid;
    laboratorio_location_id uuid;
    admin_location_id uuid;
    dr_juan_id uuid;
    lic_ana_id uuid;
    enf_maria_id uuid;
    ing_carlos_id uuid;
BEGIN
    -- Obtener IDs de tipos de equipo
    SELECT id INTO cpu_type_id FROM public.equipment_types WHERE name = 'CPU';
    SELECT id INTO monitor_type_id FROM public.equipment_types WHERE name = 'Monitor';
    SELECT id INTO laptop_type_id FROM public.equipment_types WHERE name = 'Laptop';
    SELECT id INTO printer_type_id FROM public.equipment_types WHERE name = 'Impresora';
    
    -- Obtener IDs de estados
    SELECT id INTO active_status_id FROM public.equipment_status WHERE name = 'Activo';
    SELECT id INTO available_status_id FROM public.equipment_status WHERE name = 'Disponible';
    
    -- Obtener IDs de ubicaciones
    SELECT id INTO almacen_location_id FROM public.locations WHERE building = 'Edificio Principal' AND service_area = 'Almacén TI';
    SELECT id INTO urgencias_location_id FROM public.locations WHERE building = 'Edificio Principal' AND service_area = 'Urgencias';
    SELECT id INTO laboratorio_location_id FROM public.locations WHERE building = 'Edificio Principal' AND service_area = 'Laboratorio';
    SELECT id INTO admin_location_id FROM public.locations WHERE building = 'Edificio Anexo' AND service_area = 'Administración';
    
    -- Obtener IDs de responsables
    SELECT id INTO dr_juan_id FROM public.responsables WHERE email = 'juan.perez@hospital.com';
    SELECT id INTO lic_ana_id FROM public.responsables WHERE email = 'ana.garcia@hospital.com';
    SELECT id INTO enf_maria_id FROM public.responsables WHERE email = 'maria.lopez@hospital.com';
    SELECT id INTO ing_carlos_id FROM public.responsables WHERE email = 'carlos.ruiz@hospital.com';
    
    -- Insertar equipos de ejemplo
    INSERT INTO public.equipment (equipment_type_id, brand, model, serial_number, current_status_id, current_location_id, current_responsible_id) VALUES
    (cpu_type_id, 'Dell', 'OptiPlex 7090', 'DL123456789', active_status_id, urgencias_location_id, dr_juan_id),
    (monitor_type_id, 'Samsung', '24 inch LED', 'SM987654321', active_status_id, urgencias_location_id, dr_juan_id),
    (laptop_type_id, 'HP', 'EliteBook 840', 'HP456789123', active_status_id, laboratorio_location_id, lic_ana_id),
    (printer_type_id, 'Epson', 'EcoTank L3250', 'EP789123456', active_status_id, admin_location_id, ing_carlos_id),
    (cpu_type_id, 'HP', 'ProDesk 600 G1', 'HP111222333', available_status_id, almacen_location_id, NULL),
    (monitor_type_id, 'LG', '22 inch LED', 'LG444555666', available_status_id, almacen_location_id, NULL)
    ON CONFLICT (serial_number) DO NOTHING;
    
    -- Insertar detalles de impresora
    INSERT INTO public.printer_details (equipment_id, profile, printer_type)
    SELECT e.id, 'Color', 'Inyección de Tinta'
    FROM public.equipment e
    JOIN public.equipment_types et ON e.equipment_type_id = et.id
    WHERE et.name = 'Impresora' AND e.serial_number = 'EP789123456'
    ON CONFLICT (equipment_id) DO NOTHING;
    
END $$;
