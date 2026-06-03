import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Job Application Builder",
  description: "Powered by: react-hook-form | zod | shadcn | tailwindcss",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="min-h-screen p-8" cz-shortcut-listen="true">
        {children}
      </body>
    </html>
  );
}
