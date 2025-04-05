import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ✅ GET all products with related stock and shipment items
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        stocks: true,           // ✅ use "stocks" here
        shipmentItems: true,
      },
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error("GET /api/products error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

// ✅ POST to create a new product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, costPrice, sellingPrice, weight } = body

    if (!name || costPrice == null || sellingPrice == null || weight == null) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const product = await prisma.product.create({
      data: {
        name,
        costPrice,
        sellingPrice,
        weight,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("POST /api/products error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
