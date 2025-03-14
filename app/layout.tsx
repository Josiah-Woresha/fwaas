import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Logo from "../components/Logo";

export const metadata: Metadata = {
  title: "Get Your Feedback | GYF",
  description: "A production-ready authentication flow with Next.js and Supabase.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-gray-50 text-gray-900">
        <div className="pt-5"> {/* Add padding-top to the container */}
          <Logo />
        </div>
        {children}
      </body>
    </html>
  );
}
