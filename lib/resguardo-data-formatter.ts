// lib/resguardo-data-formatter.ts
import type { Estacion, Equipo } from "./types"

const HOSPITAL_ADDRESS =
  "Carretera Federal México-Puebla Km. 34.5, Pueblo de Zoquiapan, 56530, Municipio de Ixtapaluca, Estado de México."
const HOSPITAL_PHONE = "(55) 5972 9800"

function parseUbicacionString(ubicacion: string) {
  const parts = ubicacion.split(",").map((p) => p.trim())
  let edificio = "N/A"
  let piso = "N/A"
  let ubicacionInterna = "N/A"

  if (parts.length >= 1) edificio = parts[0]
  if (parts.length >= 2) piso = parts[1]
  if (parts.length >= 3) ubicacionInterna = parts.slice(2).join(", ") // Join remaining parts for internal location

  return { edificio, piso, ubicacionInterna }
}

export function formatResguardoDataForDocx(itemData: Estacion | Equipo, resguardoType: string) {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  let responsibleName = "N/A"
  let equipoTipo = ""
  let equipoMarca = ""
  let equipoModelo = ""
  let equipoNoSerie = ""
  const equipoDireccion = HOSPITAL_ADDRESS
  let equipoUbicacion = ""
  let equipoEdificio = ""
  let equipoPiso = ""
  let equipoServicio = ""
  let equipoUbicacionInterna = ""

  if ("cpu" in itemData && "monitor" in itemData) {
    // It's an Estacion
    responsibleName = itemData.responsable
    equipoUbicacion = itemData.ubicacion
    equipoServicio = itemData.servicio

    const { edificio, piso, ubicacionInterna } = parseUbicacionString(itemData.ubicacion)
    equipoEdificio = edificio
    equipoPiso = piso
    equipoUbicacionInterna = ubicacionInterna

    // For stations, you might want to list CPU and Monitor separately or combine them
    // For simplicity, this formatter focuses on a single item for the template.
    // You'd need a more complex template or data structure for multiple items in a table.
    // For now, we'll just use the station ID as the main item identifier.
    equipoTipo = "ESTACIÓN DE CÓMPUTO"
    equipoMarca = itemData.cpu.marca // Example: using CPU brand for station
    equipoModelo = `${itemData.cpu.modelo} / ${itemData.monitor.modelo}` // Example: combining models
    equipoNoSerie = `${itemData.cpu.id} / ${itemData.monitor.id}` // Example: combining IDs
  } else {
    // It's an Equipo
    const equipo = itemData as Equipo
    responsibleName = equipo.responsable || "N/A"
    equipoUbicacion = equipo.ubicacion
    equipoServicio = equipo.servicio

    const { edificio, piso, ubicacionInterna } = parseUbicacionString(equipo.ubicacion)
    equipoEdificio = edificio
    equipoPiso = piso
    equipoUbicacionInterna = ubicacionInterna

    equipoTipo = equipo.tipo.toUpperCase()
    equipoMarca = equipo.marca
    equipoModelo = equipo.modelo
    equipoNoSerie = equipo.noSerie
  }

  return {
    fecha: currentDate,
    responsableNombre: responsibleName,
    equipoTipo: equipoTipo,
    equipoMarca: equipoMarca,
    equipoModelo: equipoModelo,
    equipoNoSerie: equipoNoSerie,
    equipoDireccion: equipoDireccion,
    equipoUbicacion: equipoUbicacion,
    equipoEdificio: equipoEdificio,
    equipoPiso: equipoPiso,
    equipoServicio: equipoServicio,
    equipoUbicacionInterna: equipoUbicacionInterna,
    // Add other fields as needed for your template
    hospitalAddress: HOSPITAL_ADDRESS,
    hospitalPhone: HOSPITAL_PHONE,
    // For checkboxes, you might need to pass boolean values or specific strings
    // For this example, assuming static checkboxes for Laptop resguardo
    checkboxLaptop: "☒",
    checkboxCable: "☒",
    checkboxEliminador: "☒",
  }
}
