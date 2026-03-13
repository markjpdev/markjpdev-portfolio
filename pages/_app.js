import Script from 'next/script'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Layout from '../components/Layout'
import ErrorBoundary from '../components/ErrorBoundary'

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

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function App({ Component, pageProps }) {
  return (
    <div className={`${inter.variable} ${mono.variable}`}>
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

      <ErrorBoundary>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ErrorBoundary>
    </div>
  )
}
