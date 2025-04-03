import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        stocks: true,
        shipmentItems: true,
      },
    })

    const productsWithRemaining = products.map((p) => {
      const totalStock = p.stocks.reduce((sum, s) => sum + s.quantity, 0)
      const used = p.shipmentItems.reduce((sum, item) => sum + item.quantity, 0)
      return {
        ...p,
        remaining: totalStock - used,
      }
    })

    return NextResponse.json(productsWithRemaining)
  } catch (err) {
    console.error("❌ /api/products GET error:", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
