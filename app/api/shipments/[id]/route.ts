import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const shipmentId = parseInt(params.id)

    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        capital: true,
        expenses: {
          include: { expenseType: true }
        },
        items: {
          include: {
            product: true,
            customer: true,
          }
        }
      }
    })

    if (!shipment) return new NextResponse("Shipment not found", { status: 404 })

    const itemProfits = shipment.items.map(item => {
      const profitPerItem = item.product.sellingPrice - item.product.costPrice
      return profitPerItem * item.quantity
    })

    const grossRevenue = shipment.items.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0)
    const cost = shipment.items.reduce((sum, item) => sum + (item.product.costPrice * item.quantity), 0)
    const totalExpenses = shipment.expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const netProfit = grossRevenue - cost - totalExpenses

    return NextResponse.json({
      ...shipment,
      summary: {
        grossRevenue,
        cost,
        totalExpenses,
        netProfit
      }
    })
  } catch (err) {
    console.error("❌ /api/shipments/[id]/report error:", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
