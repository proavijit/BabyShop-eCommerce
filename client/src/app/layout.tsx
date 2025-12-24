import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";


export const metadata: Metadata = {
  title: "Babyshop | Online shopping places",
  description: "Babyshop for onlne shopping",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`antialiased`}>
        {/* Header */}
        <Header />
        {children}
        {/* Footer */}

        <Footer />

      </body>
    </html>
  );
}
