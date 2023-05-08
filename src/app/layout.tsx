import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { AuthProvider } from "@/providers/AuthProvider";
import { Header } from "@/components/Header";
import { MUIProvider } from "@/providers/MUIProvider";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Home Panel",
  description: "Home Panel",
  authors: [
    {
      name: "Aidan Timson (Timmo)",
      url: "https://home-panel.timmo.dev",
    },
  ],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--inter-font",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={inter.variable}>
          <MUIProvider>
            <Header />
            {children}
          </MUIProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
