

import { Metadata } from "next";
import * as React from "react"

export const metadata: Metadata = {
  title: "GKKD-Ciledug | Dashboard",
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
export default function Page() {

  return (
    <>root...</>
  )
}
