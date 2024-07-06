import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "GKKD-Ciledug | Jemaat",
    description: "-",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return children;
}
