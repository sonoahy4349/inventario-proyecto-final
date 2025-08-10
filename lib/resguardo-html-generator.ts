// lib/resguardo-html-generator.ts
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

export function generateResguardoHtml(itemData: Estacion | Equipo, resguardoType: string): string {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  let itemDetailsHtml = ""
  let responsibleName = "N/A"
  let itemTypeForTitle = ""
  let itemAccessoriesHtml = ""
  let itemUbicacion = "N/A"
  let itemServicio = "N/A"

  if ("cpu" in itemData && "monitor" in itemData) {
    // It's an Estacion
    itemTypeForTitle = "ESTACIÓN DE CÓMPUTO"
    responsibleName = itemData.responsable
    itemUbicacion = itemData.ubicacion
    itemServicio = itemData.servicio

    const { edificio, piso, ubicacionInterna } = parseUbicacionString(itemData.ubicacion)

    itemDetailsHtml = `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">CPU: ${itemData.cpu.id}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${itemData.cpu.marca}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${itemData.cpu.modelo}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${itemData.cpu.noSerie || "N/A"}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${HOSPITAL_ADDRESS}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${itemUbicacion}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${edificio}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${piso}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${itemServicio}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${ubicacionInterna}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">Monitor: ${itemData.monitor.id}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${itemData.monitor.marca}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${itemData.monitor.modelo}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${itemData.monitor.noSerie || "N/A"}</td>
        <td style="padding: 8px; border: 1px solid #ddd;"></td>
        <td style="padding: 8px; border: 1px solid #ddd;"></td>
        <td style="padding: 8px; border: 1px solid #ddd;"></td>
        <td style="padding: 8px; border: 1px solid #ddd;"></td>
        <td style="padding: 8px; border: 1px solid #ddd;"></td>
        <td style="padding: 8px; border: 1px solid #ddd;"></td>
      </tr>
    `
    if (itemData.accesorios && itemData.accesorios.length > 0) {
      itemAccessoriesHtml = itemData.accesorios
        .map((acc) => `<span style="margin-right: 15px;">&#9746; ${acc}</span>`)
        .join("")
    }
  } else {
    // It's an Equipo
    const equipo = itemData as Equipo
    itemTypeForTitle = `EQUIPO DE CÓMPUTO ${equipo.tipo.toUpperCase()}`
    responsibleName = equipo.responsable || "N/A"
    itemUbicacion = equipo.ubicacion
    itemServicio = equipo.servicio

    const { edificio, piso, ubicacionInterna } = parseUbicacionString(equipo.ubicacion)

    itemDetailsHtml = `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${equipo.tipo.toUpperCase()}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${equipo.marca}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${equipo.modelo}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${equipo.noSerie}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${HOSPITAL_ADDRESS}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${itemUbicacion}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${edificio}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${piso}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${itemServicio}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${ubicacionInterna}</td>
      </tr>
    `
    if (equipo.tipo === "Laptop") {
      itemAccessoriesHtml = `
        <span style="margin-right: 15px;">&#9746; Laptop</span>
        <span style="margin-right: 15px;">&#9746; Cable de corriente</span>
        <span style="margin-right: 15px;">&#9746; Eliminador</span>
      `
    }
  }

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hoja de Resguardo - ${itemData.id}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 40px;
                color: #333;
                line-height: 1.6;
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .header p {
                margin: 0;
                font-size: 14px;
            }
            .title {
                text-align: center;
                font-size: 20px;
                font-weight: bold;
                margin-bottom: 20px;
                border-bottom: 2px solid #333;
                padding-bottom: 10px;
            }
            .date {
                text-align: right;
                margin-bottom: 20px;
                font-size: 14px;
            }
            .section {
                margin-bottom: 20px;
            }
            .section-title {
                font-weight: bold;
                margin-bottom: 10px;
            }
            .signature-area {
                display: flex;
                justify-content: space-around;
                margin-top: 50px;
                text-align: center;
            }
            .signature-line {
                border-top: 1px solid #333;
                padding-top: 5px;
                width: 40%;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
                font-size: 13px;
            }
            th {
                background-color: #f2f2f2;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <p>${HOSPITAL_ADDRESS}</p>
            <p>Tel: ${HOSPITAL_PHONE}</p>
        </div>

        <div class="title">
            HOJA DE RESGUARDO ${itemTypeForTitle}
        </div>

        <div class="date">
            Ixtapaluca, Edo de México, a ${currentDate}.
        </div>

        <div class="section">
            <p><strong>Responsable:</strong> ________________________________________________</p>
            <p>Por medio de la presente entrega el resguardo de los bienes referenciados que a continuación se describen:</p>
            <p>${itemAccessoriesHtml}</p>
        </div>

        <div class="section">
            <table>
                <thead>
                    <tr>
                        <th>Equipo</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>No. Serie</th>
                        <th>Dirección</th>
                        <th>Ubicación</th>
                        <th>Edificio</th>
                        <th>Piso</th>
                        <th>Servicio</th>
                        <th>Ubicación interna</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemDetailsHtml}
                </tbody>
            </table>
        </div>

        <div class="signature-area">
            <div>
                <p>_________________________________________</p>
                <p><strong>ENTREGA</strong></p>
                <p>Ing. Edelberto Arceta Armenta</p>
            </div>
            <div>
                <p>_________________________________________</p>
                <p><strong>RECIBE</strong></p>
                <p>${responsibleName}</p>
            </div>
        </div>
    </body>
    </html>
  `
}
