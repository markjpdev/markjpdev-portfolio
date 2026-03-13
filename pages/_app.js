import { Inter, JetBrains_Mono } from 'next/font/google'

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

export default function App({ Component, pageProps }) {
  return (
    <div className={`${inter.variable} ${mono.variable}`}>
      <Component {...pageProps} />
    </div>
  )
}
