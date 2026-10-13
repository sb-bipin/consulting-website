import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import BootstrapClient from "@/components/BootstrapClient";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Swostik Overseas | Foreign Employment Agency in Nepal",
    template: "%s | Swostik Overseas",
  },
  description:
    "Government-licensed overseas recruitment agency in Kathmandu, Nepal. Ethical foreign employment opportunities across the Gulf, Asia and Europe.",
  openGraph: {
    type: "website",
    siteName: "Swostik Overseas",
    title: "Swostik Overseas | Foreign Employment Agency in Nepal",
    description:
      "Government-licensed overseas recruitment agency in Kathmandu, Nepal. Ethical foreign employment opportunities across the Gulf, Asia and Europe.",
    images: [{ url: "/swostik-img.jpg", width: 383, height: 854 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Swostik Overseas | Foreign Employment Agency in Nepal",
    description:
      "Government-licensed overseas recruitment agency in Kathmandu, Nepal.",
    images: ["/swostik-img.jpg"],
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body>
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}
