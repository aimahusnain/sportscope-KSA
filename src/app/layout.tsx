import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import FloatingActionButton from "@/components/floating-action-button";
import { NextAuthProvider } from "@/provider/next-auth-provider";
import Loader from "@/components/page-loader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SportScope KSA",
  description:
    "SportScope KSA is an interactive data tool for visualizing sports facility gaps across Saudi Arabia. Designed for planners and decision-makers to support strategic, data-driven infrastructure planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
            <Loader />
            <FloatingActionButton />
            {children}
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}