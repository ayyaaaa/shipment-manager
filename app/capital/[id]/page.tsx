"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function CapitalReportPage() {
  const { id } = useParams()
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    if (id) {
      fetch(`/api/capital/${id}/report`)
        .then((res) => res.json())
        .then(setData)
    }
  }, [id])

  const downloadPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.setTextColor(34, 139, 34) // Green
    doc.text("Capital Report", 14, 20)

    doc.setFontSize(12)
    doc.text(`Capital: ${data.name}`, 14, 30)
    doc.text(`Total Amount: MVR ${data.amount}`, 14, 37)
    doc.text(`Remaining: MVR ${data.remaining}`, 14, 44)

    autoTable(doc, {
      startY: 52,
      head: [["Product", "Quantity", "Added On"]],
      body: data.stocks.map((s: any) => [
        s.product.name,
        s.quantity,
        format(new Date(s.createdAt), "dd/MM/yyyy")
      ]),
      theme: "grid",
      styles: {
        lineColor: [34, 139, 34],
        lineWidth: 0.5,
        textColor: 20,
        halign: "left",
      },
      headStyles: {
        fillColor: [34, 139, 34],
        textColor: [255, 255, 255],
        halign: "center",
      },
    })

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Name", "Date", "Status", "Expenses (MVR)"]],
      body: data.shipments.map((ship: any) => [
        ship.name,
        format(new Date(ship.shipmentDate), "dd/MM/yyyy"),
        ship.status,
        `${ship.expenses.reduce((sum: number, e: any) => sum + e.amount, 0)}`
      ]),
      theme: "grid",
      styles: {
        lineColor: [34, 139, 34],
        lineWidth: 0.5,
        textColor: 20,
        halign: "left",
      },
      headStyles: {
        fillColor: [34, 139, 34],
        textColor: [255, 255, 255],
        halign: "center",
      },
    })

    doc.save(`Capital_Report_${data.name}.pdf`)
  }

  if (!data) return <p className="p-4">Loading...</p>

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-green-700">Capital Report</h1>
          <p>Name: {data.name}</p>
          <p>Total: MVR {data.amount}</p>
          <p>Remaining: MVR {data.remaining}</p>
        </div>
        <Button onClick={downloadPDF}>Download PDF</Button>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-green-600 mb-1">Stocks</h2>
        <div className="overflow-auto border border-green-700 rounded">
          <table className="w-full text-sm text-left">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-4 py-2">Product</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Added On</th>
              </tr>
            </thead>
            <tbody>
              {data.stocks.map((s: any, i: number) => (
                <tr key={i} className="border-t border-green-700">
                  <td className="px-4 py-2">{s.product.name}</td>
                  <td className="px-4 py-2">{s.quantity}</td>
                  <td className="px-4 py-2">{format(new Date(s.createdAt), "dd/MM/yyyy")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-green-600 mb-1">Shipments</h2>
        <div className="overflow-auto border border-green-700 rounded">
          <table className="w-full text-sm text-left">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Expenses (MVR)</th>
              </tr>
            </thead>
            <tbody>
              {data.shipments.map((s: any, i: number) => (
                <tr key={i} className="border-t border-green-700">
                  <td className="px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2">{format(new Date(s.shipmentDate), "dd/MM/yyyy")}</td>
                  <td className="px-4 py-2 capitalize">{s.status}</td>
                  <td className="px-4 py-2">
                    {s.expenses.reduce((sum: number, e: any) => sum + e.amount, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
