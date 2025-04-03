"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { format } from "date-fns"

interface Shipment {
  id: number
  name: string
  shipmentDate: string
  status: string
  createdAt: string
  capital: { name: string }
  expenses: { amount: number }[]
}

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [capitals, setCapitals] = useState<any[]>([])
  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [expenseTypes, setExpenseTypes] = useState<any[]>([])

  const [form, setForm] = useState({
    capitalId: "",
    shipmentDate: "",
    items: [{ customerId: "", productId: "", quantity: 1 }],
    expenses: [{ expenseTypeId: "", amount: 0 }]
  })

  useEffect(() => {
    fetch("/api/shipments").then(res => res.json()).then(setShipments)
    fetch("/api/capital").then(res => res.json()).then(setCapitals)
    fetch("/api/customers").then(res => res.json()).then(setCustomers)
    fetch("/api/products").then(res => res.json()).then(setProducts)
    fetch("/api/expense-types").then(res => res.json()).then(setExpenseTypes)
  }, [])

  const submit = async () => {
    if (!form.shipmentDate || !form.capitalId) {
      return alert("Please fill all required fields.")
    }
    if (form.items.length === 0) {
      return alert("Please add at least one product.")
    }
    for (const item of form.items) {
      if (!item.customerId || !item.productId || item.quantity <= 0) {
        return alert("Please fill all product fields correctly.")
      }
    }
    if (form.expenses.some(e => !e.expenseTypeId || e.amount <= 0)) {
      return alert("Please complete all expense fields.")
    }

    const res = await fetch("/api/shipments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      const newShipment = await res.json()
      setShipments([newShipment, ...shipments])
    } else {
      alert("Failed to add shipment.")
    }
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Shipments</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Shipment</Button>
          </DialogTrigger>
          <DialogContent className=" bg-white dark:bg-gray-800">
            <DialogHeader>
              <DialogTitle>Create Shipment</DialogTitle>
            </DialogHeader>

            <Input
              type="date"
              value={form.shipmentDate}
              onChange={(e) => setForm({ ...form, shipmentDate: e.target.value })}
            />

            <Select onValueChange={(val) => setForm({ ...form, capitalId: val })}>
              <SelectTrigger >
                <SelectValue placeholder="Select Capital Source" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900">
                {capitals.filter(c => c.status === "open" && !c.permanentlyClosed).map(c => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name} (MVR {c.remaining})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <h2 className="font-semibold mt-4">Products</h2>
            {form.items.map((item, i) => (
              <div key={i} className=" grid grid-cols-3 gap-1 ">
                <Select value={item.customerId} onValueChange={(val) => {
                  const next = [...form.items]; next[i].customerId = val
                  setForm({ ...form, items: next })
                }}>
                  <SelectTrigger><SelectValue placeholder="Customer" /></SelectTrigger>
                  <SelectContent>
                    {customers.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.outlet}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={item.productId} onValueChange={(val) => {
                  const next = [...form.items]; next[i].productId = val
                  setForm({ ...form, items: next })
                }}>
                  <SelectTrigger><SelectValue placeholder="Product" /></SelectTrigger>
                  <SelectContent>
                    {products.map(p => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.name} (Remaining: {p.remaining ?? 0})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => {
                    const next = [...form.items]; next[i].quantity = parseInt(e.target.value)
                    setForm({ ...form, items: next })
                  }}
                  placeholder="Qty"
                />
              </div>
            ))}

            <Button
              variant="outline"
              onClick={() => setForm({ ...form, items: [...form.items, { customerId: "", productId: "", quantity: 1 }] })}
            >
              + Add Product
            </Button>

            <h2 className="font-semibold mt-2">Expenses</h2>
            {form.expenses.map((exp, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Select value={exp.expenseTypeId} onValueChange={(val) => {
                  const next = [...form.expenses]; next[i].expenseTypeId = val
                  setForm({ ...form, expenses: next })
                }}>
                  <SelectTrigger className="w-48"><SelectValue placeholder="Expense Type" /></SelectTrigger>
                  <SelectContent>
                    {expenseTypes.map(e => (
                      <SelectItem key={e.id} value={String(e.id)}>{e.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={String(exp.amount)}
                  onChange={(e) => {
                    const next = [...form.expenses]; next[i].amount = parseFloat(e.target.value)
                    setForm({ ...form, expenses: next })
                  }}
                  className="w-24"
                  placeholder="MVR"
                />
              </div>
            ))}

            <Button
              variant="outline"
              onClick={() => setForm({ ...form, expenses: [...form.expenses, { expenseTypeId: "", amount: 0 }] })}
            >
              + Add Expense
            </Button>

            <Button className="mt-4" onClick={submit}>Submit</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-auto border border-gray-200 rounded dark:border-gray-700">
        <table className="w-full text-sm text-left">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Shipment Date</th>
              <th className="px-4 py-2">Created</th>
              <th className="px-4 py-2">Capital</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Expenses (MVR)</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((s) => (
              <tr key={s.id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2">
                  <Link href={`/shipments/${s.id}`} className="text-green-700 underline">
                    {s.name}
                  </Link>
                </td>
                <td className="px-4 py-2">{format(new Date(s.shipmentDate), "dd/MM/yyyy")}</td>
                <td className="px-4 py-2">{format(new Date(s.createdAt), "dd/MM/yyyy HH:mm")}</td>
                <td className="px-4 py-2">{s.capital.name}</td>
                <td className="px-4 py-2 capitalize">{s.status}</td>
                <td className="px-4 py-2">
                  MVR {s.expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  <Link href={`/shipments/${s.id}`}>
                    <Button size="sm" variant="outline">View</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}