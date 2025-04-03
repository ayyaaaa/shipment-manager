import "./globals.css"
import { Sidebar } from "../components/sidebar"

export const metadata = {
  title: "Shipment Manager",
  description: "Manage international shipments easily",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex bg-gray-100 text-black dark:bg-gray-900 dark:text-white">
        <Sidebar />
        <main className="flex-1 ml-0 md:ml-64 p-4 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}
