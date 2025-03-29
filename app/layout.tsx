import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tree Services",
  description:
    "Breidys' tree care services, professional tree trimming, tree pruning, tree removal, stump grinding, emergency tree services, tree maintenance, arborist services, tree health care, local tree experts, sustainable tree care, hazardous tree removal, landscaping services, storm damage cleanup, tree preservation",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider dynamic>
          <ConvexClientProvider>
            {children}
            <Toaster closeButton position="top-center" duration={3000} />
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
