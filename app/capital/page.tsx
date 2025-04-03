// ✅ FILE: app/capital/page.tsx

"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogFooter,
  AlertDialogCancel, AlertDialogAction
} from "@/components/ui/alert-dialog"
import { Pencil, Trash2, Lock } from "lucide-react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

interface Capital {
  id: number
  name: string
  amount: number
  remaining: number
  status: string
  permanentlyClosed: boolean
}

export default function CapitalPage() {
  const [capitals, setCapitals] = useState<Capital[]>([])
  const [filter, setFilter] = useState("all")

  const fetchCapitals = () => {
    fetch("/api/capital")
      .then((res) => res.json())
      .then(setCapitals)
  }

  useEffect(() => {
    fetchCapitals()
  }, [])

  const updateCapital = async (id: number, data: any) => {
    await fetch(`/api/capital/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    fetchCapitals()
  }

  const permanentlyClose = async (id: number) => {
    const confirmed = confirm("\u26a0\ufe0f This action is irreversible. Continue?")
    if (!confirmed) return

    await updateCapital(id, { permanentlyClosed: true, status: "closed" })
  }
  

  const filteredCapitals = capitals.filter((c) => {
    if (filter === "all") return true
    if (filter === "locked") return c.permanentlyClosed
    return c.status === filter
  })

  return (
    <div className="pt-12 md:pt-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
        <h1 className="text-2xl font-bold">Capital Sources</h1>

        <div className="flex gap-2">
          <Select onValueChange={setFilter} value={filter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-md">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="locked">Locked</SelectItem>
            </SelectContent>
          </Select>

          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Capital</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Capital</DialogTitle>
              </DialogHeader>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  const form = e.currentTarget
                  const amount = parseFloat(form.amount.value)

                  if (isNaN(amount) || amount <= 0) {
                    alert("Please enter a valid amount")
                    return
                  }

                  await fetch("/api/capital", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount }),
                  })

                  form.reset()
                  fetchCapitals()
                }}
                className="space-y-4 mt-2"
              >
                <input
                  name="amount"
                  type="number"
                  placeholder="Enter capital amount"
                  className="w-full border rounded px-3 py-2 bg-white text-black dark:bg-gray-900 dark:text-white"
                  required
                />

                <Button type="submit" className="w-full">
                  Save
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="overflow-auto rounded border border-gray-200 bg-white dark:bg-gray-800">
        <table className="w-full text-sm text-left">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Remaining</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Locked</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCapitals.map((c) => (
              <tr key={c.id} className="border-b dark:border-gray-700">
                <td className="px-4 py-2">
                  <Link href={`/capital/${c.id}`} className="text-green-700 underline">
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-2">MVR {c.amount.toFixed(2)}</td>
                <td className="px-4 py-2">MVR {c.remaining.toFixed(2)}</td>
                <td className="px-4 py-2 capitalize">{c.status}</td>
                <td className="px-4 py-2">
                  {c.permanentlyClosed ? (
                    <span className="text-red-500 flex items-center gap-1">
                      <Lock className="w-4 h-4" /> Locked
                    </span>
                  ) : "-"}
                </td>
                <td className="px-4 py-2 text-center space-x-2">
                  {!c.permanentlyClosed && (
                    <>
                      {c.status === "open" ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => updateCapital(c.id, { status: "closed" })}
                        >
                          Close
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateCapital(c.id, { status: "open" })}
                        >
                          Reopen
                        </Button>
                      )}

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => permanentlyClose(c.id)}
                      >
                        Permanently Close
                      </Button>
                    </>
                  )}

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this capital source?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            await fetch(`/api/capital/${c.id}`, { method: "DELETE" })
                            fetchCapitals()
                          }}
                        >
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
    </div>
  )
}