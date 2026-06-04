import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Models Tracker",
  description:
    "Explore 130+ foundation AI models by company, country, and category. Live data from Wikipedia.",
  openGraph: {
    title: "AI Models Tracker",
    description: "Explore foundation AI models by company, country, and category.",
    type: "website",
  },
  // Makes the app installable / look native on iOS Safari
  appleWebApp: {
    capable: true,
    title: "AI Models",
    statusBarStyle: "default",
  },
  // Prevent phone number detection from reformatting model names
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,        // allow user zoom (accessibility)
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)",  color: "#030712" },
  ],
  viewportFit: "cover",   // respect iPhone notch / Dynamic Island
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
