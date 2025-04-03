import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const data = await req.json()
  const customer = await prisma.customer.update({
    where: { id: Number(params.id) },
    data,
  })
  return NextResponse.json(customer)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.customer.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ success: true })
}
