import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat-sans",
  subsets: ["latin"],
});

const title = "Sora Wear: Yoga Wear for Everyday Movement";
const description =
  "Effortless yoga wear designed for mindful movement, everyday comfort, and a life lived in your own rhythm.";

export const metadata: Metadata = {
  title: {
    default: title,
    template: "%s | Sora Wear",
  },
  description,
  keywords: ["yoga wear", "activewear", "yoga clothing", "athleisure", "Sora Wear"],
  openGraph: {
    title,
    description,
    siteName: "Sora Wear",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#4E4035",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-secondary text-primary">{children}</body>
    </html>
  );
}
