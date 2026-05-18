import Script from 'next/script'
import { useEffect } from 'react'
import ErrorBoundary from '../components/ErrorBoundary'
import Layout from '../components/Layout'
import '../styles/globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function App({ Component, pageProps }) {
  useEffect(() => {
    console.log(
      '%c Mark JP ',
      'background:#2C4A6B;color:#F2EDE3;font-weight:bold;font-size:13px;padding:2px 8px;border-radius:2px;'
    )
    console.log(
      '%cquietly building things that work.\n%c→ github.com/markjpdev',
      'color:#6B6258;font-size:11px;font-family:monospace;',
      'color:#2C4A6B;font-size:11px;font-family:monospace;'
    )
  }, [])

  return (
    <>
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
      <ErrorBoundary>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ErrorBoundary>
    </>
  )
}
