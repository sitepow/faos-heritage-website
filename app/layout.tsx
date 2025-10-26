import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";
import { HeroUIProviders } from "../providers/heroui";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import { NextAuthProviders } from "@/providers/nextauth";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <NextAuthProviders>
          <HeroUIProviders
            themeProps={{ attribute: "class", defaultTheme: "dark" }}
          >
            {children}
          </HeroUIProviders>
        </NextAuthProviders>
      </body>
    </html>
  );
}
