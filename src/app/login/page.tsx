"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const year = new Date().getFullYear()

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
      })

      console.log("Sign in result:", result)

      if (result?.error) {
        setError("Invalid email or password")
        setIsLoading(false)
        return
      }

      // Success - Go to home page after successful login
      router.push("/")
    } catch (error) {
      console.error("Login error:", error)
      setError("Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("google", {
        redirect: false,
      })

      if (result?.error) {
        setError("Failed to login with Google")
        setIsLoading(false)
        return
      }

      router.push("/")
    } catch (error) {
      console.error("Google login error:", error)
      setError("Something went wrong with Google login.")
      setIsLoading(false)
    }
  }
  
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-lime-500 text-white flex size-6 items-center justify-center rounded-md">
              <svg className="size-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.6 9.4H22L16.2 14L18.2 22L12 17.3L5.8 22L7.8 14L2 9.4H9.4L12 2Z" fill="currentColor" />
              </svg>
            </div>
            SportScope KSA
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-muted-foreground text-sm text-balance">
                  Enter your email below to login to your account
                </p>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="m@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="#"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                  />
                </div>
                
                {error && (
                  <div className="text-red-500 text-sm text-center">{error}</div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-lime-500 hover:bg-lime-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-background text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Login with Google
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="flex h-screen w-full bg-lime-500 dark:bg-lime-700 flex-col justify-between p-12 relative overflow-hidden">
        <div>
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
          <div className="text-white/60 text-sm z-10 mt-auto">© {year} SportScope KSA. All rights reserved.</div>

          {/* Background geometric pattern */}
          <div className="absolute top-0 right-0 w-full h-full">
            <div className="absolute right-0 top-1/4 w-3/4 h-3/4 border border-lime-500/20 dark:border-lime-500/20 rounded-tl-full"></div>
            <div className="absolute right-0 top-1/3 w-2/3 h-2/3 border border-lime-500/20 dark:border-lime-500/20 rounded-tl-full"></div>
            <div className="absolute right-0 top-1/2 w-1/2 h-1/2 border border-lime-500/20 dark:border-lime-500/20 rounded-tl-full"></div>
            <div className="absolute right-0 top-2/3 w-1/3 h-1/3 border border-lime-500/20 dark:border-lime-500/20 rounded-tl-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}