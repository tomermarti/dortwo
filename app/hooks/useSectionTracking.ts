'use client'

import { useEffect, useRef, useCallback } from 'react'
import { trackEvent } from '../components/MixpanelProvider'

interface UseSectionTrackingOptions {
  sectionName: string
  threshold?: number
  trackEngagement?: boolean
  additionalProperties?: Record<string, any>
}

export const useSectionTracking = ({
  sectionName,
  threshold = 0.5,
  trackEngagement = true,
  additionalProperties = {}
}: UseSectionTrackingOptions) => {
  const sectionRef = useRef<HTMLElement>(null)
  const viewTracked = useRef(false)
  const engagementStartTime = useRef<number | null>(null)
  const engagementTimer = useRef<NodeJS.Timeout | null>(null)

  const trackView = useCallback(() => {
    if (!viewTracked.current) {
      viewTracked.current = true
      trackEvent('Section View', {
        section: sectionName,
        ...additionalProperties
      })
      
      if (trackEngagement) {
        engagementStartTime.current = Date.now()
      }
    }
  }, [sectionName, additionalProperties, trackEngagement])

  const trackEngagementEnd = useCallback(() => {
    if (engagementStartTime.current && trackEngagement) {
      const engagementTime = Date.now() - engagementStartTime.current
      if (engagementTime > 1000) { // Only track if engaged for more than 1 second
        trackEvent('Section Engagement', {
          section: sectionName,
          engagement_time_ms: engagementTime,
          engagement_time_seconds: Math.round(engagementTime / 1000),
          ...additionalProperties
        })
      }
      engagementStartTime.current = null
    }
  }, [sectionName, additionalProperties, trackEngagement])

  useEffect(() => {
    const element = sectionRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            trackView()
          } else if (!entry.isIntersecting && engagementStartTime.current) {
            // User scrolled away, track engagement
            trackEngagementEnd()
          }
        })
      },
      {
        threshold: [0, threshold, 1],
        rootMargin: '-10% 0px -10% 0px' // Trigger when section is more centered
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
      if (engagementTimer.current) {
        clearTimeout(engagementTimer.current)
      }
      // Track final engagement when component unmounts
      trackEngagementEnd()
    }
  }, [threshold, trackView, trackEngagementEnd])

  return sectionRef
}

// Hook for tracking scroll depth
export const useScrollTracking = () => {
  const scrollDepthTracked = useRef(new Set<number>())

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100)

      // Track milestones: 25%, 50%, 75%, 90%, 100%
      const milestones = [25, 50, 75, 90, 100]
      
      milestones.forEach(milestone => {
        if (scrollPercentage >= milestone && !scrollDepthTracked.current.has(milestone)) {
          scrollDepthTracked.current.add(milestone)
          trackEvent('Scroll Depth', {
            milestone: `${milestone}%`,
            scroll_percentage: milestone,
            scroll_depth_px: scrollTop,
            page_height_px: documentHeight
          })
        }
      })
    }

    const throttledScroll = throttle(handleScroll, 500)
    window.addEventListener('scroll', throttledScroll)

    return () => {
      window.removeEventListener('scroll', throttledScroll)
    }
  }, [])
}

// Hook for tracking page activity and time
export const usePageActivityTracking = () => {
  const pageStartTime = useRef(Date.now())
  const lastActivityTime = useRef(Date.now())
  const activityTimer = useRef<NodeJS.Timeout | null>(null)

  const updateActivity = useCallback(() => {
    lastActivityTime.current = Date.now()
  }, [])

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true)
    })

    // Track time on page every 30 seconds
    const timeTracker = setInterval(() => {
      const timeOnPage = Date.now() - pageStartTime.current
      const timeSinceActivity = Date.now() - lastActivityTime.current
      
      // Only track if user was active in the last 30 seconds
      if (timeSinceActivity < 30000) {
        trackEvent('Page Activity', {
          time_on_page_seconds: Math.round(timeOnPage / 1000),
          time_since_last_activity_seconds: Math.round(timeSinceActivity / 1000),
          is_active: timeSinceActivity < 5000
        })
      }
    }, 30000)

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true)
      })
      clearInterval(timeTracker)
    }
  }, [updateActivity])

  return { updateActivity }
}

// Utility function to throttle events
function throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
  let inThrottle: boolean
  return ((...args: any[]) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }) as T
}
