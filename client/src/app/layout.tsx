import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { Toaster } from "sonner";
import { LazyMotion, domMax } from "framer-motion";
import { Suspense } from "react";
import WebVitalsReporter from "@/components/WebVitalsReporter";

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
        {/* Header সাধারণত স্ট্যাটিক হয়, তাই একে সাসপেন্সের বাইরে রাখাই ভালো */}
        <Header />

        <LazyMotion features={domMax} strict>
          {/* PPR এর পূর্ণ সুবিধা পেতে চিলড্রেনকে একটি সাসপেন্স বাউন্ডারিতে রাখা হয়েছে */}
          <Suspense fallback={<main className="min-h-screen" />}>
            <main>{children}</main>
          </Suspense>
        </LazyMotion>

        <Footer />

        <Toaster position="top-right" richColors />
        <WebVitalsReporter />
      </body>
    </html>
  );
}