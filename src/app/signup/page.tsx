"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      // Redirect to login page with success message
      router.push("/login?registered=true")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  const year = new Date().getFullYear()
  return (
    <div className="flex h-screen w-full">
      {/* Left Side - lime Background */}
      <div className="hidden md:flex md:w-1/2 bg-lime-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="z-10">
          {/* Star/Asterisk Logo */}
          <div className="text-white text-5xl mb-12">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L14.6 9.4H22L16.2 14L18.2 22L12 17.3L5.8 22L7.8 14L2 9.4H9.4L12 2Z" fill="white" />
            </svg>
          </div>

          {/* Welcome Text */}
          <h1 className="text-white text-5xl font-bold mb-4">
            Join Us,
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
          <div className="absolute right-0 top-1/4 w-3/4 h-3/4 border border-lime-600/20 rounded-tl-full"></div>
          <div className="absolute right-0 top-1/3 w-2/3 h-2/3 border border-lime-600/20 rounded-tl-full"></div>
          <div className="absolute right-0 top-1/2 w-1/2 h-1/2 border border-lime-600/20 rounded-tl-full"></div>
          <div className="absolute right-0 top-2/3 w-1/3 h-1/3 border border-lime-600/20 rounded-tl-full"></div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-right mr-2 mb-6">
            <span className="text-xl font-bold">SportScope KSA</span>
          </div>

          <div className="text-left mb-8">
            <h2 className="text-2xl font-bold mb-2">Create an Account</h2>
            <p className="text-zinc-600">Join SportScope KSA to start automating your tasks.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full p-3 border-b border-zinc-300 focus:border-lime-700 focus:outline-none"
                required
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full p-3 border-b border-zinc-300 focus:border-lime-700 focus:outline-none"
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
                className="w-full p-3 border-b border-zinc-300 focus:border-lime-700 focus:outline-none"
                required
              />
            </div>

            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

            {/* Signup Button */}
            <Button
              type="submit"
              className="w-full font-medium py-6 cursor-pointer rounded mb-4 bg-lime-600 hover:bg-lime-700"
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>

            <div className="text-center mt-4">
              <p className="text-zinc-600">
                Already have an account?{" "}
                <Link href="/login" className="text-lime-600 hover:underline">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
