import autoTable from "jspdf-autotable"
import jsPDF from "jspdf"

export const exportToPDF = (data, title, columns) => {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(18)
  doc.setTextColor(0, 0, 0)
  doc.text(`Lista de ${title}`, 14, 15)
  
  // Map data to table rows
  const tableRows = data.map((item) => columns.map((col) => item[col]))
  
  // Generate table
  autoTable(doc, {
    head: [columns],
    body: tableRows,
    startY: 25,
    styles: { 
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: { 
      fillColor: [59, 130, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  })
  
  // Footer
  const fecha = new Date().toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generado el ${fecha}`, 14, doc.internal.pageSize.height - 20)
  doc.text("TechFix - Sistema de Gestión de Reparaciones", 14, doc.internal.pageSize.height - 14)
  
  // Save PDF
  const fileName = `${title.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`
  doc.save(fileName)
}

export const exportRepairDetailsToPDF = (repair) => {
  const doc = new jsPDF()
  
  // Header
  doc.setFontSize(20)
  doc.setTextColor(0, 0, 0)
  doc.text("Reporte de Reparación", 14, 15)
  
  // Repair ID
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`#${repair.id}`, 14, 25)
  
  let yPos = 35
  
  // Device Information Section
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text("Información del Dispositivo", 14, yPos)
  yPos += 10
  
  doc.setFontSize(11)
  doc.setTextColor(60, 60, 60)
  
  const deviceInfo = [
    ['Marca:', repair.RepairOrder?.Device?.DeviceModel?.Brand?.name || 'N/A'],
    ['Modelo:', repair.RepairOrder?.Device?.DeviceModel?.name || 'N/A'],
    ['Número de Serie:', repair.RepairOrder?.Device?.serial_number || 'N/A'],
    ['Estado Físico:', repair.RepairOrder?.Device?.physical_state || 'N/A'],
  ]
  
  deviceInfo.forEach(([label, value]) => {
    doc.text(label, 14, yPos)
    doc.text(value, 60, yPos)
    yPos += 7
  })
  
  yPos += 5
  
  // Problem Reported Section
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text("Problema Reportado", 14, yPos)
  yPos += 10
  
  doc.setFontSize(11)
  doc.setTextColor(60, 60, 60)
  const problemText = repair.RepairOrder?.problema_reportado || 'Sin descripción'
  const splitProblem = doc.splitTextToSize(problemText, 180)
  doc.text(splitProblem, 14, yPos)
  yPos += splitProblem.length * 7 + 5
  
  // Repair Details Section
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text("Detalles de Reparación", 14, yPos)
  yPos += 10
  
  doc.setFontSize(11)
  doc.setTextColor(60, 60, 60)
  
  const repairInfo = [
    ['Título:', repair.titulo || 'N/A'],
    ['Estado:', repair.estado || 'N/A'],
    ['Costo:', `$${repair.tiempo_invertido_min || 0}`],
  ]
  
  repairInfo.forEach(([label, value]) => {
    doc.text(label, 14, yPos)
    doc.text(value, 60, yPos)
    yPos += 7
  })
  
  yPos += 5
  
  // Description Section
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text("Descripción del Trabajo", 14, yPos)
  yPos += 10
  
  doc.setFontSize(11)
  doc.setTextColor(60, 60, 60)
  const descriptionText = repair.descripcion || 'Sin descripción'
  const splitDescription = doc.splitTextToSize(descriptionText, 180)
  doc.text(splitDescription, 14, yPos)
  yPos += splitDescription.length * 7 + 5
  
  // Dates Section
  if (yPos > 250) {
    doc.addPage()
    yPos = 20
  }
  
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text("Fechas", 14, yPos)
  yPos += 10
  
  doc.setFontSize(11)
  doc.setTextColor(60, 60, 60)
  
  const dateInfo = [
    ['Fecha Recibido:', repair.RepairOrder?.fecha_recibido 
      ? new Date(repair.RepairOrder.fecha_recibido).toLocaleDateString('es-AR')
      : 'N/A'],
    ['Fecha Inicio:', repair.fecha_inicio 
      ? new Date(repair.fecha_inicio).toLocaleDateString('es-AR')
      : 'N/A'],
    ['Fecha Fin:', repair.fecha_fin 
      ? new Date(repair.fecha_fin).toLocaleDateString('es-AR')
      : 'N/A'],
  ]
  
  dateInfo.forEach(([label, value]) => {
    doc.text(label, 14, yPos)
    doc.text(value, 60, yPos)
    yPos += 7
  })
  
  // Technician Information
  if (repair.RepairOrder?.Tecnico) {
    yPos += 5
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text("Técnico Asignado", 14, yPos)
    yPos += 10
    
    doc.setFontSize(11)
    doc.setTextColor(60, 60, 60)
    doc.text('Nombre:', 14, yPos)
    doc.text(repair.RepairOrder.Tecnico.name || 'N/A', 60, yPos)
    yPos += 7
    doc.text('Email:', 14, yPos)
    doc.text(repair.RepairOrder.Tecnico.email || 'N/A', 60, yPos)
  }
  
  // Footer
  const fecha = new Date().toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  doc.setFontSize(9)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generado el ${fecha}`, 14, doc.internal.pageSize.height - 20)
  doc.text("TechFix - Sistema de Gestión de Reparaciones", 14, doc.internal.pageSize.height - 14)
  
  // Save
  doc.save(`Reparacion_${repair.id}_${new Date().getTime()}.pdf`)
}
