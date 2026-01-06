import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import { Toaster } from "sonner";
import { LazyMotion, domMax } from "framer-motion";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import WebVitalsReporter from "@/components/WebVitalsReporter";
import FooterSkeleton from "@/components/footer/FooterSkeleton";
import StoreInitializer from "@/components/common/StoreInitializer";

const Footer = dynamic(() => import("@/components/footer/Footer"), {
  ssr: true,
  loading: () => <FooterSkeleton />,
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Babyshop | Online shopping places",
  description: "Babyshop for online shopping",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${plusJakartaSans.className} antialiased`} suppressHydrationWarning>
        <StoreInitializer />
        <Header />

        <LazyMotion features={domMax} strict>
          <Suspense fallback={<main className="min-h-screen" suppressHydrationWarning />}>
            <main suppressHydrationWarning>{children}</main>
          </Suspense>
        </LazyMotion>

        <Footer />

        <Toaster position="top-right" richColors />
        <WebVitalsReporter />
      </body>
    </html>
  );
}