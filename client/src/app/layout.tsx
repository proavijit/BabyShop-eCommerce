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
    <html lang="en" suppressHydrationWarning={true}>
      <head suppressHydrationWarning={true}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const targetAttributes = ['bis_skin_checked', 'bis_size'];
                const cleanNode = (node) => {
                  if (node.nodeType === 1) {
                    targetAttributes.forEach(attr => node.removeAttribute(attr));
                    for (let i = 0; i < node.childNodes.length; i++) {
                      cleanNode(node.childNodes[i]);
                    }
                  }
                };
                // Initial clean
                cleanNode(document.documentElement);
                // Observe for further injections before hydration
                const observer = new MutationObserver((mutations) => {
                  mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && targetAttributes.includes(mutation.attributeName)) {
                      mutation.target.removeAttribute(mutation.attributeName);
                    }
                  });
                });
                observer.observe(document.documentElement, { attributes: true, subtree: true });
                window.__hydration_cleaner = observer;
              })();
            `,
          }}
        />
      </head>
      <body className={`${plusJakartaSans.className} antialiased`} suppressHydrationWarning={true}>
        <StoreInitializer />
        <Header />

        <LazyMotion features={domMax} strict>
          <Suspense fallback={<main className="min-h-screen" suppressHydrationWarning={true} />}>
            <main suppressHydrationWarning={true}>{children}</main>
          </Suspense>
        </LazyMotion>

        <Footer />

        <Toaster position="top-right" richColors />
        <WebVitalsReporter />
      </body>
    </html>
  );
}