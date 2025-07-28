"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Menu, User, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggler";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const hideHeader = pathname === "/login" || pathname === "/signup";

  // Get user's first letter
  const getUserInitial = () => {
    if (session?.user?.name) {
      return session.user.name.charAt(0).toUpperCase();
    }
    return "U"; // Default fallback
  };

  // Handle logout
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // Show loading state or return early if no session
  if (status === "loading") {
    return null; // Or a loading spinner
  }

  return (
    <>
      {!hideHeader && (
        <header className="w-full sticky top-0 z-[100] bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            {/* Left Section - Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex items-center gap-2 font-medium text-zinc-900 dark:text-white"
              >
                <div className="bg-lime-500 text-white flex size-6 items-center justify-center rounded-md">
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L14.6 9.4H22L16.2 14L18.2 22L12 17.3L5.8 22L7.8 14L2 9.4H9.4L12 2Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <span className="hidden sm:inline">SportScope KSA</span>
                <span className="sm:hidden">SSK</span>
              </Link>
            </div>

            {/* Center Section - Navigation Links */}
            <div className="hidden lg:flex flex-1 justify-center">
              <nav className="flex items-center space-x-5">
                <Button asChild size="sm" variant="outline">
                  <Link href="/" className="text-sm font-medium">
                    Dashboard
                  </Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href="/data-manager" className="text-sm font-medium">
                    Data Manager
                  </Link>
                </Button>
              </nav>
            </div>

            {/* Right Section - Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {/* Action Icons */}
              <div className="flex items-center space-x-1 ml-4">
                <ThemeToggle />
                <div className="ml-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="w-8 h-8 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-pointer flex items-center justify-center bg-gradient-to-br from-lime-500 to-lim-600 text-white font-semibold text-sm">
                        {session?.user?.image ? (
                          <Image
                            src={session.user.image}
                            alt="User profile"
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{getUserInitial()}</span>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48 p-2" align="end">
                      <div className="flex flex-col space-y-1">
                        <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-700">
                          <p className="text-sm font-medium text-zinc-900 dark:text-white">
                            {session?.user?.name || "User"}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {session?.user?.email || ""}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-10 px-3"
                          asChild
                        >
                          <Link href="/account">
                            <User className="w-4 h-4 mr-2" />
                            Account
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-10 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
                          onClick={handleLogout}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
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
                      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
                        Menu
                      </h2>
                    </div>
                    {/* Mobile Navigation */}
                    <nav className="flex flex-col space-y-3 py-2 flex-1">
                      <Button
                        asChild
                        variant="ghost"
                        className="justify-start h-12 text-base px-4 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/">Dashboard</Link>
                      </Button>
                      <Button
                        asChild
                        variant="ghost"
                        className="justify-start h-12 text-base px-4 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        onClick={() => setIsOpen(false)}
                      >
                        <Link href="/data-manager">Data Manager</Link>
                      </Button>
                    </nav>
                    {/* Mobile Actions - Bottom Section */}
                    <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700">
                      <div className="flex items-center justify-end">
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="text-sm font-medium text-zinc-900 dark:text-white">
                              {session?.user?.name || "User"}
                            </p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                              {session?.user?.email || ""}
                            </p>
                          </div>
                          <Popover>
                            <PopoverTrigger asChild>
                              <button className="w-12 h-12 rounded-full overflow-hidden border-2 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-pointer flex items-center justify-center bg-gradient-to-br from-lime-500 to-lime-600 text-white font-semibold">
                                {session?.user?.image ? (
                                  <Image
                                    src={session.user.image}
                                    alt="User profile"
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-lg">{getUserInitial()}</span>
                                )}
                              </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48 p-2" align="end">
                              <div className="flex flex-col space-y-1">
                                <div className="px-3 py-2 border-b border-zinc-200 dark:border-zinc-700">
                                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                                    {session?.user?.name || "User"}
                                  </p>
                                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {session?.user?.email || ""}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start h-10 px-3"
                                  asChild
                                >
                                  <Link href="/account">
                                    <User className="w-4 h-4 mr-2" />
                                    Account
                                  </Link>
                                </Button>
                                <Button
                                  variant="ghost"
                                  className="w-full justify-start h-10 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950"
                                  onClick={handleLogout}
                                >
                                  <LogOut className="w-4 h-4 mr-2" />
                                  Logout
                                </Button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
      )}
    </>
  );
}