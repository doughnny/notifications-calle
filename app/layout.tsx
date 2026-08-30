import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calle",
  description: "Calle handles the noise, and keeps you across what matters.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
