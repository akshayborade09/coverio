import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cover.io',
  description: 'AI-powered cover letter generator',
  generator: 'v0.dev',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: 'no',
  viewportFit: 'cover',
  minimalUi: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="apple-touch-fullscreen" content="yes" />
        <meta name="HandheldFriendly" content="true" />
      </head>
      <body className="overscroll-none">{children}</body>
    </html>
  )
}
