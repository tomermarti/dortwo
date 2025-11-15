'use client'

import { useEffect } from 'react'
import mixpanel from 'mixpanel-browser'

declare global {
  interface Window {
    mixpanel?: typeof mixpanel
  }
}

// Module-level flag to prevent double initialization
let mixpanelInitialized = false

export default function MixpanelProvider() {
  useEffect(() => {
    // Prevent double initialization
    if (mixpanelInitialized) {
      return
    }

    // Get Mixpanel token from environment variable
    const mixpanelToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN

    if (!mixpanelToken) {
      console.error('Mixpanel token not found in environment variables')
      return
    }

    // Initialize Mixpanel
    mixpanel.init(mixpanelToken, {
      debug: process.env.NODE_ENV === 'development',
      track_pageview: true,
      persistence: 'localStorage',
    })

    mixpanelInitialized = true
    
    // Make mixpanel available globally for easy access
    if (typeof window !== 'undefined') {
      window.mixpanel = mixpanel
    }

    // Track initial page view
    mixpanel.track('Page View', {
      page: window.location.pathname,
      referrer: document.referrer,
    })
  }, [])

  return null
}

// Export helper functions for tracking
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && mixpanelInitialized) {
    mixpanel.track(eventName, properties)
  }
}

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && mixpanelInitialized) {
    mixpanel.identify(userId)
    if (properties) {
      mixpanel.people.set(properties)
    }
  }
}

export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && mixpanelInitialized) {
    mixpanel.people.set(properties)
  }
}

