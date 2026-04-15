import type { Metadata } from "next";
import { Cormorant_Garamond, Cinzel, Cinzel_Decorative, Great_Vibes, Noto_Serif_Tibetan } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400","600"], variable: "--font-cormorant" });
const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const cinzelDec = Cinzel_Decorative({ subsets: ["latin"], weight: ["400"], variable: "--font-cinzel-dec" });
const greatVibes = Great_Vibes({ subsets: ["latin"], weight: ["400"], variable: "--font-great-vibes" });
const notoTibetan = Noto_Serif_Tibetan({ subsets: ["tibetan"], weight: ["400"], variable: "--font-noto-tibetan" });

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://sange-kalsang-wedding.vercel.app";

export const metadata: Metadata = {
  title: "Sange Dorje & Kalzang Dolkar — Wedding Invitation",
  description: "Join us as we celebrate the wedding of Sange Dorje & Kalzang Dolkar on 8 May 2026 at Dhauladhar Heights Resort, Dharamshala.",
  icons: {
    icon: "/lotus.png",
    apple: "/lotus.png",
  },
  openGraph: {
    title: "You're Invited 🪷 Sange & Kalzang's Wedding",
    description: "8 May 2026 · Dhauladhar Heights Resort, Dharamshala · Kindly join us to celebrate our special day.",
    url: BASE_URL,
    siteName: "Sange & Kalzang Wedding",
    images: [
      {
        url: `${BASE_URL}/og-cover.jpg`,
        width: 1080,
        height: 540,
        alt: "Sange Dorje & Kalzang Dolkar Wedding Invitation",
      },
    ],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "You're Invited 🪷 Sange & Kalzang's Wedding",
    description: "8 May 2026 · Dhauladhar Heights Resort, Dharamshala",
    images: [`${BASE_URL}/og-cover.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${cinzel.variable} ${cinzelDec.variable} ${greatVibes.variable} ${notoTibetan.variable}`}>
      <body>{children}<Analytics /></body>
    </html>
  );
}
