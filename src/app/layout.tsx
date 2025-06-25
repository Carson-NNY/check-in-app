import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import Footer from "@/components/Footer/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "MoMath Check-in",
  description: "MoMath Check-in",
  icons: {
    icon: "/favicon.ico",
  },
};

// the root layout that wraps all pages
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning className={`${inter.variable}`}>
      <body>
        <ChakraProvider>
          {/* <main className="min-h-screen flex flex-col"> */}
          {children}
          <Footer />
          {/* </main> */}
        </ChakraProvider>
      </body>
    </html>
  );
}
