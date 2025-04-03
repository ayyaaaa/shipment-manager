// ✅ FILE: app/api/capital/[id]/route.ts

import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)
  const body = await req.json()

  try {
    const updateData: any = {}

    if (body.status) updateData.status = body.status
    if (typeof body.permanentlyClosed === "boolean") {
      updateData.permanentlyClosed = body.permanentlyClosed
    }

    const updated = await prisma.capital.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Failed to update capital:", error)
    return new NextResponse("Failed to update capital", { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id)

  try {
    await prisma.capital.delete({ where: { id } })
    return new NextResponse("Deleted", { status: 200 })
  } catch (error) {
    console.error("Failed to delete capital:", error)
    return new NextResponse("Failed to delete capital", { status: 500 })
  }
}
