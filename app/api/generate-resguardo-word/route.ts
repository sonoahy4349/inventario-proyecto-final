import { NextResponse } from "next/server"
import PizZip from "pizzip"
import Docxtemplater from "docxtemplater"
import { promises as fs } from "fs"
import path from "path"
import { formatResguardoDataForDocx } from "@/lib/resguardo-data-formatter"
import type { Estacion, Equipo } from "@/lib/types"

export async function POST(req: Request) {
  try {
    const { itemData, resguardoType } = await req.json()

    if (!itemData) {
      return NextResponse.json({ error: "No item data provided" }, { status: 400 })
    }

    // Determine the template based on item type or resguardo type
    // For this example, we'll use a generic laptop template as per your request
    // In a real app, you might have different templates for CPU/Monitor stations vs. Laptops/Printers
    const templatePath = path.join(process.cwd(), "public", "templates", "resguardo-laptop-template.docx")

    // Read the template file
    const content = await fs.readFile(templatePath, "binary")
    const zip = new PizZip(content)
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    })

    // Format data for the template
    const data = formatResguardoDataForDocx(itemData as Estacion | Equipo, resguardoType)

    // Set the data and render the document
    doc.setData(data)
    doc.render()

    // Generate the buffer
    const buf = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    })

    // Set headers for file download
    const headers = new Headers()
    headers.set("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    headers.set(
      "Content-Disposition",
      `attachment; filename="resguardo_${itemData.id}_${resguardoType.replace(/\s/g, "_")}.docx"`,
    )

    return new NextResponse(buf, { headers })
  } catch (error) {
    console.error("Error generating Word document:", error)
    return NextResponse.json({ error: "Failed to generate Word document" }, { status: 500 })
  }
}
