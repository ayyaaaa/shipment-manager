"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function ShipmentReportPage() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/shipments/${id}/report`)
      .then((res) => res.json())
      .then(setData)
  }, [id])

  if (!data) return <p className="p-4">Loading...</p>

  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Shipment Report", 14, 20)

    doc.setFontSize(12)
    doc.text(`Name: ${data.name}`, 14, 30)
    doc.text(`Date: ${format(new Date(data.shipmentDate), "dd/MM/yyyy")}`, 14, 36)
    doc.text(`Capital: ${data.capital.name}`, 14, 42)
    doc.text(`Status: ${data.status}`, 14, 48)

    if (data.items?.length) {
      autoTable(doc, {
        startY: 56,
        head: [["Customer", "Product", "Qty", "Sell", "Cost", "Revenue", "Total Cost"]],
        body: data.items.map((item: any) => [
          item.customer.outlet,
          item.product.name,
          item.quantity,
          item.product.sellingPrice,
          item.product.costPrice,
          item.product.sellingPrice * item.quantity,
          item.product.costPrice * item.quantity
        ]),
        theme: "grid",
        headStyles: { fillColor: [34, 139, 34], textColor: [255, 255, 255] },
        styles: { lineColor: [34, 139, 34] },
      })
    }

    if (data.expenses?.length) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [["Expense Type", "Amount"]],
        body: data.expenses.map((e: any) => [e.expenseType.name, `MVR ${e.amount}`]),
        theme: "grid",
        headStyles: { fillColor: [34, 139, 34], textColor: [255, 255, 255] },
      })
    }

    doc.setTextColor(0)
    doc.text(`Gross Revenue: MVR ${data.revenue}`, 14, doc.lastAutoTable.finalY + 15)
    doc.text(`Cost: MVR ${data.cost}`, 14, doc.lastAutoTable.finalY + 22)
    doc.text(`Expenses: MVR ${data.expensesTotal}`, 14, doc.lastAutoTable.finalY + 29)
    doc.setTextColor(0, 128, 0)
    doc.text(`Net Profit: MVR ${data.profit}`, 14, doc.lastAutoTable.finalY + 36)

    doc.save(`Shipment_Report_${data.name}.pdf`)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-green-700">Shipment Report</h1>
          <p>Name: {data.name}</p>
          <p>Date: {format(new Date(data.shipmentDate), "dd/MM/yyyy")}</p>
          <p>Capital: {data.capital.name}</p>
          <p>Status: {data.status}</p>
        </div>
        <Button onClick={downloadPDF}>Download PDF</Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-green-600 mb-2">Products</h2>
        {data.items?.length ? (
          <table className="w-full border border-green-700 text-sm text-left">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Sell</th>
                <th className="px-4 py-2">Cost</th>
                <th className="px-4 py-2">Revenue</th>
                <th className="px-4 py-2">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item: any, i: number) => (
                <tr key={i} className="border-b border-green-700">
                  <td className="px-4 py-2">{item.customer.outlet}</td>
                  <td className="px-4 py-2">{item.product.name}</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">MVR {item.product.sellingPrice}</td>
                  <td className="px-4 py-2">MVR {item.product.costPrice}</td>
                  <td className="px-4 py-2">MVR {item.product.sellingPrice * item.quantity}</td>
                  <td className="px-4 py-2">MVR {item.product.costPrice * item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted-foreground">No products found in this shipment.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold text-green-600 mb-2">Expenses</h2>
        {data.expenses?.length ? (
          <table className="w-full border border-green-700 text-sm text-left">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Amount (MVR)</th>
              </tr>
            </thead>
            <tbody>
              {data.expenses.map((e: any, i: number) => (
                <tr key={i} className="border-b border-green-700">
                  <td className="px-4 py-2">{e.expenseType.name}</td>
                  <td className="px-4 py-2">MVR {e.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-muted-foreground">No expenses recorded.</p>
        )}
      </div>

      <div className="pt-4 text-green-800">
        <p>Gross Revenue: MVR {data.revenue}</p>
        <p>Cost: MVR {data.cost}</p>
        <p>Expenses: MVR {data.expensesTotal}</p>
        <p className="text-xl font-bold">Net Profit: MVR {data.profit}</p>
      </div>
    </div>
  )
}
