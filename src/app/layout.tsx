import type { Metadata } from "next";
import { Newsreader, JetBrains_Mono, Caveat } from "next/font/google";
import "../styles/globals.css";

const newsreader = Newsreader({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  weight: ["400", "500", "600"],
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lucy Gai",
  description: "Lucy Gai — a personal archive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${newsreader.variable} ${jetbrains.variable} ${caveat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
