import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const capitalId = parseInt(params.id)

    if (isNaN(capitalId)) {
      return new NextResponse("Invalid capital ID", { status: 400 })
    }

    const capital = await prisma.capital.findUnique({
      where: { id: capitalId },
      include: {
        stocks: {
          include: {
            product: true,
          },
          orderBy: { createdAt: "asc" },
        },
        shipments: {
          include: {
            items: {
              include: {
                customer: true,
                product: true,
              },
            },
            expenses: {
              include: {
                expenseType: true,
              },
            },
          },
          orderBy: { shipmentDate: "asc" },
        },
      },
    })

    if (!capital) {
      return new NextResponse("Capital not found", { status: 404 })
    }

    return NextResponse.json(capital)
  } catch (err) {
    console.error("❌ /api/capital/[id]/report error:", err)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
