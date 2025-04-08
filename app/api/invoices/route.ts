// ✅ FILE: /api/invoices/route.ts

import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// ✅ GET all invoices
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        shipment: true,
        items: { include: { product: true } },
      },
    })
    return NextResponse.json(invoices)
  } catch (error) {
    console.error("❌ /api/invoices GET error:", error)
    return new NextResponse("Failed to fetch invoices", { status: 500 })
  }
}

// ✅ POST to create a new invoice
export async function POST(req: NextRequest) {
  try {
    const { shipmentId, customerId, dueDate, shippingCost } = await req.json()
    console.log("📦 Incoming invoice POST:", { shipmentId, customerId, dueDate, shippingCost })

    if (!shipmentId || !customerId || !dueDate || shippingCost == null) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        items: {
          where: { customerId },
          include: { product: true },
        },
      },
    })

    if (!shipment) return NextResponse.json({ error: "Shipment not found" }, { status: 404 })

    const code = `INVID${String(customerId).padStart(3, "0")}${shipment.name}/${new Date().getFullYear()}`

    const invoice = await prisma.invoice.create({
      data: {
        shipmentId,
        customerId,
        dueDate: new Date(dueDate),
        shippingCost: parseFloat(shippingCost),
        code,
        items: {
          create: shipment.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.sellingPrice,
          })),
        },
      },
      include: {
        customer: true,
        shipment: true,
        items: { include: { product: true } },
      },
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("❌ /api/invoices POST error:", error)
    return new NextResponse("Failed to create invoice", { status: 500 })
  }
}

// ✅ PUT to update invoice (dueDate/shippingCost)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    console.log("✏️ Invoice PUT request body:", body)
    const { id, dueDate, shippingCost } = body

    if (!id) return new NextResponse("Invoice ID required", { status: 400 })

    const invoice = await prisma.invoice.update({
      where: { id },
      data: {
        dueDate: dueDate ? new Date(dueDate) : undefined,
        shippingCost: shippingCost != null ? parseFloat(shippingCost) : undefined,
      },
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error("❌ /api/invoices PUT error:", error)
    return new NextResponse("Failed to update invoice", { status: 500 })
  }
}
