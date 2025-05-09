"use client"

import { useEffect, useState } from "react"
import FloatingActionButton from "./floating-action-button"

// This component ensures client-side rendering for components that might cause hydration issues
export default function ClientComponentWrapper() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Return null during SSR to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return <FloatingActionButton />
}