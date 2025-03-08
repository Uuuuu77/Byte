import { AuthTest } from "@/components/auth-test"

export default function AuthTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-secondary-light">Firebase Authentication Test</h1>
      <AuthTest />
    </div>
  )
}

