import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const shipments = await prisma.shipment.findMany({
    include: {
      capital: true,
      expenses: true,
    },
    orderBy: { createdAt: "desc" }
  })
  return NextResponse.json(shipments)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { shipmentDate, capitalId, items, expenses } = body

    if (!shipmentDate || !capitalId || !items?.length || !expenses) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const last = await prisma.shipment.findFirst({ orderBy: { id: "desc" } })
    const number = last ? String(last.id + 1).padStart(3, "0") : "001"
    const name = `SHIP${number}`

    const totalExpense = expenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0)

    const capital = await prisma.capital.findUnique({ where: { id: Number(capitalId) } })
    if (!capital || capital.remaining < totalExpense) {
      return NextResponse.json({ error: "Insufficient capital balance" }, { status: 400 })
    }

    const shipment = await prisma.shipment.create({
      data: {
        name,
        shipmentDate: new Date(shipmentDate),
        capitalId: Number(capitalId),
        items: {
          create: items.map((i: any) => ({
            customerId: Number(i.customerId),
            productId: Number(i.productId),
            quantity: Number(i.quantity),
          })),
        },
        expenses: {
          create: expenses.map((e: any) => ({
            expenseTypeId: Number(e.expenseTypeId),
            amount: Number(e.amount),
          })),
        },
      },
      include: {
        capital: true,
        expenses: true,
        items: {
          include: {
            product: true,
            customer: true,
          }
        }
      },
    })

    await prisma.capital.update({
      where: { id: Number(capitalId) },
      data: {
        remaining: { decrement: totalExpense },
      },
    })

    // ✅ Auto-generate invoices per customer
    const customersMap: { [customerId: number]: any[] } = {}
    for (const item of shipment.items) {
      if (!customersMap[item.customerId]) {
        customersMap[item.customerId] = []
      }
      customersMap[item.customerId].push(item)
    }

    for (const customerIdStr in customersMap) {
      const customerId = Number(customerIdStr)
      const customerItems = customersMap[customerId]

      await prisma.invoice.create({
        data: {
          shipmentId: shipment.id,
          customerId,
          dueDate: new Date(), // placeholder; should be updated by user later
          shippingCost: 0, // placeholder
          status: "unpaid",
          items: {
            create: customerItems.map(i => ({
              productId: i.productId,
              quantity: i.quantity,
              price: i.product.sellingPrice,
            })),
          },
        }
      })
    }

    return NextResponse.json(shipment)
  } catch (err) {
    console.error("SHIPMENT ERROR:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
