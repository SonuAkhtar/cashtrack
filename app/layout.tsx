import type { Metadata, Viewport } from "next";
import { Inter, Manrope, Sora } from "next/font/google";
import "@/styles/globals.css";
import { AppShell } from "@/components/AppShell/AppShell";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CashTrack",
  description:
    "Track money you lend: lent, recovered, and pending amounts.",
  applicationName: "CashTrack",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CashTrack",
  },
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0e15" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

const themeBootstrap = `(function(){try{var s=localStorage.getItem('cashtrack:preferences');var t='light';if(s){var p=JSON.parse(s);if(p&&p.state&&(p.state.theme==='dark'||p.state.theme==='light'))t=p.state.theme;}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className={`${inter.variable} ${manrope.variable} ${sora.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
