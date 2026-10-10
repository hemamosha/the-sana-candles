import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import "./checkout.css";
import "./products.css";
import "./admin/admin.css";

export async function generateMetadata(): Promise<Metadata> {
  const incoming = await headers();
  const host = incoming.get("x-forwarded-host") ?? incoming.get("host") ?? "the-sana-candles.com";
  const protocol = incoming.get("x-forwarded-proto") ?? "https";
  const image = `${protocol}://${host}/og.png`;
  return {
    title: "The Sana Candles | Hand-Poured in Egypt",
    description: "Warm, hand-poured soy candles created in small batches in Egypt.",
    openGraph: { title: "The Sana Candles", description: "Light a softer kind of moment.", type: "website", images: [{ url: image, width: 1536, height: 1024, alt: "The Sana Candles" }] },
    twitter: { card: "summary_large_image", title: "The Sana Candles", description: "Light a softer kind of moment.", images: [image] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
