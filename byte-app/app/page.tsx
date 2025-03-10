import { Suspense } from "react"
import { ResearchAssistant } from "@/components/research-assistant"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ResearchAssistant />
      </Suspense>
    </div>
  )
}

