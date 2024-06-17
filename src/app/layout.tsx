'use client'

import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./storeProvider";
import { AuthWrapper } from "@/components/auth-wrapper";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/next-theme-provider";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange

        >

          <StoreProvider>
            <AuthWrapper>

              {children}
            </AuthWrapper>

            <Toaster />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
