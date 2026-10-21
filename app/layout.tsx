import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeWithShivank — Developer portfolio",
  description:
    "A developer portfolio for thoughtful interfaces, reliable systems, and useful digital products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
