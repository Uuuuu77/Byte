"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

export function PaymentOptimizer() {
  const [amount, setAmount] = useState("")
  const [recipient, setRecipient] = useState("")
  const [chain, setChain] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSendPayment = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, recipient, chain }),
      })
      const data = await response.json()
      if (data.success) {
        toast({
          title: "Payment Sent",
          description: `Transaction hash: ${data.txHash}`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("Payment failed:", error)
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (USDC)" type="number" />
      <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="Recipient Address" />
      <Select value={chain} onValueChange={setChain}>
        <SelectTrigger>
          <SelectValue placeholder="Select blockchain" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="polygon">Polygon</SelectItem>
          <SelectItem value="solana">Solana</SelectItem>
          <SelectItem value="celo">Celo</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleSendPayment} className="w-full" disabled={loading}>
        {loading ? "Processing..." : "Send Payment"}
      </Button>
    </div>
  )
}

