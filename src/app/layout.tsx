import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/users/current-user";
import { listGradingSystems } from "@/lib/api";
import type { GradingSystemResponse } from "@/lib/types";
import { GradingSystemsProvider } from "@/components/catalog/GradingSystemsProvider";
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

/** Grade badges only need these to offer conversions; if the API is down, grades show as entered. */
async function loadGradingSystems(): Promise<GradingSystemResponse[]> {
  try {
    return await listGradingSystems();
  } catch {
    return [];
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [user, locale, t, gradingSystems] = await Promise.all([
    getCurrentUser(),
    getLocale(),
    getTranslations(),
    loadGradingSystems(),
  ]);

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <NextIntlClientProvider>
          <GradingSystemsProvider systems={gradingSystems}>
          <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-border px-6 py-4 sm:px-16">
            <div className="flex items-center gap-6 sm:gap-8">
              <Link href="/" className="font-display text-xl font-medium text-foreground">
                {t("Nav.home")}
              </Link>
              <Link href="/zones" className="font-sans text-sm font-semibold text-moss-600 hover:text-moss-800">
                {t("Nav.zones")}
              </Link>
              <div className="hidden md:block">
                <Suspense>
                  <SearchBar />
                </Suspense>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <UserNav user={user} />
              <LocaleSwitcher />
            </div>
            <div className="w-full md:hidden">
              <Suspense>
                <SearchBar />
              </Suspense>
            </div>
          </header>
          {children}
          <footer className="relative isolate overflow-hidden bg-night px-6 py-12 font-sans text-sm text-white/70 sm:px-16">
            <div className="contours absolute inset-0 -z-10 text-white/[0.07]" />
            <div className="flex flex-wrap items-start justify-between gap-8">
              <div className="max-w-sm">
                <Link href="/" className="font-display text-xl font-medium text-white">
                  {t("Nav.home")}
                </Link>
                <p className="mt-2">{t("Footer.about")}</p>
              </div>
              <nav aria-label={t("Footer.links")} className="flex flex-col gap-2">
                <Link href="/zones" className="hover:text-white">
                  {t("Footer.zones")}
                </Link>
                <Link href="/search" className="hover:text-white">
                  {t("Footer.search")}
                </Link>
                <Link href="/credits" className="hover:text-white">
                  {t("Footer.credits")}
                </Link>
              </nav>
            </div>
            <p className="mt-10 border-t border-white/15 pt-4 text-xs text-white/55">{t("Footer.attribution")}</p>
          </footer>
          </GradingSystemsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
