'use client'

import Script from 'next/script'

declare global {
  interface Window {
    fbq: (action: string, event: string, params?: Record<string, any>) => void
    _fbq?: any
    _fbPixelInitialized?: boolean
  }
}

// Module-level flag to prevent double initialization across re-renders
let pixelInitialized = false

export default function FacebookPixel() {
  const pixelId = '1464831561291615'

  const handleScriptLoad = () => {
    // Prevent double initialization using both module-level and window-level flags
    if (typeof window === 'undefined' || pixelInitialized || window._fbPixelInitialized) {
      return
    }

    // Wait for fbq to be available
    const initPixel = () => {
      if (window.fbq && !pixelInitialized && !window._fbPixelInitialized) {
        pixelInitialized = true
        window._fbPixelInitialized = true
        window.fbq('init', pixelId)
        window.fbq('track', 'PageView')
      } else if (window.fbq && (pixelInitialized || window._fbPixelInitialized)) {
        // Already initialized, do nothing
        return
      } else if (!window.fbq) {
        // fbq not ready yet, retry
        setTimeout(initPixel, 50)
      }
    }

    initPixel()
  }

  return (
    <>
      <Script
        id="facebook-pixel"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  )
}

