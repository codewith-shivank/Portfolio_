import type { Metadata } from "next";
import "./globals.css";
import PageLoader from "../components/PageLoader";
import ScrollProgress from "../components/ScrollProgress";

export const metadata: Metadata = {
  title: "Shivank — Full-Stack Developer",
  description:
    "Portfolio of Shivank, a BCA student and full-stack MERN developer building web applications and interactive browser experiences.",
  openGraph: {
    title: "Shivank — Full-Stack Developer",
    description:
      "Selected web projects, skills, and contact details for Shivank, a full-stack MERN developer.",
    type: "website",
  },
  twitter: {
    card: "summary",
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
