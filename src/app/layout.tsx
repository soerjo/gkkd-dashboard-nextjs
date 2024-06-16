
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./storeProvider";

const inter = Inter({ subsets: ["latin"] });


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <StoreProvider>
      <html lang="en" className="dark" suppressHydrationWarning={true}>
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </StoreProvider>
  );
}
