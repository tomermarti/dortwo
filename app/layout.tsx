import type { Metadata } from 'next'
import './globals.css'
import FacebookPixel from './components/FacebookPixel'
import MixpanelProvider from './components/MixpanelProvider'

export const metadata: Metadata = {
  metadataBase: new URL('https://telaviv.dor-2.com'),
  title: 'עתיד תל אביב מתחיל כאן',
  description: 'קרקע יוקרתית למכירה בתל אביב עם זכויות בנייה ללא מגבלות. 2 דקות לעזריאלי ברכבת קלה, 21 דקות לשדה התעופה. מחיר: 799,000 ש״ח',
  keywords: 'קרקע למכירה, תל אביב, השקעה, נדלן, זכויות בנייה, רכבת קלה, עזריאלי, רוטשילד',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'קרקע למכירה בתל אביב - 799,000 ש״ח',
    description: 'קרקע יוקרתית עם זכויות בנייה ללא מגבלות במיקום אסטרטגי בתל אביב. 2 דקות לעזריאלי ברכבת קלה, 21 דקות לשדה התעופה.',
    type: 'website',
    url: 'https://telaviv.dor-2.com',
    siteName: 'עתיד תל אביב מתחיל כאן',
    images: [
      {
        url: 'https://telaviv.dor-2.com/images/site-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'עתיד תל אביב מתחיל כאן - קרקע למכירה החל מ-799,000 ש״ח',
      }
    ],
    locale: 'he_IL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'קרקע למכירה בתל אביב - 799,000 ש״ח',
    description: 'קרקע יוקרתית עם זכויות בנייה ללא מגבלות במיקום אסטרטגי בתל אביב',
    images: ['https://telaviv.dor-2.com/images/site-preview.jpg'],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        
        {/* Additional meta tags for better social sharing */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:secure_url" content="https://telaviv.dor-2.com/images/site-preview.jpg" />
        <meta name="twitter:site" content="@telavivland" />
        <meta name="twitter:creator" content="@telavivland" />
        
        {/* Facebook App ID for WhatsApp sharing */}
        <meta property="fb:app_id" content="966242223397117" />
        
        {/* Additional Open Graph tags for better compatibility */}
        <meta property="og:image:alt" content="עתיד תל אביב מתחיל כאן - קרקע למכירה החל מ-799,000 ש״ח" />
        <meta property="article:author" content="דור 2" />
        
        {/* Force Facebook to refresh cache */}
        <meta property="og:updated_time" content={new Date().toISOString()} />
        <meta name="robots" content="index,follow" />
      </head>
      <body suppressHydrationWarning>
        <FacebookPixel />
        <MixpanelProvider />
        {children}
      </body>
    </html>
  )
}
