import React from "react"
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font
} from "@react-pdf/renderer"

// Optional: Set custom font
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/roboto/v29/KFOmCnqEu92Fr1Me5Q.ttf",
    },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 12,
    padding: 40,
    lineHeight: 1.5,
    flexDirection: "column",
  },
  section: { marginBottom: 20 },
  heading: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  tableHeader: { flexDirection: "row", borderBottom: 1, paddingBottom: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
})

export default function InvoicePdf({ invoice }: { invoice: any }) {
  const total = invoice.items.reduce(
    (sum: number, item: any) => sum + item.quantity * item.product.sellingPrice,
    0
  ) + Number(invoice.shippingCost || 0)

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>INVOICE</Text>
          <Text>Code: {invoice.code}</Text>
          <Text>Date: {new Date(invoice.createdAt).toLocaleDateString()}</Text>
          <Text>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text>Invoice To:</Text>
          <Text>{invoice.customer?.owner}</Text>
          <Text>{invoice.customer?.outlet}</Text>
          <Text>{invoice.customer?.location}</Text>
          <Text>{invoice.customer?.contact}</Text>
        </View>

        <View style={styles.section}>
          <Text style={{ marginBottom: 8 }}>Items:</Text>
          <View style={styles.tableHeader}>
            <Text style={{ width: "40%" }}>Description</Text>
            <Text style={{ width: "15%", textAlign: "right" }}>Weight</Text>
            <Text style={{ width: "15%", textAlign: "right" }}>Qty</Text>
            <Text style={{ width: "15%", textAlign: "right" }}>Price</Text>
            <Text style={{ width: "15%", textAlign: "right" }}>Total</Text>
          </View>
          {invoice.items.map((item: any, idx: number) => (
            <View key={idx} style={styles.row}>
              <Text style={{ width: "40%" }}>{item.product.name}</Text>
              <Text style={{ width: "15%", textAlign: "right" }}>{item.product.weight}kg</Text>
              <Text style={{ width: "15%", textAlign: "right" }}>{item.quantity}</Text>
              <Text style={{ width: "15%", textAlign: "right" }}>MVR {item.price.toFixed(2)}</Text>
              <Text style={{ width: "15%", textAlign: "right" }}>
                MVR {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          <View style={{ marginTop: 8 }}>
            <Text>Shipping: MVR {invoice.shippingCost.toFixed(2)}</Text>
            <Text style={{ fontWeight: "bold" }}>Total: MVR {total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text>Remarks:</Text>
          <Text>Kindly make payment to Aishath Shany Ismail</Text>
          <Text>BML MVR Account number: 7730000515564</Text>
          <Text style={{ marginTop: 8, fontSize: 10 }}>
            **Items to be returned/reimbursed upon failure to pay by due date
          </Text>
        </View>
      </Page>
    </Document>
  )
}
