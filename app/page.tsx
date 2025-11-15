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
  const [currentStation, setCurrentStation] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [centeredArticle, setCenteredArticle] = useState<number>(2) // Article 2 starts centered
  const videoRef = useRef<HTMLVideoElement>(null)
  const stationsRef = useRef<(HTMLDivElement | null)[]>([])

  // Metro stations data
  const metroStations = [
    {
      id: 'welcome',
      name: 'תחנת הברכה',
      title: 'ברוכים הבאים למסע ההשקעה',
      description: 'עולים לרכבת לעתיד הנדלן בתל אביב',
      icon: '🚇',
      color: '#005F39'
    },
    {
      id: 'location',
      name: 'תחנת המיקום',
      title: 'מיקום אסטרטגי בלב תל אביב',
      description: 'מפגש של 4 קווי תחבורה: מטרו, רכבת קלה, רכבת ישראל ואוטובוסים',
      icon: '📍',
      color: '#B8860B'
    },
    {
      id: 'potential',
      name: 'תחנת הפוטנציאל',
      title: 'זכויות בנייה ללא מגבלות',
      description: 'מגדל ללא הגבלת קומות במיקום הכי חם בישראל',
      icon: '🏗️',
      color: '#00A060'
    },
    {
      id: 'investment',
      name: 'תחנת ההשקעה',
      title: 'החל מ-799,000 ₪',
      description: 'הזדמנות השקעה ייחודית עם פוטנציאל עליית ערך גבוה',
      icon: '💎',
      color: '#DC2626'
    },
    {
      id: 'contact',
      name: 'תחנת הקשר',
      title: 'הצטרפו למסע',
      description: 'השאירו פרטים ונחזור אליכם עם כל המידע',
      icon: '📞',
      color: '#7C3AED'
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
    
    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData),
      })

      if (response.ok) {
        setSubmitMessage('תודה! פרטיכם נשלחו בהצלחה. ניצור איתכם קשר בקרוב.')
        
        // Track Facebook Pixel CompleteRegistration event
        if (typeof window !== 'undefined' && window.fbq) {
          window.fbq('track', 'CompleteRegistration')
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

  const nextStation = () => {
    const nextStationIndex = Math.min(currentStation + 1, metroStations.length - 1)
    setCurrentStation(nextStationIndex)
    
    // Track station navigation
    trackEvent('Station Navigation', {
      action: 'next',
      from_station: metroStations[currentStation].id,
      to_station: metroStations[nextStationIndex].id,
      timestamp: new Date().toISOString()
    })
  }

  const prevStation = () => {
    const prevStationIndex = Math.max(currentStation - 1, 0)
    setCurrentStation(prevStationIndex)
    
    // Track station navigation
    trackEvent('Station Navigation', {
      action: 'previous',
      from_station: metroStations[currentStation].id,
      to_station: metroStations[prevStationIndex].id,
      timestamp: new Date().toISOString()
    })
  }

  const goToStation = (stationIndex: number) => {
    // Track station navigation via nav bar
    trackEvent('Station Navigation', {
      action: 'nav_click',
      from_station: metroStations[currentStation].id,
      to_station: metroStations[stationIndex].id,
      timestamp: new Date().toISOString()
    })
    
    setCurrentStation(stationIndex)
    // Smooth scroll to station
    if (stationsRef.current[stationIndex]) {
      stationsRef.current[stationIndex].scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      const scrollPosition = window.innerHeight + window.scrollY
      const documentHeight = document.documentElement.scrollHeight
      const threshold = 100

      if (documentHeight - scrollPosition < threshold) {
        setIsFormExpanded(true)
      }

      // Update current station based on scroll position
      const stationElements = stationsRef.current
      if (stationElements.length > 0) {
        const viewportCenter = window.innerHeight / 2 + window.scrollY
        
        for (let i = 0; i < stationElements.length; i++) {
          const element = stationElements[i]
          if (element) {
            const rect = element.getBoundingClientRect()
            const elementCenter = rect.top + window.scrollY + rect.height / 2
            
            if (Math.abs(viewportCenter - elementCenter) < window.innerHeight / 3) {
              if (currentStation !== i) {
                setCurrentStation(i)
              }
              break
            }
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [currentStation])

  // Auto-play video once (using second half of original video)
  useEffect(() => {
    const video = videoRef.current
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
    <main className="metro-wrapper">
      {/* Metro Navigation Bar */}
      <nav className="metro-nav">
        <div className="metro-line">
          {metroStations.map((station, index) => (
            <div 
              key={station.id}
              className={`metro-station-nav ${index === currentStation ? 'active' : ''} ${index < currentStation ? 'passed' : ''}`}
              onClick={() => goToStation(index)}
            >
              <div className="station-dot" style={{ backgroundColor: station.color }}>
                <span className="station-icon">{station.icon}</span>
              </div>
              <span className="station-name">{station.name}</span>
            </div>
          ))}
        </div>
        <div className="metro-train" style={{ 
          transform: `translateX(${currentStation * (100 / (metroStations.length - 1))}%)`,
          transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
        }}>
          🚇
        </div>
      </nav>

      {/* Metro Stations */}
      {metroStations.map((station, index) => (
        <section 
          key={station.id}
          ref={(el: HTMLDivElement | null) => {
            stationsRef.current[index] = el
          }}
          className={`metro-station ${index === currentStation ? 'active' : ''}`}
          style={{ backgroundColor: `${station.color}15` }}
        >
          <div className="station-content">
            <div className="station-header">
              <div className="station-number">{index + 1}</div>
              <div className="station-info">
                <h2 className="station-title">{station.title}</h2>
                <p className="station-description">{station.description}</p>
              </div>
              <div className="station-icon-large" style={{ color: station.color }}>
                {station.icon}
              </div>
            </div>
            
            {/* Station-specific content */}
            {station.id === 'welcome' && (
              <div className="station-details">
                <div className="welcome-video">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    preload="metadata"
                    className="station-video"
                  >
                    <source src="/images/property-video-cropped.mp4" type="video/mp4" />
                  </video>
                </div>
                <div className="welcome-text">
                  <h3>מסע לעתיד הנדלן בתל אביב</h3>
                  <p>עלו איתנו לרכבת שתוביל אתכם להזדמנות השקעה ייחודית</p>
                </div>
              </div>
            )}

            {station.id === 'location' && (
              <div className="station-details">
                <div className="location-map">
                  <img 
                    src="/images/map_crop_test.jpg" 
                    alt="מפת מיקום הקרקע בתל אביב"
                    className="map-image"
                  />
                  <div className="map-pin">
                    <div className="pin-icon">📍</div>
                    <div className="pin-pulse"></div>
                  </div>
                </div>
                <div className="location-highlights">
                  <div className="highlight-item">
                    <span className="highlight-icon">🏢</span>
                    <h4>מרכז עזריאלי</h4>
                    <p>5 דקות ברכבת הכבדה</p>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-icon">🌟</span>
                    <h4>שדרות רוטשילד</h4>
                    <p>2 תחנות ברכבת הקלה</p>
                  </div>
                  <div className="highlight-item">
                    <span className="highlight-icon">✈️</span>
                    <h4>שדה תעופה</h4>
                    <p>15 דקות במטרו</p>
                  </div>
                </div>
              </div>
            )}

            {station.id === 'potential' && (
              <div className="station-details">
                <div className="potential-grid">
                  <div className="potential-card">
                    <div className="card-icon">🏗️</div>
                    <h4>ללא מגבלת קומות</h4>
                    <p>זכויות בנייה ללא הגבלות גובה</p>
                  </div>
                  <div className="potential-card">
                    <div className="card-icon">🚇</div>
                    <h4>מפגש תחבורתי</h4>
                    <p>4 קווי תחבורה במקום אחד</p>
                  </div>
                  <div className="potential-card">
                    <div className="card-icon">📈</div>
                    <h4>פוטנציאל עליית ערך</h4>
                    <p>מיקום אסטרטגי בתל אביב</p>
                  </div>
                </div>
              </div>
            )}

            {station.id === 'investment' && (
              <div className="station-details">
                <div className="investment-showcase">
                  <div className="price-display">
                    <span className="price-label">החל מ־</span>
                    <span className="price-value">799,000 ₪</span>
                    <span className="price-note">הזדמנות השקעה נדירה</span>
                  </div>
                  <div className="articles-preview">
                    <h4>מה התקשורת אומרת?</h4>
                    <div className="articles-mini">
                      <img src="/images/calcalist.png" alt="כתבה בקלכליסט" />
                      <img src="/images/mako.png" alt="כתבה במאקו" />
                      <img src="/images/ynet.png" alt="כתבה ב-ynet" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {station.id === 'contact' && (
              <div className="station-details">
                <div className="contact-form">
                  <h3>הצטרפו למסע</h3>
                  <p>השאירו פרטים ונחזור אליכם עם כל המידע על ההזדמנות</p>
                  <form onSubmit={handleSubmit} className="metro-form">
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
                  {submitMessage && (
                    <div className={submitMessage.includes('תודה') ? 'success-message' : 'error-message'}>
                      {submitMessage}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Station Navigation */}
          <div className="station-navigation">
            {index > 0 && (
              <button onClick={prevStation} className="nav-btn prev-btn">
                <span>← תחנה קודמת</span>
                <small>{metroStations[index - 1].name}</small>
              </button>
            )}
            {index < metroStations.length - 1 && (
              <button onClick={nextStation} className="nav-btn next-btn">
                <span>תחנה הבאה →</span>
                <small>{metroStations[index + 1].name}</small>
              </button>
            )}
          </div>
        </section>
      ))}

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
    </main>
  )
}
