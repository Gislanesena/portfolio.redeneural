import type { Metadata } from "next";
import { Share_Tech_Mono } from "next/font/google";
import "./globals.css";

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GIS-OS · Gislane Sena",
  description: "Interactive AI Terminal & Neural Network Portfolio — Gislane Sena",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${shareTechMono.className} bg-[#080403] text-[#ffd9b8] antialiased`}>
        {children}
      </body>
    </html>
  );
}