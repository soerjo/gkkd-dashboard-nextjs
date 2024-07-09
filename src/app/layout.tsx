import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./storeProvider";
import { AuthWrapper } from "@/components/auth-wrapper";
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/next-theme-provider";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "E-GEREJA",
  description: "-",
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16', href: "/favicon-16x16.png" },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32', href: "/favicon-32x32.png" },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>

        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange

          >

            <AuthWrapper>

              {children}
            </AuthWrapper>

            <Toaster />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
