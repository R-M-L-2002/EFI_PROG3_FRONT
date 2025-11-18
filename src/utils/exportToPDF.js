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
  
  const order = repair.RepairOrder || repair.Order || repair.order || {}
  const device = order.Device || order.device || {}
  const deviceModel = device.DeviceModel || device.device_model || device.model || {}
  const brand = deviceModel.Brand || deviceModel.brand || {}
  
  // Extract customer info with fallbacks
  const customer = order.Customer || order.customer || {}
  const customerName = customer.name || 
    (customer.first_name ? `${customer.first_name} ${customer.last_name || ''}`.trim() : null) ||
    "N/A"
  
  // Extract technician info with fallbacks
  const technician = order.Tecnico || order.tecnico || order.Technician || order.technician || {}
  const technicianName =
    (technician.name && technician.name.trim()) ||
    (technician.first_name
      ? `${technician.first_name} ${technician.last_name || ''}`.trim()
      : null) ||
    technician.email ||
    "N/A"
  
  const deviceInfo = [
    ['Marca:', brand.name || brand.brand_name || deviceModel.brand_name || 'N/A'],
    ['Modelo:', deviceModel.name || deviceModel.model_name || 'N/A'],
    ['Número de Serie:', device.serial_number || device.serialNumber || 'N/A'],
    ['Estado Físico:', device.physical_state || device.estado_fisico || device.physicalState || 'N/A'],
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
  const problemText = order.problema_reportado || order.reported_problem || repair.problema || 'Sin descripción'
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
    ['Título:', repair.titulo || repair.title || 'N/A'],
    ['Estado:', repair.estado || repair.status || 'N/A'],
    ['Costo:', `$${repair.tiempo_invertido_min || repair.cost || 0}`],
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
  const descriptionText = repair.descripcion || repair.description || 'Sin descripción'
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
    ['Fecha Recibido:', order.fecha_ingreso || order.fecha_recibido
      ? new Date(order.fecha_ingreso || order.fecha_recibido).toLocaleDateString('es-AR')
      : 'N/A'],
    ['Fecha Inicio:', repair.fecha_inicio || repair.start_date
      ? new Date(repair.fecha_inicio || repair.start_date).toLocaleDateString('es-AR')
      : 'N/A'],
    ['Fecha Fin:', repair.fecha_fin || repair.end_date
      ? new Date(repair.fecha_fin || repair.end_date).toLocaleDateString('es-AR')
      : 'N/A'],
  ]
  
  dateInfo.forEach(([label, value]) => {
    doc.text(label, 14, yPos)
    doc.text(value, 60, yPos)
    yPos += 7
  })
  
  yPos += 5
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text("Cliente y Técnico", 14, yPos)
  yPos += 10
  
  doc.setFontSize(11)
  doc.setTextColor(60, 60, 60)
  
  doc.text('Cliente:', 14, yPos)
  doc.text(customerName, 60, yPos)
  yPos += 7
  
  doc.text('Técnico:', 14, yPos)
  doc.text(technicianName, 60, yPos)
  yPos += 7
  
  if (technician.email) {
    doc.text('Email Técnico:', 14, yPos)
    doc.text(technician.email, 60, yPos)
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
