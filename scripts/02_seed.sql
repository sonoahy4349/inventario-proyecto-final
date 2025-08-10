-- scripts/02_seed.sql

-- Insertar tipos de equipo
INSERT INTO public.equipment_types (name, description) VALUES
('CPU', 'Unidad Central de Procesamiento'),
('Monitor', 'Dispositivo de visualización'),
('Laptop', 'Computadora portátil'),
('Impresora', 'Dispositivo de impresión')
ON CONFLICT (name) DO NOTHING;

-- Insertar estados de equipo
INSERT INTO public.equipment_status (name, description) VALUES
('Activo', 'En uso y funcionando correctamente'),
('En Reparación', 'Actualmente en proceso de reparación'),
('De Baja', 'Retirado del inventario por obsolescencia o daño irreparable'),
('Asignado', 'Asignado a un responsable o estación'),
('Disponible', 'Listo para ser asignado o utilizado'),
('En Mantenimiento', 'Estación o equipo en mantenimiento preventivo')
ON CONFLICT (name) DO NOTHING;

-- Insertar ubicaciones de ejemplo
INSERT INTO public.locations (building, floor, service_area, internal_location, description) VALUES
('Principal', '1er Piso', 'Urgencias', 'Estación de Enfermería 1', 'Estación de enfermería en el área de urgencias'),
('Principal', '2do Piso', 'Laboratorio', 'Área de Análisis Clínicos', 'Zona de trabajo para análisis de muestras'),
('Anexo', 'Planta Baja', 'Administración', 'Oficina de Gerencia', 'Oficina del gerente general'),
('Principal', '3er Piso', 'Radiología', 'Sala de Rayos X 2', 'Sala de diagnóstico por imágenes'),
('Principal', '1er Piso', 'Farmacia', 'Mostrador Principal', 'Punto de entrega de medicamentos'),
('Almacén TI', 'Planta Baja', 'TI', 'Almacén Principal', 'Almacén central de equipos de TI'),
('Taller de Reparación', 'Planta Baja', 'TI', 'Zona de Reparación', 'Área dedicada a la reparación de equipos')
ON CONFLICT (building, floor, service_area, internal_location) DO NOTHING;

-- Insertar direcciones administrativas de ejemplo
INSERT INTO public.administrative_departments (name, description, status) VALUES
('Dirección General', 'Oficina principal de la administración del hospital', 'Activa'),
('Recursos Humanos', 'Gestión de personal y nóminas', 'Activa'),
('Contabilidad', 'Departamento de finanzas y contaduría', 'Inactiva'),
('Compras', 'Adquisición de insumos y equipos', 'Activa')
ON CONFLICT (name) DO NOTHING;

-- Insertar responsables de ejemplo (sin user_id inicialmente)
INSERT INTO public.responsables (full_name, phone, email) VALUES
('Dr. Juan Pérez', '555-1234', 'juan.perez@hospital.com'),
('Lic. Ana García', '555-5678', 'ana.garcia@hospital.com'),
('Enf. María López', NULL, 'maria.lopez@hospital.com'),
('Ing. Carlos Ruiz', '555-9012', 'carlos.ruiz@hospital.com')
ON CONFLICT (email) DO NOTHING;

-- Nota: Los datos de `equipment` y `stations` se insertarán a través de la aplicación
-- para asegurar que las IDs de FK se manejen correctamente.
-- Sin embargo, para fines de prueba inicial, podrías insertar algunos aquí
-- después de obtener los IDs de los catálogos y responsables.

-- Ejemplo de cómo podrías insertar un equipo (requiere IDs de catálogos y ubicaciones)
-- SELECT id FROM public.equipment_types WHERE name = 'CPU';
-- SELECT id FROM public.equipment_status WHERE name = 'Disponible';
-- SELECT id FROM public.locations WHERE internal_location = 'Almacén Principal';

-- INSERT INTO public.equipment (equipment_type_id, brand, model, serial_number, current_status_id, current_location_id) VALUES
-- ((SELECT id FROM public.equipment_types WHERE name = 'CPU'), 'Dell', 'OptiPlex 7010', 'SN-CPU-001', (SELECT id FROM public.equipment_status WHERE name = 'Disponible'), (SELECT id FROM public.locations WHERE internal_location = 'Almacén Principal'))
-- ON CONFLICT (serial_number) DO NOTHING;
