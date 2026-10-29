import type { Metadata } from "next";
import "./globals.css";
import PageLoader from "../components/PageLoader";
import ScrollProgress from "../components/ScrollProgress";

export const metadata: Metadata = {
  metadataBase: new URL("https://codewithshivank.dev"),
  title: "Shivank — Full-Stack Developer",
  keywords: ["Shivank", "full-stack developer", "MERN", "React", "Three.js"],
  alternates: { canonical: "/" },
  icons: { icon: "/favicon.svg" },
  description:
    "Portfolio of Shivank, a BCA student and full-stack MERN developer building web applications and interactive browser experiences.",
  openGraph: {
    title: "Shivank — Full-Stack Developer",
    description:
      "Selected web projects, skills, and contact details for Shivank, a full-stack MERN developer.",
    type: "website",
    url: "https://codewithshivank.dev",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "Shivank — Full-Stack Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-image.svg"],
    title: "Shivank — Full-Stack Developer",
    description:
      "Selected web projects, skills, and contact details for Shivank, a full-stack MERN developer.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PageLoader />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
