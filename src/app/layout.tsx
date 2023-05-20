import type { Metadata } from "next";
import { getServerSession } from "next-auth/next";
import { Inter } from "next/font/google";

import { AccessDenied } from "@/components/AccessDenied";
import { AuthProvider } from "@/providers/AuthProvider";
import { DrawerComponent as Drawer } from "@/components/Drawer";
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
  return (
    <html lang="en">
      <body className={inter.variable}>
        <AuthProvider session={session}>
          <MUIProvider>
            <Drawer />
            {session ? children : <AccessDenied />}
          </MUIProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
