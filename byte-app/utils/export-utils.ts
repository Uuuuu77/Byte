import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { saveAs } from "file-saver"
import { marked } from "marked"
import DOMPurify from "dompurify"

type ExportFormat = "pdf" | "markdown"

/**
 * Export research content to either PDF or Markdown
 */
export async function exportResearch(content: string, title: string, format: ExportFormat = "pdf"): Promise<boolean> {
  try {
    if (format === "pdf") {
      return await exportToPdf(content, title)
    } else {
      return exportToMarkdown(content, title)
    }
  } catch (error) {
    console.error("Error exporting research:", error)
    return false
  }
}

/**
 * Export content to PDF
 */
async function exportToPdf(content: string, title: string): Promise<boolean> {
  try {
    // Create a temporary div to render the content
    const tempDiv = document.createElement("div")
    tempDiv.className = "pdf-export-container"
    tempDiv.style.width = "800px"
    tempDiv.style.padding = "20px"
    tempDiv.style.backgroundColor = "white"
    tempDiv.style.color = "black"
    tempDiv.style.fontFamily = "Arial, sans-serif"

    // Add title
    const titleElement = document.createElement("h1")
    titleElement.textContent = title
    titleElement.style.marginBottom = "20px"
    tempDiv.appendChild(titleElement)

    // Add timestamp
    const timestamp = document.createElement("p")
    timestamp.textContent = `Generated on ${new Date().toLocaleString()}`
    timestamp.style.marginBottom = "20px"
    timestamp.style.fontSize = "12px"
    timestamp.style.color = "#666"
    tempDiv.appendChild(timestamp)

    // Convert markdown to HTML and sanitize
    const htmlContent = DOMPurify.sanitize(marked.parse(content))

    // Add content
    const contentElement = document.createElement("div")
    contentElement.innerHTML = htmlContent
    tempDiv.appendChild(contentElement)

    // Append to body temporarily (needed for html2canvas)
    document.body.appendChild(tempDiv)

    // Generate PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
    })

    const imgData = canvas.toDataURL("image/png")
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if content overflows
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Save the PDF
    pdf.save(`${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_research.pdf`)

    // Remove the temporary div
    document.body.removeChild(tempDiv)

    return true
  } catch (error) {
    console.error("Error exporting to PDF:", error)
    return false
  }
}

/**
 * Export content to Markdown
 */
function exportToMarkdown(content: string, title: string): boolean {
  try {
    // Format the markdown content
    const timestamp = new Date().toLocaleString()
    const markdownContent = `# ${title}\n\nGenerated on ${timestamp}\n\n${content}`

    // Create a blob and download
    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" })
    saveAs(blob, `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_research.md`)

    return true
  } catch (error) {
    console.error("Error exporting to Markdown:", error)
    return false
  }
}

/**
 * Export results in JSON format for team sharing
 */
export function exportForSharing(content: string, title: string, metadata: any): string {
  try {
    const shareableContent = {
      title,
      content,
      metadata,
      exportedAt: new Date().toISOString(),
      version: "1.0",
    }

    return JSON.stringify(shareableContent)
  } catch (error) {
    console.error("Error preparing content for sharing:", error)
    return ""
  }
}

