"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Bell, Calendar, Search, Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggler"
import { useState } from "react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="w-full sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left Section - Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-2 font-medium text-zinc-900 dark:text-white">
            <div className="bg-lime-500 text-white flex size-6 items-center justify-center rounded-md">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.6 9.4H22L16.2 14L18.2 22L12 17.3L5.8 22L7.8 14L2 9.4H9.4L12 2Z" fill="currentColor" />
              </svg>
            </div>
            <span className="hidden sm:inline">SportScope KSA</span>
            <span className="sm:hidden">SSK</span>
          </Link>
        </div>

        {/* Center Section - Search Bar (Hidden on mobile) */}
        <div className="hidden lg:flex flex-1 justify-center px-8 max-w-md mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 h-9 text-sm border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500 dark:focus:ring-lime-400 dark:focus:border-lime-400"
            />
          </div>
        </div>

        {/* Right Section - Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-2">
          {/* Navigation Links */}
          <nav className="flex items-center space-x-1">
            <Button asChild variant="ghost" size="sm">
              <Link href="#" className="text-sm font-medium">
                Dashboard
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="#" className="text-sm font-medium">
                Exchange
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="#" className="text-sm font-medium">
                Wallet
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="#" className="text-sm font-medium">
                Map
              </Link>
            </Button>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center space-x-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-9 h-9 p-0 hover:bg-black/10 hover:dark:bg-white/10"
            >
              <Calendar className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-9 h-9 p-0 hover:bg-black/10 hover:dark:bg-white/10 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </Button>

            <ThemeToggle />

            <div className="ml-2">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700">
                <Image
                  src="/placeholder.svg?height=32&width=32"
                  alt="User profile"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Right Section */}
        <div className="flex lg:hidden items-center space-x-2">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-9 h-9 p-0 hover:bg-black/10 hover:dark:bg-white/10"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96 p-6">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-700">
                  <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Menu</h2>
                </div>

                {/* Mobile Search */}
                <div className="py-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <Input
                      type="text"
                      placeholder="Search..."
                      className="pl-10 pr-4 h-12 text-base border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
                    />
                  </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-3 py-2 flex-1">
                  <Button asChild variant="ghost" className="justify-start h-12 text-base px-4 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={() => setIsOpen(false)}>
                    <Link href="#">Dashboard</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start h-12 text-base px-4 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={() => setIsOpen(false)}>
                    <Link href="#">Exchange</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start h-12 text-base px-4 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={() => setIsOpen(false)}>
                    <Link href="#">Wallet</Link>
                  </Button>
                  <Button asChild variant="ghost" className="justify-start h-12 text-base px-4 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={() => setIsOpen(false)}>
                    <Link href="#">Map</Link>
                  </Button>
                </nav>

                {/* Mobile Actions - Bottom Section */}
                <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-12 h-12 p-0 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <Calendar className="w-5 h-5" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-12 h-12 p-0 relative rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <Bell className="w-5 h-5" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                      </Button>
                    </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">John Doe</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">john@example.com</p>
                    </div>
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700">
                      <Image
                        src="/placeholder.svg?height=48&width=48"
                        alt="User profile"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}