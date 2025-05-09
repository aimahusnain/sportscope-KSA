"use client"

import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"

function NotFoundContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 bg-white dark:bg-zinc-900">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-6xl font-bold text-lime-600 dark:text-lime-500 mb-6">404</h1>
        <h2 className="text-2xl font-bold mb-3 text-zinc-900 dark:text-white">Page Not Found</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
        </p>
        <Button asChild className="bg-lime-600 hover:bg-lime-700 dark:bg-lime-700 dark:hover:bg-lime-600">
          <Link href="/">
            Go Back Home
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default function NotFound() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  )
}