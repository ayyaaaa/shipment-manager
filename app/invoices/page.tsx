"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export default function InvoicesPage() {
  const [shipments, setShipments] = useState([])
  const [customers, setCustomers] = useState([])
  const [invoices, setInvoices] = useState([])
  const [shipmentId, setShipmentId] = useState("")
  const [customerId, setCustomerId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [shippingCost, setShippingCost] = useState("")
  const [editingInvoice, setEditingInvoice] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetch("/api/invoices").then(res => res.json()).then(setInvoices)
    fetch("/api/shipments").then(res => res.json()).then(setShipments)
    fetch("/api/customers").then(res => res.json()).then(setCustomers)
  }, [])

  const createInvoice = async () => {
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shipmentId: Number(shipmentId),
        customerId: Number(customerId),
        dueDate,
        shippingCost,
      }),
    })
    if (res.ok) {
      toast.success("Invoice created")
      const data = await res.json()
      setInvoices(prev => [data, ...prev])
    } else {
      const err = await res.text()
      toast.error(err)
    }
  }

  const updateInvoice = async () => {
    const res = await fetch("/api/invoices", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: editingInvoice.id,
        dueDate: editingInvoice.dueDate,
        shippingCost: editingInvoice.shippingCost,
      }),
    })
    if (res.ok) {
      toast.success("Invoice updated")
      setInvoices(prev => prev.map(i => i.id === editingInvoice.id ? { ...i, ...editingInvoice } : i))
      setEditingInvoice(null)
    } else {
      toast.error("Failed to update invoice")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return
    const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Invoice deleted")
      setInvoices(prev => prev.filter(i => i.id !== id))
    } else {
      toast.error("Failed to delete invoice")
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-700">Invoices</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Invoice</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Invoice</DialogTitle>
            </DialogHeader>

            <Select value={shipmentId} onValueChange={setShipmentId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Shipment" />
              </SelectTrigger>
              <SelectContent>
                {shipments.map((s: any) => (
                  <SelectItem key={s.id} value={String(s.id)}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select Customer" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c: any) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.outlet}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Shipping Cost"
              value={shippingCost}
              onChange={(e) => setShippingCost(e.target.value)}
            />

            <Button onClick={createInvoice}>Submit</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="p-2 text-left w-[150px]">Customer</th>
              <th className="p-2 text-left w-[120px]">Shipment</th>
              <th className="p-2 text-left w-[120px]">Due Date</th>
              <th className="p-2 text-left w-[100px]">Shipping</th>
              <th className="p-2 text-left w-[100px]">Total</th>
              <th className="p-2 text-left w-[180px]">Code</th>
              <th className="p-2 text-left w-[80px]">Status</th>
              <th className="p-2 text-left w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((i: any) => {
              const itemTotal = i.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
              const total = itemTotal + Number(i.shippingCost || 0)
              return (
                <tr key={i.id} className="border-t">
                  <td className="p-2 text-left w-[150px]">{i.customer?.outlet}</td>
                  <td className="p-2 text-left w-[120px]">{i.shipment?.name}</td>
                  <td className="p-2 text-left w-[120px]">{format(new Date(i.dueDate), "dd/MM/yyyy")}</td>
                  <td className="p-2 text-left w-[100px]">MVR {i.shippingCost.toFixed(2)}</td>
                  <td className="p-2 text-left w-[100px]">MVR {total.toFixed(2)}</td>
                  <td className="p-2 text-left w-[180px] text-xs text-blue-600 underline cursor-pointer" onClick={() => router.push(`/invoices/${i.id}`)}>{i.code}</td>
                  <td className="p-2 text-left w-[80px]">
                    <span className={`text-sm font-semibold ${i.status === 'paid' ? 'text-green-500' : 'text-red-500'}`}>{i.status}</span>
                  </td>
                  <td className="p-2 text-left w-[100px] space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => setEditingInvoice({ id: i.id, dueDate: i.dueDate.split("T")[0], shippingCost: i.shippingCost })}>Edit</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit Invoice</DialogTitle>
                        </DialogHeader>

                        <Input
                          type="date"
                          value={editingInvoice?.dueDate || ""}
                          onChange={(e) => setEditingInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                        />
                        <Input
                          type="number"
                          value={editingInvoice?.shippingCost || ""}
                          onChange={(e) => setEditingInvoice(prev => ({ ...prev, shippingCost: parseFloat(e.target.value) }))}
                        />
                        <Button onClick={updateInvoice}>Update</Button>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(i.id)}>Delete</Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
