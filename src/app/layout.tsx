import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "./storeProvider";
import { auth } from "@root/auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nextjs App",
  description: "Learning purpose",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <StoreProvider>
      <SessionProvider session={session}>
        <html lang="en" className="h-screen">
          <body className={`${inter.className} bg-white h-screen overflow-hidden`}>
            <Toaster richColors />
            {children}
            <SpeedInsights />
          </body>
        </html>
      </SessionProvider>
    </StoreProvider>
  );
}
