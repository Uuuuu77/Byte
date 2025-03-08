"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, User, BookOpen, Newspaper, BarChart3, Settings } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
  }

  return (
    <header className="border-b border-gray-800 bg-primary-black/90 backdrop-blur-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl sm:text-3xl font-bold flex items-center">
            <div className="flex items-center">
              <span className="text-primary-orange">B</span>
              <span className="text-white">Y</span>
              <span className="text-primary-orange">T</span>
              <span className="text-white">E</span>
            </div>
          </Link>
          <nav className="hidden md:flex space-x-1">
            <Link
              href="/"
              className="px-3 py-2 rounded-md text-secondary-light hover:text-primary-orange hover:bg-primary-black/40 transition-colors flex items-center"
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Research
            </Link>
            <Link
              href="/discover"
              className="px-3 py-2 rounded-md text-secondary-light hover:text-primary-orange hover:bg-primary-black/40 transition-colors flex items-center"
            >
              <Newspaper className="h-4 w-4 mr-1" />
              Discover
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="px-3 py-2 rounded-md text-secondary-light hover:text-primary-orange hover:bg-primary-black/40 transition-colors flex items-center"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
            )}
            <Link
              href="/pricing"
              className="px-3 py-2 rounded-md text-secondary-light hover:text-primary-orange hover:bg-primary-black/40 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/api-status"
              className="px-3 py-2 rounded-md text-secondary-light hover:text-primary-orange hover:bg-primary-black/40 transition-colors flex items-center"
            >
              <Settings className="h-4 w-4 mr-1" />
              API Status
            </Link>
          </nav>
          <div className="hidden md:block">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link href="/settings">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 hover:bg-primary-orange hover:text-white"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="border-gray-700 hover:bg-primary-orange hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="primary" className="hover:bg-primary-gold text-white transition-colors duration-300">
                  <User className="h-4 w-4 mr-2" />
                  My Account
                </Button>
              </Link>
            )}
          </div>
          <button
            className="md:hidden text-secondary-light p-2 rounded-md hover:bg-primary-black/40"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-primary-black/95 backdrop-blur-md">
          <nav className="flex flex-col space-y-1 p-4">
            <Link
              href="/"
              className="px-3 py-2 rounded-md text-secondary-light hover:text-primary-orange hover:bg-primary-black/40 transition-colors flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Research
            </Link>
            <Link
              href="/discover"
              className="px-3 py-2 rounded-md text-secondary-light hover:text-primary-orange hover:bg-primary-black/40 transition-colors flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Newspaper className="h-4 w-4 mr-2" />
              Discover
            </Link>
            {user && (
              <Link
                href="/dashboard"
                className="px-3 py-2 rounded-md text-secondary-light hover:text-primary-orange hover:bg-primary-black/40 transition-colors flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            )}
            <Link
              href="/pricing"
              className="px-3 py-2 rounded-md text-secondary-light hover:text-primary-orange hover:bg-primary-black/40 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/api-status"
              className="px-3 py-2 rounded-md text-secondary-light hover:text-primary-orange hover:bg-primary-black/40 transition-colors flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <Settings className="h-4 w-4 mr-2" />
              API Status
            </Link>
            {user ? (
              <>
                <Link
                  href="/settings"
                  className="px-3 py-2 rounded-md text-secondary-light hover:text-primary-orange hover:bg-primary-black/40 transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-secondary-light hover:text-primary-orange hover:bg-primary-black/40 transition-colors flex items-center w-full text-left"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="px-3 py-2 rounded-md text-secondary-light hover:text-primary-orange hover:bg-primary-black/40 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4 mr-2" />
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

