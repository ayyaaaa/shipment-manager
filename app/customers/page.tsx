"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Pencil, Trash2 } from "lucide-react"
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

interface Customer {
  id: number
  outlet: string
  owner: string
  contact: string
  location: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  const [newCustomer, setNewCustomer] = useState({
    outlet: "",
    owner: "",
    contact: "",
    location: "",
  })

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [deleteCustomerId, setDeleteCustomerId] = useState<number | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch("/api/customers")
        const data = await res.json()
        setCustomers(data)
      } catch (error) {
        console.error("Failed to fetch customers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const handleAddCustomer = async () => {
    if (!newCustomer.outlet || !newCustomer.owner || !newCustomer.contact) return

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      })

      const created = await res.json()
      setCustomers((prev) => [created, ...prev])
      setNewCustomer({ outlet: "", owner: "", contact: "", location: "" })
    } catch (err) {
      console.error("Error adding customer:", err)
    }
  }

  const handleDeleteCustomer = async (id: number) => {
    try {
      await fetch(`/api/customers/${id}`, { method: "DELETE" })
      setCustomers((prev) => prev.filter((cust) => cust.id !== id))
      setDeleteCustomerId(null)
    } catch (err) {
      console.error("Failed to delete customer:", err)
    }
  }

  const handleUpdateCustomer = async () => {
    if (!editingCustomer) return

    try {
      const res = await fetch(`/api/customers/${editingCustomer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingCustomer),
      })

      const updated = await res.json()

      setCustomers((prev) =>
        prev.map((cust) => (cust.id === updated.id ? updated : cust))
      )

      setEditingCustomer(null)
    } catch (err) {
      console.error("Error updating customer:", err)
    }
  }

  return (
    <div className="pt-12 md:pt-0">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Outlets & Customers</h1>

        {/* Add Customer Modal */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Customer</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Shop Name"
                value={newCustomer.outlet}
                onChange={(e) => setNewCustomer({ ...newCustomer, outlet: e.target.value })}
              />
              <Input
                placeholder="Owner"
                value={newCustomer.owner}
                onChange={(e) => setNewCustomer({ ...newCustomer, owner: e.target.value })}
              />
              <Input
                placeholder="Contact"
                value={newCustomer.contact}
                onChange={(e) => setNewCustomer({ ...newCustomer, contact: e.target.value })}
              />
              <Input
                placeholder="Location"
                value={newCustomer.location}
                onChange={(e) => setNewCustomer({ ...newCustomer, location: e.target.value })}
              />
              <Button onClick={handleAddCustomer}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Customer Modal */}
      <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Shop Name"
              value={editingCustomer?.outlet || ""}
              onChange={(e) =>
                setEditingCustomer((prev) => prev && { ...prev, outlet: e.target.value })
              }
            />
            <Input
              placeholder="Owner"
              value={editingCustomer?.owner || ""}
              onChange={(e) =>
                setEditingCustomer((prev) => prev && { ...prev, owner: e.target.value })
              }
            />
            <Input
              placeholder="Contact"
              value={editingCustomer?.contact || ""}
              onChange={(e) =>
                setEditingCustomer((prev) => prev && { ...prev, contact: e.target.value })
              }
            />
            <Input
              placeholder="Location"
              value={editingCustomer?.location || ""}
              onChange={(e) =>
                setEditingCustomer((prev) => prev && { ...prev, location: e.target.value })
              }
            />
            <Button onClick={handleUpdateCustomer}>Update</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Table */}
      <div className="overflow-auto rounded border border-gray-200 bg-white dark:bg-gray-800">
        <table className="w-full text-sm text-left">
          <thead className="bg-green-700 text-white">
            <tr>
              <th className="px-4 py-2">Shop Name</th>
              <th className="px-4 py-2">Owner</th>
              <th className="px-4 py-2">Location</th>
              <th className="px-4 py-2">Contact</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-muted-foreground">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="border-b dark:border-gray-700">
                  <td className="px-4 py-2">{customer.outlet}</td>
                  <td className="px-4 py-2">{customer.owner}</td>
                  <td className="px-4 py-2">{customer.location}</td>
                  <td className="px-4 py-2">{customer.contact}</td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCustomer(customer)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>

                    {/* Delete Confirmation */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteCustomerId(customer.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete this customer?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCustomer(customer.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
