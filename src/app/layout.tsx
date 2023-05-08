import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { Inter } from "next/font/google";

import { AccessDenied } from "@/components/AccessDenied";
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  const session = await getServerSession();
  console.log("Server session:", session);

  return (
    <html lang="en">
      <body className={inter.variable}>
        <AuthProvider session={session}>
          <MUIProvider>
            <Header />
            <section>{session ? children : <AccessDenied />}</section>
          </MUIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
