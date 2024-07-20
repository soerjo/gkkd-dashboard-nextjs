'use client'

import AppShell from "@/components/app-shell";
import { AuthWrapper } from "@/components/auth-wrapper";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <AuthWrapper>
            <AppShell>
                {children}
            </AppShell>
        </AuthWrapper>
    );
}
