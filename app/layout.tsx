import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://launchguard.dev"),
  title: {
    default: "LaunchGuard - App Store Submission Intelligence",
    template: "%s | LaunchGuard",
  },
  description:
    "Predict App Store and Google Play review risks before submission with instant risk scores, privacy checks, and rejection guidance.",
  keywords: [
    "App Store review",
    "Google Play review",
    "mobile app compliance",
    "React Native",
    "Expo",
    "iOS app review",
    "Android app review",
  ],
  manifest: "/manifest.json",
  other: {
    "theme-color": "#3ecf8e",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.svg",
  },
  openGraph: {
    title: "LaunchGuard - Know Your App Store Approval Chances Before You Submit",
    description:
      "Instant App Store and Google Play risk assessment for mobile app developers, agencies, and startup teams.",
    url: "https://launchguard.dev",
    siteName: "LaunchGuard",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LaunchGuard",
    description:
      "Know your App Store and Google Play approval chances before you submit.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] font-[Inter,system-ui,sans-serif]">{children}</body>
    </html>
  );
}
