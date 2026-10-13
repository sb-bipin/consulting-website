import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getSettings } from "@/lib/site";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export const dynamic = "force-dynamic";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();
  const settings = await getSettings();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Navbar settings={settings} />
      <main>{children}</main>
      <Footer settings={settings} />
    </NextIntlClientProvider>
  );
}
