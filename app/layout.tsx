import type { Metadata } from "next";
import { Courier_Prime } from "next/font/google";
import "./globals.css";
import "easymde/dist/easymde.min.css";
import { Toaster } from "@/components/ui/toaster";

const courierPrime = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "CoCreateX",
  description: "Create, Collab, and Cultivate ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
       <body className={`${courierPrime.className} antialiased`}>
        {children}

        <Toaster />
      </body>
    </html>
  );
}
