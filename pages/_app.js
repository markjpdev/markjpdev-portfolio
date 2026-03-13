import Script from 'next/script'
import { useEffect } from 'react'
import { Inter, JetBrains_Mono, Cormorant } from 'next/font/google'
import Layout from '../components/Layout'
import ErrorBoundary from '../components/ErrorBoundary'
import Cursor from '../components/Cursor'

const inter = Inter({
  weight: ['900'],
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const mono = JetBrains_Mono({
  weight: ['300'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const display = Cormorant({
  weight: ['700'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function App({ Component, pageProps }) {
  // Console easter egg — a signature for developers who look
  useEffect(() => {
    console.log(
      '%c Mark JP ',
      'background:#c4956a;color:#0d0b09;font-weight:bold;font-size:13px;padding:2px 8px;border-radius:2px;'
    )
    console.log(
      '%cSoftware engineer. Started in support.\n%c→ github.com/markjpdev',
      'color:rgba(240,235,227,0.55);font-size:11px;font-family:monospace;',
      'color:#c4956a;font-size:11px;font-family:monospace;'
    )
  }, [])

  return (
    <div className={`${inter.variable} ${mono.variable} ${display.variable}`}>
      {/* Google Analytics — activates only when NEXT_PUBLIC_GA_ID is set */}
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}</Script>
        </>
      )}

      <Cursor />
      <ErrorBoundary>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ErrorBoundary>
    </div>
  )
}
