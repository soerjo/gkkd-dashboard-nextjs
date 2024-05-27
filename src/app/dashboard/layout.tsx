import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AppShell from "@/components/app-shell";
import { AuthWrapper } from "@/components/auth-wrapper";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "GKKD-Ciledug | Dashboard",
    description: "-",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <AuthWrapper>
                <AppShell>
                    {children}
                </AppShell>
                < Toaster />
            </AuthWrapper>
        </>
    );
}
