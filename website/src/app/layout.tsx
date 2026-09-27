import type { Metadata } from "next";
import { Archivo_Black, Archivo, Space_Mono } from "next/font/google";
import "./globals.css";

const display = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const sans = Archivo({ subsets: ["latin"], variable: "--font-sans" });
const mono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "Happy Tails Pet Store and Clinic | Pet Store 24/7",
    template: "%s | Happy Tails",
  },
  description:
    "Kittens, dogs, pet food, accessories, toys and a 24/7 clinic in G-10 Markaz, Islamabad. Call 0313 1495287 any hour.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${sans.variable} ${mono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
