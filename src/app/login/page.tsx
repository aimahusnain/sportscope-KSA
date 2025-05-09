"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Suspense } from "react"

// Create a separate component that uses useSearchParams
function LoginForm() {
  const { useSearchParams } = require("next/navigation")
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const callbackUrl = searchParams?.get("callbackUrl") || "/"
  const errorParam = searchParams?.get("error")

  useEffect(() => {
    if (errorParam) {
      setError("Authentication failed. Please check your credentials and try again.")
    }
  }, [errorParam])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Attempting to sign in with:", { email })

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      console.log("Sign in result:", result)

      if (result?.error) {
        setError("Invalid email or password")
        setIsLoading(false)
        return
      }

      if (result?.url) {
        router.push(result.url)
      } else {
        router.push(callbackUrl)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Email Field */}
      <div className="mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
          className="w-full p-3 border-b border-zinc-300 dark:border-zinc-700 focus:border-lime-700 dark:focus:border-lime-500 focus:outline-none bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
          required
        />
      </div>

      {/* Password Field */}
      <div className="mb-6">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 border-b border-zinc-300 dark:border-zinc-700 focus:border-lime-700 dark:focus:border-lime-500 focus:outline-none bg-transparent text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400"
          required
        />
      </div>

      {error && <div className="mb-4 text-red-500 dark:text-red-400 text-sm">{error}</div>}

      {/* Login Button */}
      <Button
        type="submit"
        className="w-full font-medium py-6 cursor-pointer rounded mb-4 text-white bg-lime-600 hover:bg-lime-700 dark:bg-lime-700 dark:hover:bg-lime-600"
        disabled={isLoading}
      >
        {isLoading ? "Logging in..." : "Login Now"}
      </Button>
    </form>
  )
}

export default function LoginPage() {
  const year = new Date().getFullYear()
  
  return (
    <div className="flex h-screen w-full bg-white dark:bg-zinc-900">
      {/* Left Side - lime Background */}
      <div className="hidden md:flex md:w-1/2 bg-lime-600 dark:bg-lime-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="z-10">
          {/* Star/Asterisk Logo */}
          <div className="text-white text-5xl mb-12">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.6 9.4H22L16.2 14L18.2 22L12 17.3L5.8 22L7.8 14L2 9.4H9.4L12 2Z" fill="white" />
            </svg>
          </div>

          {/* Welcome Text */}
          <h1 className="text-white text-5xl font-bold mb-4">
            Hello,
            <br />
            SportScope KSA!
          </h1>

          {/* Tagline */}
          <p className="text-white text-xl mt-6 max-w-md">
            Skip repetitive and manual sales-marketing tasks. Get highly productive through automation and save tons of
            time!
          </p>
        </div>

        {/* Copyright Footer */}
        <div className="text-white/60 text-sm z-10">© {year} SportScope KSA. All rights reserved.</div>

        {/* Background geometric pattern */}
        <div className="absolute top-0 right-0 w-full h-full">
          <div className="absolute right-0 top-1/4 w-3/4 h-3/4 border border-lime-600/20 dark:border-lime-500/20 rounded-tl-full"></div>
          <div className="absolute right-0 top-1/3 w-2/3 h-2/3 border border-lime-600/20 dark:border-lime-500/20 rounded-tl-full"></div>
          <div className="absolute right-0 top-1/2 w-1/2 h-1/2 border border-lime-600/20 dark:border-lime-500/20 rounded-tl-full"></div>
          <div className="absolute right-0 top-2/3 w-1/3 h-1/3 border border-lime-600/20 dark:border-lime-500/20 rounded-tl-full"></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 bg-white dark:bg-zinc-900">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-right mr-2 mb-6">
            <span className="text-xl font-bold text-zinc-900 dark:text-white">SportScope KSA</span>
          </div>

          <div className="text-left mb-8">
            <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-white">Welcome Back!</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Important to verify yourself before you can start using the app.</p>
          </div>

          <Suspense fallback={<div className="text-center py-4">Loading form...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}