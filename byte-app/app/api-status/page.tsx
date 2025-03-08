import { ApiStatus } from "@/components/api-status"

export default function ApiStatusPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-secondary-light">
        <span className="text-primary-orange">BYTE</span> API Status
      </h1>
      <div className="max-w-md mx-auto">
        <ApiStatus />
      </div>
    </div>
  )
}

