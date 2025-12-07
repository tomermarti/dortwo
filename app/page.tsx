'use client'

import { useState, useEffect, useRef } from 'react'
import { trackEvent } from './components/MixpanelProvider'

// Facebook Pixel type declaration
declare global {
  interface Window {
    fbq: (action: string, event: string, params?: Record<string, any>) => void
  }
}

export default function Home() {
  const [leadData, setLeadData] = useState({
    name: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')
  const [isFormExpanded, setIsFormExpanded] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)
  const [articleOrder, setArticleOrder] = useState([0, 1, 2]) // Track the order of articles

  const articles = [
    { id: 'calcalist', src: '/images/calcalist.png', alt: 'כתבה בקלכליסט על הפרויקט' },
    { id: 'mako', src: '/images/mako.png', alt: 'כתבה במאקו על הפרויקט' },
    { id: 'ynet', src: '/images/ynet.png', alt: 'כתבה בynet על הפרויקט' }
  ]

  const getArticlePosition = (orderIndex: number) => {
    // orderIndex 0 = left, 1 = center, 2 = right
    if (orderIndex === 1) return 'active-front' // Center
    if (orderIndex === 0) return 'position-1' // Left
    return 'position-3' // Right
  }

  const handleArticleClick = (clickedOrderIndex: number) => {
    if (clickedOrderIndex === 1) return // Already centered, do nothing
    
    if (clickedOrderIndex === 0) {
      // Clicked left card - rotate right (bring left to center)
      // [0, 1, 2] -> [2, 0, 1]
      const newOrder = [articleOrder[2], articleOrder[0], articleOrder[1]]
      setArticleOrder(newOrder)
    } else {
      // Clicked right card - rotate left (bring right to center)
      // [0, 1, 2] -> [1, 2, 0]
      const newOrder = [articleOrder[1], articleOrder[2], articleOrder[0]]
      setArticleOrder(newOrder)
    }
  }

  const nextArticle = () => {
    // Rotate left (bring right to center)
    // [0, 1, 2] -> [1, 2, 0]
    const newOrder = [articleOrder[1], articleOrder[2], articleOrder[0]]
    setArticleOrder(newOrder)
  }

  const prevArticle = () => {
    // Rotate right (bring left to center)
    // [0, 1, 2] -> [2, 0, 1]
    const newOrder = [articleOrder[2], articleOrder[0], articleOrder[1]]
    setArticleOrder(newOrder)
  }
  
  const heroContentRef = useRef<HTMLDivElement>(null)
  const heroVideoRef = useRef<HTMLVideoElement>(null)

  const features = [
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      title: 'מגדל ללא מגבלת קומות',
      description: 'הקרקע מיועדת למגורים מסחר ותעסוקה',
      gradient: 'linear-gradient(135deg, #005F39 0%, #00A060 50%, #B8860B 100%)'
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <circle cx="8" cy="12" r="2" />
          <circle cx="16" cy="12" r="2" />
          <line x1="2" y1="18" x2="22" y2="18" />
        </svg>
      ),
      title: 'מפגש תחבורה משולב',
      description: 'מפגש של ארבעה מוקדי תחבורה: רכבת קלה, מטרו, רכבת ישראל, מסוף אוטובוסים',
      gradient: 'linear-gradient(135deg, #B8860B 0%, #DAA520 50%, #005F39 100%)'
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      title: 'הזדמנות ייחודית',
      description: 'קרקע בתל אביב במקום מנצח, בעלת פוטנציאל עליית ערך גבוה',
      gradient: 'linear-gradient(135deg, #005F39 0%, #00A060 50%, #B8860B 100%)'
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      title: 'מקום מרכזי',
      description: 'ציר מרכזי במקום מתפתח, באיזור בעל פוטנציאל תנופה אדיר!',
      gradient: 'linear-gradient(135deg, #B8860B 0%, #00A060 50%, #005F39 100%)'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeadData({
      ...leadData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    console.log('DEBUG: Submitting form', leadData);
    
    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })

      console.log('DEBUG: Response received', response.status);
      if (response.ok) {
        setSubmitMessage('תודה! פרטיכם נשלחו בהצלחה. ניצור איתכם קשר בקרוב.')
        
        // Track Facebook Pixel CompleteRegistration event
        if (typeof window !== 'undefined' && window.fbq) {
          console.log('DEBUG: Firing Pixel');
          window.fbq('track', 'CompleteRegistration', { content_name: 'Land Investment Lead Form', status: 'completed' })
        }
        
        // Track Mixpanel Lead Submission
        trackEvent('Lead Submitted', {
          name: leadData.name,
          phone: leadData.phone,
          source: 'contact_form',
          timestamp: new Date().toISOString()
        })
        
        setLeadData({ name: '', phone: '' })
      } else {
        setSubmitMessage('אירעה שגיאה. אנא נסו שוב או התקשרו אלינו ישירות.')
        
        // Track form submission error
        trackEvent('Lead Submission Failed', {
          error: 'API Error',
          timestamp: new Date().toISOString()
        })
      }
    } catch (error) {
      setSubmitMessage('אירעה שגיאה. אנא נסו שוב או התקשרו אלינו ישירות.')
      
      // Track form submission error
      trackEvent('Lead Submission Failed', {
        error: 'Network Error',
        timestamp: new Date().toISOString()
      })
    }
    
    setIsSubmitting(false)
    setTimeout(() => setSubmitMessage(''), 5000)
  }

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent('שלום, אני מעוניין במידע נוסף על הקרקע בתל אביב')
    
    // Track WhatsApp click
    trackEvent('WhatsApp Click', {
      source: 'floating_button',
      timestamp: new Date().toISOString()
    })
    
    window.location.href = `https://wa.me/97233850585?text=${message}`
  }

  const toggleForm = () => {
    const newState = !isFormExpanded
    setIsFormExpanded(newState)
    
    // Track form expansion
    trackEvent('Form Toggle', {
      expanded: newState,
      timestamp: new Date().toISOString()
    })
  }

  const nextFeature = () => {
    setActiveFeature((prev) => (prev + 1) % features.length)
  }

  const prevFeature = () => {
    setActiveFeature((prev) => (prev - 1 + features.length) % features.length)
  }

  useEffect(() => {
    let ticking = false
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Parallax effect for hero content
          if (heroContentRef.current) {
            heroContentRef.current.style.transform = `translate3d(0, ${currentScrollY * 0.2}px, 0)`
          }
          
          // Parallax/Fade effect for hero video
          if (heroVideoRef.current) {
            heroVideoRef.current.style.opacity = (0.7 + (currentScrollY * 0.0003)).toString()
          }

          const scrollPosition = window.innerHeight + currentScrollY
          const documentHeight = document.documentElement.scrollHeight
          const threshold = 100

          if (documentHeight - scrollPosition < threshold) {
            setIsFormExpanded(true)
          }
          
          ticking = false
        })
        
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [features.length])

  // Auto-play video once (using second half of original video)
  useEffect(() => {
    const video = heroVideoRef.current
    if (video) {
      // Simple autoplay when video can play
      const handleCanPlay = () => {
        video.play().catch(() => {
          // Ignore autoplay errors (browser may block autoplay)
        })
      }
      
      // Track video play
      const handlePlay = () => {
        trackEvent('Video Play', {
          video: 'property-video-cropped',
          timestamp: new Date().toISOString()
        })
      }
      
      // Track video completion
      const handleEnded = () => {
        trackEvent('Video Completed', {
          video: 'property-video-cropped',
          timestamp: new Date().toISOString()
        })
      }
      
      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('play', handlePlay)
      video.addEventListener('ended', handleEnded)
      
      // If video can already play, start it
      if (video.readyState >= 3) {
        video.play().catch(() => {})
      }
      
      return () => {
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('play', handlePlay)
        video.removeEventListener('ended', handleEnded)
      }
    }
  }, [])

  return (
    <main className="main-wrapper">
      {/* Hero Section with Video Background */}
      <section className="hero">
        <div className="hero-video-background">
          <video
            ref={heroVideoRef}
            autoPlay
            muted
            playsInline
            preload="metadata"
            className="hero-video"
            style={{ opacity: 0.7 }}
          >
            <source src="/images/property-video-cropped.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content" ref={heroContentRef}>
          <h1 className="main-title animate-fade-in">
            עתיד <strong className="highlight-text">תל אביב</strong> מתחיל כאן.
          </h1>
          <div className="price-tag animate-fade-in-delay">
            <span className="price-label">החל מ־</span>
            <span className="price-value">849,000 ₪</span>
          </div>
          <p className="main-description animate-fade-in-delay-2">
            השקעה נדירה בקרקע למגורים<br className="mobile-break" /> <strong className="highlight-text">ללא מגבלת קומות</strong><br />
            <span className="text-spacer"></span>
            במפגש התחבורתי הלוהט<br className="mobile-break" /> בישראל <strong className="highlight-text">מטרו רכבת קלה ורכבת&nbsp;ישראל</strong>.
          </p>
          <p className="hero-disclaimer animate-fade-in-delay-2">
            * הקרקע אינה זמינה לבניה
          </p>
        </div>
        <div className="scroll-indicator">
          <div className="mouse"></div>
          <span>גלול למטה</span>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <button 
        className="whatsapp-float" 
        onClick={handleWhatsAppClick}
        aria-label="שלחו הודעה בוואטסאפ"
      >
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.164 0 0 7.164 0 16c0 2.825.739 5.607 2.137 8.048L.069 31.931l8.115-2.03A15.93 15.93 0 0016 32c8.836 0 16-7.164 16-16S24.836 0 16 0zm0 29.333c-2.547 0-5.043-.728-7.189-2.104l-.515-.33-5.328 1.332 1.365-5.197-.363-.535A13.268 13.268 0 012.667 16c0-7.364 5.969-13.333 13.333-13.333S29.333 8.636 29.333 16 23.364 29.333 16 29.333z"/>
          <path d="M23.189 19.36c-.381-.191-2.257-1.113-2.607-1.24-.349-.127-.603-.191-.857.191-.254.381-.984 1.24-1.206 1.494-.222.254-.444.286-.825.095-.381-.191-1.609-.593-3.065-1.891-1.133-.984-1.897-2.201-2.119-2.582-.222-.381-.024-.587.167-.777.171-.171.381-.444.571-.667.191-.222.254-.381.381-.635.127-.254.063-.476-.032-.667-.095-.191-.857-2.065-1.175-2.828-.31-.743-.625-.643-.857-.655-.222-.011-.476-.013-.73-.013s-.667.095-.984.476c-.349.381-1.333 1.302-1.333 3.175s1.365 3.683 1.556 3.937c.191.254 2.688 4.104 6.512 5.755.91.393 1.619.628 2.171.803.913.29 1.744.249 2.401.151.732-.109 2.257-.923 2.575-1.815.317-.891.317-1.655.222-1.815-.095-.159-.349-.254-.73-.444z"/>
        </svg>
      </button>

      {/* Features Carousel Section */}
      <section className="features-carousel-section">
        <div className="section-header">
          <h2 className="section-title">למה לבחור בקרקע הזו?</h2>
          <p className="section-subtitle">יתרונות שאי אפשר להתעלם מהם</p>
        </div>
        
        <div className="carousel-container">
          <button className="carousel-btn carousel-btn-prev" onClick={prevFeature} aria-label="קודם">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="carousel-arrow-prev">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <div className="carousel-track">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`carousel-card ${index === activeFeature ? 'active' : ''} ${
                  index === (activeFeature - 1 + features.length) % features.length ? 'prev' : ''
                } ${index === (activeFeature + 1) % features.length ? 'next' : ''}`}
              >
                <div className="card-inner" style={{ background: `linear-gradient(135deg, white 0%, #fafafa 100%)` }}>
                  <div className="feature-icon-large" style={{ 
                    background: feature.gradient,
                    WebkitMaskImage: 'linear-gradient(black, black)',
                    maskImage: 'linear-gradient(black, black)'
                  }}>
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="carousel-btn carousel-btn-next" onClick={nextFeature} aria-label="הבא">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="carousel-arrow-next">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div className="carousel-dots">
          {features.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === activeFeature ? 'active' : ''}`}
              onClick={() => setActiveFeature(index)}
              aria-label={`עבור לתכונה ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Features Grid for Desktop */}
      <section className="features-grid-section">
        <div className="features-container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card-grid">
                <div className="feature-icon" style={{ color: '#005F39' }}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="location">
        <div className="location-container">
          <h2 className="section-title">מיקום אסטרטגי בתל אביב</h2>
          <p className="section-subtitle">
            הקרקע ממוקמת במיקום אסטרטגי בתל אביב, עם גישה מעולה לכל חלקי העיר ואזור המרכז
          </p>
          
          <div className="map-container">
            <div className="map-wrapper">
              <img 
                src="/images/map_crop_test.jpg" 
                alt="מפת מיקום הקרקע בתל אביב עם קווי הרכבת הקלה והמטרו"
                className="map-image"
              />
              <div className="map-pin">
                <div className="pin-icon">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="#DC2626" stroke="#B91C1C" strokeWidth="2"/>
                    <circle cx="12" cy="10" r="3" fill="white"/>
                  </svg>
                </div>
                <div className="pin-pulse"></div>
              </div>
            </div>
          </div>
          
          <div className="location-highlights">
            <div className="highlight-item">
              <div className="icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
                  <path d="M9 22v-4h6v4" />
                  <path d="M8 6h.01" />
                  <path d="M16 6h.01" />
                  <path d="M12 6h.01" />
                  <path d="M12 10h.01" />
                  <path d="M8 10h.01" />
                  <path d="M16 10h.01" />
                  <path d="M8 14h.01" />
                  <path d="M16 14h.01" />
                  <path d="M12 14h.01" />
                </svg>
              </div>
              <h4>מרכז עזריאלי</h4>
              <p>5 דקות ברכבת הכבדה</p>
            </div>
            <div className="highlight-item">
              <div className="icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h4>מרכז העסקים של תל אביב</h4>
              <p>5 תחנות ברכבת הקלה</p>
            </div>
            <div className="highlight-item">
              <div className="icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </div>
              <h4>שדה תעופה</h4>
              <p>15 דקות במטרו</p>
            </div>
            <div className="highlight-item">
              <div className="icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="22" y1="12" x2="18" y2="12" />
                  <line x1="6" y1="12" x2="2" y2="12" />
                  <line x1="12" y1="6" x2="12" y2="2" />
                  <line x1="12" y1="22" x2="12" y2="18" />
                </svg>
              </div>
              <h4>כבישים ראשיים</h4>
              <p>גישה ישירה לנתיבי איילון, כביש 1, כביש 44</p>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="articles-section">
        <div className="articles-container">
          <div className="section-header">
            <h2 className="section-title">מה התקשורת אומרת?</h2>
            <p className="section-subtitle">כתבות ודיווחים על הפרויקט מהתקשורת המובילה</p>
          </div>
          
          <div className="articles-carousel-container">
            <button className="articles-carousel-btn articles-carousel-btn-prev" onClick={prevArticle} aria-label="כתבה קודמת">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="articles-carousel-arrow-prev">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            
            <div className="articles-fan">
              {articleOrder.map((articleIndex, orderIndex) => {
                const article = articles[articleIndex]
                const position = getArticlePosition(orderIndex)
                // Center card has highest z-index
                const zIndex = orderIndex === 1 ? 100 : orderIndex === 2 ? 2 : 1
                
                return (
                  <div 
                    key={`${article.id}-${orderIndex}`}
                    className={`article-card ${position}`}
                    onClick={() => handleArticleClick(orderIndex)}
                    style={{
                      cursor: 'pointer',
                      zIndex
                    }}
                  >
                    <img src={article.src} alt={article.alt} />
                  </div>
                )
              })}
            </div>
            
            <button className="articles-carousel-btn articles-carousel-btn-next" onClick={nextArticle} aria-label="כתבה הבאה">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="articles-carousel-arrow-next">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Floating Footer */}
      <div className={`floating-footer ${isFormExpanded ? 'expanded' : 'collapsed'}`}>
        <button className="form-toggle-button" onClick={toggleForm} aria-label="פתח טופס">
          <span>שלחו פרטים</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 5l-7 7h4v3h6v-3h4z"/>
          </svg>
        </button>
        
        <div className="footer-content">
          <div className="footer-actions">
            <div className="form-header">
              <span className="form-cta-text">הירשמו לקבלת פרטים נוספים</span>
              <button className="form-close-button" onClick={toggleForm} aria-label="סגור טופס">
                ✕
              </button>
            </div>
            <form className="lead-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="שם מלא"
                value={leadData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="טלפון"
                value={leadData.phone}
                onChange={handleInputChange}
                required
              />
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'שולח...' : 'שלחו פרטים'}
              </button>
            </form>
          </div>
        </div>
        
        {submitMessage && (
          <div className={submitMessage.includes('תודה') ? 'success-message' : 'error-message'}>
            {submitMessage}
          </div>
        )}
      </div>

      {/* Footer Disclaimer */}
      <footer className="site-footer">
        <p className="footer-disclaimer">
          * הקרקע אינה זמינה לבניה
        </p>
      </footer>
    </main>
  )
}
