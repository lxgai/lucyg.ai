import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Caveat,
  DM_Serif_Display,
  Newsreader,
  Nothing_You_Could_Do,
} from "next/font/google";
import localFont from "next/font/local";
import "../styles/globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  variable: "--font-dm-serif",
  subsets: ["latin"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  axes: ["opsz"],
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const nothingYouCouldDo = Nothing_You_Could_Do({
  weight: "400",
  variable: "--font-nothing-you-could-do",
  subsets: ["latin"],
  display: "swap",
});

// Self-hosted: Google Fonts sometimes serves JetBrains Mono from extensionless
// URLs, which next/font/google fails to download.
const jetbrains = localFont({
  src: [
    { path: "./fonts/JetBrainsMono-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/JetBrainsMono-500.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

// Newsreader and Caveat are only used by the legacy travel detail pages.
const newsreader = Newsreader({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
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
  description: "Lucy Gai's digital garden.",
};

// Runs before paint so the saved (or system) theme applies without a flash.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","light")}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Font variables live on <html> so the :root tokens in globals.css can reference them.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSerif.variable} ${bricolage.variable} ${nothingYouCouldDo.variable} ${jetbrains.variable} ${newsreader.variable} ${caveat.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
