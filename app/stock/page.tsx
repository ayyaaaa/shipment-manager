"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
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

interface Product {
  id: number
  name: string
  costPrice: number
  stocks?: { quantity: number; createdAt: string }[]
  shipmentItems?: { quantity: number }[]
}

interface Capital {
  id: number
  name: string
  remaining: number
  status: string
  permanentlyClosed: boolean
}

export default function StockPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [capitals, setCapitals] = useState<Capital[]>([])
  const [selectedProduct, setSelectedProduct] = useState("")
  const [selectedCapital, setSelectedCapital] = useState("")
  const [quantity, setQuantity] = useState("")

  useEffect(() => {
    fetch("/api/products").then(res => res.json()).then(setProducts)
    fetch("/api/capital")
      .then(res => res.json())
      .then((data) => {
        const openCaps = data.filter(
          (c: Capital) => c.status === "open" && !c.permanentlyClosed
        )
        setCapitals(openCaps)
      })
  }, [])

  const handleAddStock = async () => {
    if (!selectedProduct || !selectedCapital || !quantity || parseInt(quantity) <= 0) {
      return alert("Please fill all fields with valid values.")
    }

    const res = await fetch("/api/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: Number(selectedProduct),
        capitalId: Number(selectedCapital),
        quantity: parseInt(quantity),
      }),
    })

    if (!res.ok) {
      const msg = await res.text()
      alert(msg === "Insufficient capital" ? "❌ Not enough capital remaining!" : msg)
      return
    }

    alert("Stock added successfully!")
    setProducts([]) // refresh data
    setQuantity("")
    setSelectedCapital("")
    setSelectedProduct("")
    fetch("/api/products").then(res => res.json()).then(setProducts)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-700">Stock Management</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Stock</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add Stock</DialogTitle>
            </DialogHeader>

            <Select onValueChange={setSelectedProduct} value={selectedProduct}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Product" />
              </SelectTrigger>
              <SelectContent>
                {products.map(p => (
                  <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setSelectedCapital} value={selectedCapital}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Capital" />
              </SelectTrigger>
              <SelectContent>
                {capitals.map(c => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name} (MVR {c.remaining})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <Button onClick={handleAddStock}>Add</Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-auto border border-gray-200 rounded">
        <table className="w-full text-sm text-left">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Total Stock</th>
              <th className="px-4 py-2">Used</th>
              <th className="px-4 py-2">Remaining</th>
              <th className="px-4 py-2">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => {
              const total = (product.stocks ?? []).reduce((sum, s) => sum + s.quantity, 0)
              const used = (product.shipmentItems ?? []).reduce((sum, s) => sum + s.quantity, 0)
              const remaining = total - used
              const lastUpdate = (product.stocks ?? []).length > 0
                ? format(new Date((product.stocks ?? []).reduce((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b).createdAt), "dd/MM/yyyy")
                : "N/A"

              return (
                <tr key={product.id} className="border-b">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{total}</td>
                  <td className="px-4 py-2">{used}</td>
                  <td className="px-4 py-2">{remaining}</td>
                  <td className="px-4 py-2">{lastUpdate}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
