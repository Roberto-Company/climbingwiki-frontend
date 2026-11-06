import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { getSession } from "@/lib/auth/session";
import { UserNav } from "@/components/auth/UserNav";
import { SearchBar } from "@/components/catalog/SearchBar";
import { LocaleSwitcher } from "@/components/i18n/LocaleSwitcher";
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

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Metadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [session, locale, t] = await Promise.all([getSession(), getLocale(), getTranslations()]);

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <NextIntlClientProvider>
          <header className="flex items-center justify-between gap-6 border-b border-border px-6 py-4 sm:px-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="font-display text-xl font-medium text-foreground">
                {t("Nav.home")}
              </Link>
              <Link href="/zones" className="font-sans text-sm font-semibold text-moss-600 hover:text-moss-800">
                {t("Nav.zones")}
              </Link>
              <Suspense>
                <SearchBar />
              </Suspense>
            </div>
            <div className="flex items-center gap-4">
              <UserNav user={session} />
              <LocaleSwitcher />
            </div>
          </header>
          {children}
          <footer className="border-t border-border px-6 py-6 font-sans text-xs text-stone sm:px-16">
            <p>{t("Footer.about")}</p>
            <p className="mt-1">{t("Footer.attribution")}</p>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
