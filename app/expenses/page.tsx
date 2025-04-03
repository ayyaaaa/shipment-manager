"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function ExpenseTypesPage() {
  const [types, setTypes] = useState<any[]>([])
  const [name, setName] = useState("")

  const fetchTypes = () => {
    fetch("/api/expense-types").then(res => res.json()).then(setTypes)
  }

  useEffect(() => {
    fetchTypes()
  }, [])

  const submit = async () => {
    if (!name) return alert("Please enter name")
    const res = await fetch("/api/expense-types", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
    if (res.ok) {
      setName("")
      fetchTypes()
    } else {
      alert("Failed to add. Maybe already exists.")
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Expense Types</h1>
        <Dialog>
          <DialogTrigger asChild><Button className="bg-green-700 hover:bg-green-500">Add Type</Button></DialogTrigger>
          <DialogContent className="dark:bg-gray-800">
            <DialogHeader><DialogTitle>Add Expense Type</DialogTitle></DialogHeader>
            <Input className="dark:bg-gray-900" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Uber, Airport Fees" />
            <Button className="bg-green-700" onClick={submit}>Save</Button>
          </DialogContent>
        </Dialog>
      </div>
      <ul className="space-y-2">
        {types.map(t => (
          <li key={t.id} className="border p-2 rounded bg-white dark:bg-gray-800">{t.name}</li>
        ))}
      </ul>
    </div>
  )
}
