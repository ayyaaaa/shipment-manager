import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// POST /api/stock
export async function POST(req: NextRequest) {
  try {
    const { productId, capitalId, quantity } = await req.json()

    if (!productId || !capitalId || !quantity) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const capital = await prisma.capital.findUnique({
      where: { id: capitalId },
    })

    if (!capital || capital.status !== "open" || capital.permanentlyClosed) {
      return NextResponse.json({ error: "Invalid capital source" }, { status: 400 })
    }

    const totalCost = product.costPrice * quantity

    if (capital.remaining < totalCost) {
      return new NextResponse("Insufficient capital", { status: 400 })
    }

    const stock = await prisma.stock.create({
      data: {
        productId,
        capitalId,
        quantity,
        createdAt: new Date(),
      },
    })

    await prisma.capital.update({
      where: { id: capitalId },
      data: {
        remaining: { decrement: totalCost },
      },
    })

    return NextResponse.json(stock)
  } catch (error) {
    console.error("❌ STOCK POST ERROR:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
