import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {Navbar} from "@/components/navbar/navbar";
import  Footer  from "@/components/footer/footer";
import { AuthProvider } from "@/modules/providers/auth-provider";
import { ThemeProvider } from "@/modules/providers/theme-provider";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevIDE - Vibe with Code",
  description: "Your collaborative coding playground.",
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
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
              <AuthProvider>
                <Navbar />
  
                <div
                   className={cn(
                     "absolute inset-0",
                     "[background-size:20px_20px]",
                     "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
                     "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
                   )}
                />
                 <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
                
                {children}
                <Footer />
              </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
