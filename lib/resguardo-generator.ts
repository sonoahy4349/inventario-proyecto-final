// lib/resguardo-generator.ts
import type { Estacion } from "./types"

export function generateResguardoContent(station: Estacion, resguardoType: string): string {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const currentTime = new Date().toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  })

  let content = `
RESGUARDO DE EQUIPO DE TI - HOSPITAL
Fecha de Generación: ${currentDate} ${currentTime}
--------------------------------------------------------------------

Tipo de Resguardo: ${resguardoType}
ID de Estación: ${station.id}
Estado de la Estación: ${station.estado}

--------------------------------------------------------------------
INFORMACIÓN DEL RESPONSABLE
Nombre Completo: ${station.responsable}
Servicio Asignado: ${station.servicio}
Ubicación: ${station.ubicacion}

--------------------------------------------------------------------
EQUIPOS ASIGNADOS A LA ESTACIÓN
`

  // CPU
  content += `
CPU Principal:
  ID: ${station.cpu.id}
  Marca: ${station.cpu.marca}
  Modelo: ${station.cpu.modelo}
`

  // Monitor
  content += `
Monitor Secundario:
  ID: ${station.monitor.id}
  Marca: ${station.monitor.marca}
  Modelo: ${station.monitor.modelo}
`

  // Accesorios
  if (station.accesorios && station.accesorios.length > 0) {
    content += `
Accesorios Incluidos:
  ${station.accesorios.map((acc) => `- ${acc}`).join("\n  ")}
`
  } else {
    content += `
Accesorios Incluidos: Ninguno
`
  }

  // Specific content based on resguardo type
  switch (resguardoType) {
    case "Asignación Inicial":
      content += `
--------------------------------------------------------------------
DETALLES DE ASIGNACIÓN INICIAL
Este documento certifica la asignación inicial de la estación de trabajo y sus componentes al responsable indicado.
El responsable se compromete a hacer uso adecuado del equipo y reportar cualquier anomalía.
`
      break
    case "Mantenimiento Preventivo":
      content += `
--------------------------------------------------------------------
DETALLES DE MANTENIMIENTO PREVENTIVO
Este resguardo documenta la realización de mantenimiento preventivo en la estación.
Se verificó el funcionamiento de hardware y software, y se realizaron las limpiezas y actualizaciones pertinentes.
`
      break
    case "Cambio de Responsable":
      content += `
--------------------------------------------------------------------
DETALLES DE CAMBIO DE RESPONSABLE
Este documento registra el cambio de responsable de la estación de trabajo.
El nuevo responsable asume la custodia y el uso adecuado del equipo a partir de la fecha de este resguardo.
`
      break
    case "Creación Inicial":
      content += `
--------------------------------------------------------------------
DETALLES DE CREACIÓN INICIAL
Este resguardo documenta la creación y configuración inicial de la estación de trabajo en el sistema de inventario.
`
      break
    case "Cancelación":
      content += `
--------------------------------------------------------------------
DETALLES DE CANCELACIÓN
Este resguardo documenta la baja o cancelación de la estación de trabajo del inventario.
`
      break
    default:
      content += `
--------------------------------------------------------------------
DETALLES ADICIONALES
Este es un resguardo de tipo '${resguardoType}'.
`
      break
  }

  content += `
--------------------------------------------------------------------
FIRMAS:

Responsable: _________________________

Técnico de TI: _________________________

`

  return content.trim()
}
