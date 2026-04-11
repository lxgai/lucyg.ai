import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import localFont from "next/font/local";
import "../styles/globals.css";

const vt323 = VT323({
  weight: ["400"],
  variable: "--font-vt323",
  subsets: ["latin"],
});

const cooperLight = localFont({
  src: [
    {
      path: "../../public/fonts/Cooper/Cooper-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/Cooper/Cooper-Light-Italic.ttf",
      weight: "300",
      style: "italic",
    },
  ],
  variable: "--font-cooper-light",
  display: "swap",
});

const chunkFive = localFont({
  src: [
    {
      path: "../../public/fonts/ChunkFive/chunkfive-regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-chunk-five",
  display: "swap",
});

const robotoMono = localFont({
  src: [
    {
      path: "../../public/fonts/Roboto/RobotoMono-VariableFont_wght.ttf",
      weight: "100 700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Roboto/RobotoMono-Italic-VariableFont_wght.ttf",
      weight: "100 700",
      style: "italic",
    },
  ],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lucy Gai",
  description: "Lucy Gai 2025",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${vt323.variable} ${cooperLight.variable} ${robotoMono.variable} ${chunkFive.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
