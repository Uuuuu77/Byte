import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export function DisclaimerBanner() {
  return (
    <Alert variant="warning">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Disclaimer</AlertTitle>
      <AlertDescription>
        This analysis is for informational purposes only. Not financial advice. Cryptocurrency markets are highly
        volatile. Always do your own research.
      </AlertDescription>
    </Alert>
  )
}

