'use client'

import AppShell from "@/components/app-shell";
import { AuthWrapper } from "@/components/auth-wrapper";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <AuthWrapper>
            <AppShell>
                {children}
            </AppShell>
            < Toaster />
        </AuthWrapper>
    );
}
