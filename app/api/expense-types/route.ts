import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const types = await prisma.expenseType.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json(types)
}

export async function POST(req: Request) {
  const { name } = await req.json()
  const exists = await prisma.expenseType.findFirst({ where: { name } })
  if (exists) return NextResponse.json({ error: "Already exists" }, { status: 400 })

  const created = await prisma.expenseType.create({ data: { name } })
  return NextResponse.json(created)
}
