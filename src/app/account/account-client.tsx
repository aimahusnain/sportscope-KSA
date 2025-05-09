"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "next-auth"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { Loader2, Moon, Sun, UserIcon, Bell, Shield, LogOut } from "lucide-react"
import { toast } from "sonner"

interface AccountPageClientProps {
  user: User | undefined
}

export default function AccountPageClient({ user }: AccountPageClientProps) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would update the user profile here
      // const response = await fetch("/api/user/update", {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // })

      toast.success("Profile updated", {
        description: "Your profile information has been updated successfully.",
      })
    } catch (error) {
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleLogout = async () => {
    router.push("/api/auth/signout")
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.name) return "U"
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/3">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                  <AvatarFallback className="text-xl bg-lime-600 text-white">{getInitials()}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">{user?.name || "User"}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Customize your interface preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                  <span>Dark Mode</span>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full mt-6 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 border-red-200 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="profile">
                <UserIcon className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account information</CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your email"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isUpdating} className="bg-lime-600 hover:bg-lime-700">
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isUpdating ? "Updating..." : "Update Profile"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Switch
                      defaultChecked
                      onChange={(checked) => {
                        if (checked) {
                          toast.success("Email notifications enabled")
                        } else {
                          toast.info("Email notifications disabled")
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing Emails</p>
                      <p className="text-sm text-muted-foreground">Receive marketing emails</p>
                    </div>
                    <Switch
                      onChange={(checked) => {
                        if (checked) {
                          toast.success("Marketing emails enabled")
                        } else {
                          toast.info("Marketing emails disabled")
                        }
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Activity Summary</p>
                      <p className="text-sm text-muted-foreground">Weekly summary of your activity</p>
                    </div>
                    <Switch
                      defaultChecked
                      onChange={(checked) => {
                        if (checked) {
                          toast.success("Activity summaries enabled")
                        } else {
                          toast.info("Activity summaries disabled")
                        }
                      }}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="bg-lime-600 hover:bg-lime-700"
                    onClick={() => {
                      toast.success("Preferences saved", {
                        description: "Your notification preferences have been updated.",
                      })
                    }}
                  >
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" placeholder="••••••••" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="bg-lime-600 hover:bg-lime-700"
                    onClick={(e) => {
                      e.preventDefault()
                      toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
                        loading: "Updating password...",
                        success: "Password changed successfully!",
                        error: "Failed to change password.",
                      })
                    }}
                  >
                    Change Password
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
