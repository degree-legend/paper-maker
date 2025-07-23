import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "论文复读机",
  description: "上知天文，下知地理。本科到博士都在用它。是复读机中的豪杰。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
