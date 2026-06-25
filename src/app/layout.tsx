import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { UserNav } from "@/components/auth/UserNav";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ClimbingWiki",
  description: "A community wiki for climbing zones, crags, sectors, and routes.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <header className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-display text-xl font-medium text-foreground">
              ClimbingWiki
            </Link>
            <Link href="/zones" className="font-sans text-sm font-semibold text-moss-600 hover:text-moss-800">
              Zones
            </Link>
          </div>
          <UserNav user={session} />
        </header>
        {children}
      </body>
    </html>
  );
}
