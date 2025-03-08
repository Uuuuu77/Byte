"use client"

import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TerminalProps {
  language: string
  code: string
}

export function Terminal({ language, code }: TerminalProps) {
  return (
    <Card className="bg-gray-900 border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-1">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        <span className="text-xs text-gray-400">{language}</span>
      </div>
      <ScrollArea className="h-[300px] w-full">
        <pre className="p-4">
          <code className={`language-${language}`}>{code}</code>
        </pre>
      </ScrollArea>
    </Card>
  )
}

