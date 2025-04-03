"use client"

import { useEffect, useState } from "react"
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
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Pencil, Trash2 } from "lucide-react"

interface Product {
  id: number
  name: string
  costPrice: number
  sellingPrice: number
  weight: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    costPrice: 0,
    sellingPrice: 0,
    weight: 0,
  })
  const [editing, setEditing] = useState<Product | null>(null)

  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load products")
        return res.json()
      })
      .then(setProducts)
      .catch(err => console.error("❌ Product load error:", err))
  }, [])

  const handleAdd = async () => {
    if (form.sellingPrice <= form.costPrice) {
      alert("Selling price must be higher than cost price")
      return
    }

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error("❌ API Error:", errorText)
      return
    }

    const data = await res.json()
    setProducts([data, ...products])
    setForm({ name: "", costPrice: 0, sellingPrice: 0, weight: 0 })
  }

  const handleUpdate = async () => {
    if (!editing) return
    if (editing.sellingPrice <= editing.costPrice) {
      alert("Selling price must be higher than cost price")
      return
    }

    const res = await fetch(`/api/products/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    })
    const updated = await res.json()
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    )
    setEditing(null)
  }

  const handleDelete = async (id: number) => {
    await fetch(`/api/products/${id}`, { method: "DELETE" })
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="pt-12 md:pt-0">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Products</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button >Add Product</Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-gray-800" >
            <DialogHeader>
              <DialogTitle>Add Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Input
                placeholder="Product Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="dark:bg-gray-900"
              />
              <Input
                type="number"
                placeholder="Cost Price"
                value={form.costPrice}
                onChange={(e) => setForm({ ...form, costPrice: parseFloat(e.target.value) })}
                className="dark:bg-gray-900"

              />
              <Input
                type="number"
                placeholder="Selling Price"
                value={form.sellingPrice}
                onChange={(e) => setForm({ ...form, sellingPrice: parseFloat(e.target.value) })}
                className="dark:bg-gray-900"

/>
              <Input
                type="number"
                placeholder="Weight"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) })}
                className="dark:bg-gray-900"

/>
              <Button className="bg-green-700" onClick={handleAdd}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-auto rounded border border-gray-200 bg-white dark:bg-gray-800">
        <table className="w-full text-sm text-left">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Cost (MVR)</th>
              <th className="px-4 py-2">Price (MVR)</th>
              <th className="px-4 py-2">Weight</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2">{p.name}</td>
                <td className="px-4 py-2">MVR {p.costPrice}</td>
                <td className="px-4 py-2">MVR {p.sellingPrice}</td>
                <td className="px-4 py-2">{p.weight}</td>
                <td className="px-4 py-2 space-x-2 text-center">
                  <Button size="sm" variant="outline" onClick={() => setEditing(p)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this product?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(p.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-2">
              <Input
                value={editing.name}
                onChange={(e) => setEditing((prev) => prev && { ...prev, name: e.target.value })}
              />
              <Input
                type="number"
                value={editing.costPrice}
                onChange={(e) => setEditing((prev) => prev && { ...prev, costPrice: parseFloat(e.target.value) })}
              />
              <Input
                type="number"
                value={editing.sellingPrice}
                onChange={(e) => setEditing((prev) => prev && { ...prev, sellingPrice: parseFloat(e.target.value) })}
              />
              <Input
                type="number"
                value={editing.weight}
                onChange={(e) => setEditing((prev) => prev && { ...prev, weight: parseFloat(e.target.value) })}
              />
              <Button onClick={handleUpdate}>Update</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}