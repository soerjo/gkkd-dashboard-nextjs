'use client'

import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./storeProvider";
import { AuthWrapper } from "@/components/auth-wrapper";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <StoreProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body className={inter.className}>
          <AuthWrapper>

            {children}
          </AuthWrapper>

        </body>
      </html>
    </StoreProvider>
  );
}
