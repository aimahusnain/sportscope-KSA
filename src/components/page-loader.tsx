"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function Loader() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Function to handle route change start
    const handleRouteChangeStart = () => {
      setIsLoading(true)
    }
    
    // Create listeners for navigation events
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as Element).closest("a")
      if (
        target && 
        (target as HTMLAnchorElement).href && 
        !(target as HTMLAnchorElement).target && 
        !(target as HTMLAnchorElement).download && 
        !e.metaKey && 
        !e.ctrlKey && 
        !e.shiftKey && 
        !e.altKey &&
        (target as HTMLAnchorElement).origin === window.location.origin
      ) {
        handleRouteChangeStart()
      }
    }

    // Add event listeners
    window.addEventListener("beforeunload", handleRouteChangeStart)
    document.addEventListener("click", handleLinkClick as EventListener)

    return () => {
      // Clean up event listeners
      window.removeEventListener("beforeunload", handleRouteChangeStart)
      document.removeEventListener("click", handleLinkClick as EventListener)
    }
  }, [])

  // Route change has completed when pathname changes
  useEffect(() => {
    setIsLoading(false)
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70 dark:bg-zinc-900 dark:bg-opacity-70 backdrop-blur-sm transition-opacity">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-6 border-lime-600 dark:border-lime-500 border-t-transparent dark:border-t-transparent rounded-full animate-spin"></div>
        <span className="text-zinc-800 dark:text-zinc-200 font-medium">Loading...</span>
      </div>
    </div>
  )
}