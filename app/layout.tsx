import type { Metadata } from 'next'
import './globals.css'
import FacebookPixel from './components/FacebookPixel'

export const metadata: Metadata = {
  metadataBase: new URL('https://tel-aviv-land-sale.vercel.app'),
  title: 'קרקע למכירה בתל אביב - 799,000 ש״ח | בלעדי',
  description: 'קרקע יוקרתית למכירה בתל אביב עם זכויות בנייה ללא מגבלות. 2 דקות לעזריאלי ברכבת קלה, 21 דקות לשדה התעופה. מחיר: 799,000 ש״ח',
  keywords: 'קרקע למכירה, תל אביב, השקעה, נדלן, זכויות בנייה, רכבת קלה, עזריאלי, רוטשילד',
  openGraph: {
    title: 'קרקע למכירה בתל אביב - 799,000 ש״ח',
    description: 'קרקע יוקרתית עם זכויות בנייה ללא מגבלות במיקום אסטרטגי בתל אביב',
    type: 'website',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        <FacebookPixel />
        {children}
      </body>
    </html>
  )
}
