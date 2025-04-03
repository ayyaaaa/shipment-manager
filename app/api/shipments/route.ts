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

    if (!shipmentDate || !capitalId || !items || !expenses) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // Get the latest shipment ID to generate a new name
    const last = await prisma.shipment.findFirst({
      orderBy: { id: "desc" },
    })

    const number = last ? String(last.id + 1).padStart(3, "0") : "001"
    const name = `SHIP${number}`

    const totalExpense = expenses.reduce(
      (sum: number, e: any) => sum + Number(e.amount),
      0
    )

    // Check capital balance
    const capital = await prisma.capital.findUnique({
      where: { id: Number(capitalId) },
    })

    if (!capital || capital.remaining < totalExpense) {
      return NextResponse.json({ error: "Insufficient capital balance" }, { status: 400 })
    }

    // Create shipment
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
      },
    })

    // Deduct total expenses from capital
    await prisma.capital.update({
      where: { id: Number(capitalId) },
      data: {
        remaining: { decrement: totalExpense },
      },
    })

    return NextResponse.json(shipment)
  } catch (err) {
    console.error("SHIPMENT ERROR:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
