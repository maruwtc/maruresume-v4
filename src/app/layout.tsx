import type { Metadata } from "next/types";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "ChrisOS",
  description: "A web-based OS portfolio experience",
  icons: {
    icon: "/cat.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        {children}
        <Analytics mode="production" />
      </body>
    </html>
  );
}
