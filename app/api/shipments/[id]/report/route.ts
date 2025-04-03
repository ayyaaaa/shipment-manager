// FILE: app/api/shipments/[id]/report/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  const shipment = await prisma.shipment.findUnique({
    where: { id },
    include: {
      capital: true,
      items: {
        include: {
          customer: true,
          product: true,
        },
      },
      expenses: {
        include: { expenseType: true },
      },
    },
  });

  if (!shipment) {
    return NextResponse.json({ error: "Shipment not found" }, { status: 404 });
  }

  const revenue = shipment.items.reduce((sum, i) => sum + i.product.sellingPrice * i.quantity, 0);
  const cost = shipment.items.reduce((sum, i) => sum + i.product.costPrice * i.quantity, 0);
  const expensesTotal = shipment.expenses.reduce((sum, e) => sum + e.amount, 0);
  const profit = revenue - (cost + expensesTotal);

  return NextResponse.json({
    ...shipment,
    revenue,
    cost,
    expensesTotal,
    profit,
  });
}
