import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { AuthProvider } from "@/lib/auth-context"
import { StripeProvider } from "@/lib/stripe-provider"
import { PreferencesProvider } from "@/contexts/preferences-context"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BYTE - AI Research Assistant",
  description: "AI-powered research assistant for cryptocurrency and general topics",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-primary-black text-secondary-light min-h-screen flex flex-col`}>
        <AuthProvider>
          <StripeProvider>
            <PreferencesProvider>
              <Header />
              <main className="flex-grow">
                <Suspense fallback={<div className="flex justify-center items-center min-h-[60vh]">Loading...</div>}>
                  {children}
                </Suspense>
              </main>
              <footer className="border-t border-gray-800 bg-primary-black/80 backdrop-blur-md py-4">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-secondary-light/60">
                  © 2025 BYTE AI Research Assistant. All rights reserved.
                </div>
              </footer>
            </PreferencesProvider>
          </StripeProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'