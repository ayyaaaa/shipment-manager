import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const id = Number(params.id);

    const { name, costPrice, sellingPrice, weight } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: { name, costPrice, sellingPrice, weight },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("❌ /api/products/[id] PUT error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    await prisma.product.delete({ where: { id } });
    return new NextResponse("Deleted", { status: 200 });
  } catch (err) {
    console.error("❌ /api/products/[id] DELETE error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
