import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// GET single invoice by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      shipment: true,
      items: { include: { product: true } },
    },
  })

  if (!invoice) return new NextResponse("Invoice not found", { status: 404 })

  return NextResponse.json(invoice)
}

// DELETE invoice
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)

  try {
    await prisma.invoiceItem.deleteMany({ where: { invoiceId: id } })
    await prisma.invoice.delete({ where: { id } })
    return new NextResponse("Invoice deleted")
  } catch (err) {
    console.error("❌ Delete invoice error:", err)
    return new NextResponse("Failed to delete invoice", { status: 500 })
  }
}

// PDF generation using jsPDF and autoTable
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id)
  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      shipment: true,
      items: { include: { product: true } },
    },
  })

  if (!invoice) return new NextResponse("Invoice not found", { status: 404 })

  const doc = new jsPDF()

  doc.setFontSize(18)
  doc.text("INVOICE", 14, 20)

  doc.setFontSize(12)
  doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 150, 20, { align: "right" })
  doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 150, 30, { align: "right" })
  doc.text(`Invoice Code: ${invoice.code}`, 14, 30)

  doc.text("Invoice To:", 14, 45)
  doc.text(invoice.customer.owner, 14, 52)
  doc.text(invoice.customer.outlet, 14, 58)
  doc.text(invoice.customer.location, 14, 64)
  doc.text(invoice.customer.contact, 14, 70)

  autoTable(doc, {
    startY: 80,
    head: [["Description", "Weight", "Qty", "Unit Price", "Total"]],
    body: invoice.items.map((item) => [
      item.product.name,
      `${item.product.weight}kg`,
      item.quantity,
      `MVR ${item.price.toFixed(2)}`,
      `MVR ${(item.price * item.quantity).toFixed(2)}`,
    ]),
  })

  const totalAmount = invoice.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  ) + Number(invoice.shippingCost || 0)

  const finalY = doc.lastAutoTable.finalY || 100

  doc.text(`Shipping: MVR ${invoice.shippingCost.toFixed(2)}`, 14, finalY + 10)
  doc.text(`Total: MVR ${totalAmount.toFixed(2)}`, 14, finalY + 20)

  doc.text("Remarks:", 14, finalY + 35)
  doc.text("Kindly make payment to Aishath Shany Ismail", 14, finalY + 41)
  doc.text("BML MVR Account number: 7730000515564", 14, finalY + 47)
  doc.text("**Items to be returned/reimbursed upon failure to pay by due date", 14, finalY + 60)

  const pdfOutput = doc.output("arraybuffer")
  return new NextResponse(Buffer.from(pdfOutput), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=Invoice_${invoice.code}.pdf`,
    },
  })
}
