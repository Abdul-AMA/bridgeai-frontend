import { Geist, Geist_Mono } from "next/font/google";

// Load Geist Sans
export const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Load Geist Mono
export const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});
