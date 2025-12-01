import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'רובע המטרו - תל אביב',
  description: 'רובע המטרו תל אביב - מתחם אסטרטגי במפגש 4 סוגי תחבורה: מטרו, רכבת קלה, רכבת ישראל ומסוף אוטובוסים',
  keywords: 'רובע המטרו, תל אביב, מטרו, רכבת קלה, תמ"א 65, תמ"א 70',
}

export default function MetroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}




