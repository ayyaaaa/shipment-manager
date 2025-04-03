import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const capitals = await prisma.capital.findMany({
    orderBy: { createdAt: "desc" }
  })
  return NextResponse.json(capitals)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { amount } = body

  if (!amount || isNaN(amount)) {
    return new NextResponse("Invalid amount", { status: 400 })
  }

  // Auto-generate capital name like 1001C, 1002C...
  const existing = await prisma.capital.count()
  const name = `${1000 + existing}C`

  const capital = await prisma.capital.create({
    data: {
      name,
      amount,
      remaining: amount,
      status: "open",
      permanentlyClosed: false,
    }
  })

  return NextResponse.json(capital)
}
