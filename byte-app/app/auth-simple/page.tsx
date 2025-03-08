import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleAuthButton } from "@/components/google-auth-button"

export default function SimpleAuthPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md bg-primary-black/40 border-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-secondary-light">
            Simple Google Authentication Test
          </CardTitle>
        </CardHeader>
        <CardContent>
          <GoogleAuthButton />
        </CardContent>
      </Card>
    </div>
  )
}

