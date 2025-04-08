"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"

interface Invoice {
  id: number
  code: string
  dueDate: string
  shippingCost: number
  createdAt: string
  status: string
  customer: {
    outlet: string
    owner: string
    location: string
    contact: string
  }
  shipment: {
    name: string
  }
  items: {
    product: {
      name: string
      weight: number
    }
    quantity: number
    price: number
  }[]
}

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const [invoice, setInvoice] = useState<Invoice | null>(null)

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then(res => res.json())
      .then(data => setInvoice(data))
  }, [id])

  const downloadPDF = async () => {
    const res = await fetch(`/api/invoices/${id}`, { method: "POST" })
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Invoice_${invoice?.code}.pdf`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!invoice) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-green-700">Invoice Details</h1>

      <div className="bg-gray-500 rounded p-4 shadow">
        <div className="text-gray-700">
          <p><strong>Invoice Code:</strong> {invoice.code}</p>
          <p><strong>Created At:</strong> {format(new Date(invoice.createdAt), "dd/MM/yyyy")}</p>
          <p><strong>Due Date:</strong> {format(new Date(invoice.dueDate), "dd/MM/yyyy")}</p>
          <p><strong>Status:</strong> {invoice.status}</p>
          <p><strong>Shipment:</strong> {invoice.shipment.name}</p>
        </div>

        <div className="mt-4">
          <h2 className="font-semibold mb-2">Customer Info</h2>
          <p>{invoice.customer.owner}</p>
          <p>{invoice.customer.outlet}</p>
          <p>{invoice.customer.location}</p>
          <p>{invoice.customer.contact}</p>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold mb-2">Items</h2>
          <table className="w-full text-sm text-left">
            <thead className="bg-green-700 text-white">
              <tr>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Weight</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Unit Price</th>
                <th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{item.product.name}</td>
                  <td className="px-4 py-2">{item.product.weight}kg</td>
                  <td className="px-4 py-2">{item.quantity}</td>
                  <td className="px-4 py-2">MVR {item.price.toFixed(2)}</td>
                  <td className="px-4 py-2">MVR {(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={4} className="text-right px-4 py-2 font-semibold">Shipping:</td>
                <td className="px-4 py-2">MVR {invoice.shippingCost.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={4} className="text-right px-4 py-2 font-bold">Total:</td>
                <td className="px-4 py-2 font-bold">
                  MVR {(
                    invoice.items.reduce((sum, i) => sum + i.quantity * i.price, 0) +
                    invoice.shippingCost
                  ).toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Button onClick={downloadPDF}>Download PDF</Button>
        </div>
      </div>
    </div>
  )
}
