import type { Metadata } from "next";
import { Mulish, Roboto } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils"; // adjust path as necessary
import { Toaster } from "@/components/ui/sonner"
import NextTopLoadoer from "nextjs-toploader";
import {NuqsAdapter} from "nuqs/adapters/next/app";

export const metadata: Metadata = {
  title: "🚗✨ Car Dealership Website 🌟",
  description: "🚘 A modern car dealership website showcasing a wide range of vehicles, services, and promotions. 🌟🔥",
};

const mulish = Mulish({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> 
      <body
        className= {cn("antialiased overscroll-none bg-background", roboto.variable, mulish.variable)}
      >
        
        <NextTopLoadoer showSpinner={false} />
        <NuqsAdapter>{children}</NuqsAdapter>
        <Toaster />
      </body>
    </html>
  );
}
