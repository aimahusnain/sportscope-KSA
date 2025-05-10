"use client";

import {
  Database,
  LayoutDashboard,
  Moon as MoonIcon,
  Plus,
  Sun as SunIcon
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function RadialMenu() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Setup radial menu functionality
  useEffect(() => {
    // Don't set up event handlers if we're not on the home page
    if (pathname !== "/") return;

    // Function to toggle the radial menu open/closed
    const handleFabClick = () => {
      const radialElement = document.querySelector(".radial");
      radialElement?.classList.toggle("open");
    };

    // Function to close the radial menu when an option is clicked
    const handleMenuItemClick = () => {
      const radialElement = document.querySelector(".radial");
      radialElement?.classList.remove("open");
    };

    // Add event listeners after component mounts
    const fabButton = document.querySelector(".fab");
    fabButton?.addEventListener("click", handleFabClick);

    // Add event listeners to all menu items
    const menuItems = document.querySelectorAll("#fa-1, #fa-2, #fa-3");
    menuItems.forEach((item) => {
      item?.addEventListener("click", handleMenuItemClick);
    });

    // Clean up event listeners on unmount
    return () => {
      fabButton?.removeEventListener("click", handleFabClick);
      menuItems.forEach((item) => {
        item?.removeEventListener("click", handleMenuItemClick);
      });
    };
  }, [pathname]); // Add pathname as dependency

  // Toggle theme and close menu
  const handleThemeToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setTheme(theme === "dark" ? "light" : "dark");
    const radialElement = document.querySelector(".radial");
    radialElement?.classList.remove("open");
    console.log("Theme toggled to:", theme === "dark" ? "light" : "dark");
  };

  // Early return after all hooks have been called
  if (pathname !== "/") return null;

  return (
    <>
      <div className="container z-50 relative">
        <div className="row">
          {/* Radial menu container */}
          <div className="radial fixed w-24 h-24 left-6 bottom-6 bg-lime-500 rounded-full transition-all duration-500 shadow-md">
            {/* Menu buttons */}
            <Link href="/database">
              <button
                // href="/database"
                id="fa-1"
                className="fixed left-[60px] bottom-[57px] bg-transparent border-0 text-white flex items-center justify-center p-0 m-0 transition-all duration-500 hover:text-lime-300"
              >
                <Database size={48} />
              </button>
            </Link>

            {/* Theme toggle button (replaced Home icon) */}
            <button
              id="fa-2"
              onClick={handleThemeToggle}
              className="fixed left-[60px] bottom-[57px] bg-transparent border-0 text-white flex items-center justify-center p-0 m-0 transition-all duration-500 hover:text-lime-300"
              aria-label="Toggle theme"
            >
              {mounted &&
                (theme === "dark" ? (
                  <SunIcon size={48} />
                ) : (
                  <MoonIcon size={48} />
                ))}
            </button>

              <Link href="/">
            <button
              id="fa-3"
              className="fixed left-[60px] bottom-[57px] bg-transparent border-0 text-white flex items-center justify-center p-0 m-0 transition-all duration-500 hover:text-lime-300"
            >
              <LayoutDashboard size={48} />
            </button>
              </Link>

            {/* Main button */}
            <button className="fab fixed w-24 h-24 left-6 bottom-6 bg-lime-500 text-white rounded-full border-0 transition-all duration-500 hover:bg-lime-700">
              <div
                id="plus"
                className="flex justify-center mt-2 transition-all duration-500"
              >
                <Plus size={48} />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Custom styles that can't be easily done with Tailwind */}
      <style jsx>{`
        * {
          box-sizing: border-box;
        }
        button:focus {
          outline: 0;
        }

        /* Open state styles */
        .radial.open {
          height: 400px;
          width: 400px;
          left: -125px;
          bottom: -125px;
        }
        .radial.open .fab {
          background-color: #497d00;
          box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15),
            0px 4px 8px rgba(0, 0, 0, 0.2);
        }
        .radial.open #plus {
          transform: rotateZ(135deg) translate(-1px, 3px);
        }
        .radial.open #fa-1 {
          transition-delay: 0s;
          transform: translate(110px, 10px);
        }
        .radial.open #fa-2 {
          transition-delay: 0.1s;
          transform: translate(85px, -85px);
        }
        .radial.open #fa-3 {
          transition-delay: 0.2s;
          transform: translate(-10px, -110px);
        }
      `}</style>
    </>
  );
}
