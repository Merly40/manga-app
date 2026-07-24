import type { Metadata } from "next";
import { Prompt, Mali } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import ChatWidget from "@/components/ChatWidget";

const themeInitScript = `try{if(localStorage.getItem('manga-neko-theme')==='dark'){document.documentElement.classList.add('dark')}}catch(e){}`;

const body = Prompt({ subsets: ["thai", "latin"], weight: ["400", "500", "600", "700"], variable: "--font-body" });
const display = Mali({ subsets: ["thai", "latin"], weight: ["500", "600", "700"], variable: "--font-display" });

export const metadata: Metadata = { title: "Manhwa Duchess", description: "เว็บไซต์อ่านมังงะแปลไทย" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="th" className={`${body.variable} ${display.variable}`}><body className="min-h-screen bg-[#fffafb] font-body text-[#5d3542]"><Script id="theme-init" strategy="beforeInteractive">{themeInitScript}</Script><AuthProvider><Navbar /><main>{children}</main><ChatWidget /></AuthProvider></body></html>;
}
