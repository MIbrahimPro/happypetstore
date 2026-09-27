import type { Metadata } from "next";
import { Baloo_2, Nunito, Quicksand } from "next/font/google";
import "./globals.css";

const display = Baloo_2({ weight: ["600", "700", "800"], subsets: ["latin"], variable: "--font-display" });
const sans = Nunito({ subsets: ["latin"], variable: "--font-sans" });
const round = Quicksand({ weight: ["500", "600", "700"], subsets: ["latin"], variable: "--font-round" });

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
      <body className={`${display.variable} ${sans.variable} ${round.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
