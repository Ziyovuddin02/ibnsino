import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Abu Ali ibn Sino nomidagi ixtisoslashtirilgan maktab Chinoz filiali",
  description: "Abu Ali ibn Sino nomidagi ixtisoslashtirilgan maktab Chinoz filiali. Yangiliklar, qabul va maktab hayoti.",
  icons: {
    icon: "/images/school-logo.png",
    shortcut: "/images/school-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz">
      <body className="antialiased">{children}</body>
    </html>
  );
}
