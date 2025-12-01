'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function MetroPage() {
  const [activeFeature, setActiveFeature] = useState(0)
  const [scrollY, setScrollY] = useState(0)
  const [centeredArticle, setCenteredArticle] = useState<number>(2)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const router = useRouter()

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/metro-auth')
        const data = await response.json()
        if (data.authenticated) {
          setIsAuthenticated(true)
        } else {
          router.push('/metro/auth')
        }
      } catch (error) {
        router.push('/metro/auth')
      } finally {
        setIsChecking(false)
      }
    }
    checkAuth()
  }, [router])

  const features = [
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
      title: 'תמ"א 65/א - מתח"מים',
      description: '7 מרכזי התחבורה המשולבים עם הקישוריות הטובה ביותר בין אמצעי התחבורה הציבורית השונים',
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
      title: 'מפגש 4 סוגי תחבורה',
      description: 'תחנת רכבת ישראל, תחנת הקו הירוק של הרכבת הקלה, קו מטרו M1 ומסוף אוטובוסים ראשי',
      gradient: 'linear-gradient(135deg, #B8860B 0%, #DAA520 50%, #005F39 100%)'
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      title: '10 דונם במרכז תל אביב',
      description: 'מתחם בשטח של כ-10 דונם, הקרקע בייעוד מרכז מסחרי בשטח של 13,200 מ"ר, בעלות פרטית בטאבו',
      gradient: 'linear-gradient(135deg, #005F39 0%, #00A060 50%, #B8860B 100%)'
    },
    {
      icon: (
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      title: 'מיקום אסטרטגי',
      description: 'בסמיכות למע"ר בן צבי העתידי, אחד ממוקדי התחבורה המרכזיים של גוש דן',
      gradient: 'linear-gradient(135deg, #B8860B 0%, #00A060 50%, #005F39 100%)'
    }
  ]

  const nextFeature = () => {
    setActiveFeature((prev) => (prev + 1) % features.length)
  }

  const prevFeature = () => {
    setActiveFeature((prev) => (prev - 1 + features.length) % features.length)
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [features.length])

  // Show loading or redirect if not authenticated
  if (isChecking || !isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0fff0 0%, #ffffff 50%, #fdf5e6 100%)',
        direction: 'rtl'
      }}>
        <div style={{
          fontSize: '1.25rem',
          color: '#6e6e73'
        }}>
          בודק הרשאות...
        </div>
      </div>
    )
  }

  return (
    <main className="main-wrapper">
      {/* Hero Section with Presentation Image */}
      <section className="hero">
        <div className="hero-image-background">
          <img
            src="/images/metro/Screenshot 2025-11-15 at 17.11.44.png"
            alt="רובע המטרו תל אביב"
            className="hero-image"
            style={{ opacity: 0.9 + (scrollY * 0.0001) }}
          />
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
          <h1 className="main-title animate-fade-in">
            רובע <strong className="highlight-text">המטרו</strong>
          </h1>
          <h2 className="main-subtitle animate-fade-in-delay">
            תל אביב
          </h2>
          <p className="main-description animate-fade-in-delay-2">
            מתחם אסטרטגי במפגש 4 סוגי תחבורה<br />
            <strong className="highlight-text">מטרו • רכבת קלה • רכבת ישראל • מסוף אוטובוסים</strong>
          </p>
        </div>
        <div className="scroll-indicator">
          <div className="mouse"></div>
          <span>גלול למטה</span>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="about-container">
          <div className="section-header">
            <h2 className="section-title">אודותינו</h2>
          </div>
          <div className="about-content">
            <div className="about-text">
              <p className="about-paragraph">
                קבוצת <strong>דור טו</strong> עוסקת באיתור, יזום והשבחת נכסים בסביבת תחנות מטרו.
              </p>
              <p className="about-paragraph">
                דור טו פועלת בדבקות ומתוך אסטרטגיה ברורה להשבחת קרקעות בעלות פוטנציאל תכנוני ממשי כגון קרבה לתחנות המטרו ומערכות הסעה המונים.
              </p>
              <p className="about-paragraph">
                חזון החברה הינו ייצור מתחמים בעירוב שימושים אינטנסיביים המייצרים סינרגיה המזינה ומעצימה האחד את השני.
              </p>
              <p className="about-paragraph highlight-paragraph">
                משקיעי הקבוצה נהנים מתשואות גבוהות וזאת בזכות זיהוי המתחמים בשלב המוקדם לצורך מימוש מלוא הפוטנציאל.
              </p>
            </div>
            <div className="about-image">
              <img 
                src="/images/metro/Screenshot 2025-11-15 at 17.11.53.png" 
                alt="אודותינו - דור טו"
                className="about-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Carousel Section */}
      <section className="features-carousel-section">
        <div className="section-header">
          <h2 className="section-title">למה רובע המטרו?</h2>
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

      {/* TAMA Section */}
      <section className="tama-section">
        <div className="tama-container">
          <div className="section-header">
            <h2 className="section-title">תמ"א 65/א - מתח"מים</h2>
            <p className="section-subtitle">מרכזי תחבורה משולבים</p>
          </div>
          <div className="tama-content">
            <div className="tama-list">
              <div className="tama-item">
                <div className="tama-icon">7</div>
                <p>מרכזי התחבורה המשולבים</p>
              </div>
              <div className="tama-item">
                <div className="tama-icon">✓</div>
                <p>הקישוריות הטובה ביותר בין אמצעי התחבורה הציבורית השונים</p>
              </div>
              <div className="tama-item">
                <div className="tama-icon">✓</div>
                <p>שילוב ומעבר נוח ויעיל בין מערכות תחבורה שונות</p>
              </div>
              <div className="tama-item">
                <div className="tama-icon">✓</div>
                <p>מתחמים בעלי השפעה מכרעת על מערכת התחבורה הציבורית בישראל</p>
              </div>
              <div className="tama-item">
                <div className="tama-icon">✓</div>
                <p>המתח"מים יתפקדו כמוקדי עניין ומשיכה אזוריים ומנוף לפיתוח עירוני וכלכלי</p>
              </div>
            </div>
            <div className="tama-image">
              <img 
                src="/images/metro/Screenshot 2025-11-15 at 17.12.02.png" 
                alt="תמ״א 65 - מפת מתח״מים"
                className="tama-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="location">
        <div className="location-container">
          <h2 className="section-title">מיקום אסטרטגי בתל אביב</h2>
          <p className="section-subtitle">
            המתחם במיקום אסטרטגי ונגיש בסמיכות למפגש תחנות
          </p>
          
          <div className="location-features">
            <div className="location-feature-card">
              <div className="location-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <h4>תחנת רכבת ישראל</h4>
            </div>
            <div className="location-feature-card">
              <div className="location-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="6" width="18" height="12" rx="2" />
                  <circle cx="8" cy="12" r="2" />
                  <circle cx="16" cy="12" r="2" />
                </svg>
              </div>
              <h4>תחנת הקו הירוק של הרכבת הקלה</h4>
            </div>
            <div className="location-feature-card">
              <div className="location-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="2" x2="12" y2="6" />
                  <line x1="12" y1="18" x2="12" y2="22" />
                  <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                  <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                  <line x1="2" y1="12" x2="6" y2="12" />
                  <line x1="18" y1="12" x2="22" y2="12" />
                  <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                  <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                </svg>
              </div>
              <h4>קו מטרו M1</h4>
            </div>
            <div className="location-feature-card">
              <div className="location-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="4" y="2" width="16" height="20" rx="2" />
                  <path d="M9 22v-4h6v4" />
                </svg>
              </div>
              <h4>מסוף אוטובוסים ראשי</h4>
            </div>
          </div>

          <div className="map-container">
            <div className="map-wrapper">
              <img 
                src="/images/metro/Screenshot 2025-11-15 at 17.12.09.png" 
                alt="מפת מיקום רובע המטרו"
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

          <div className="location-detail-image">
            <img 
              src="/images/metro/Screenshot 2025-11-15 at 17.12.17.png" 
              alt="מיקום מפורט - רובע המטרו"
              className="location-detail-img"
            />
          </div>
        </div>
      </section>

      {/* Planning Status Section */}
      <section className="planning-section">
        <div className="planning-container">
          <div className="section-header">
            <h2 className="section-title">מצב תכנוני קיים</h2>
          </div>
          <div className="planning-content">
            <div className="planning-info">
              <div className="planning-item">
                <h3>שטח המתחם</h3>
                <p className="planning-value">כ-10 דונם</p>
              </div>
              <div className="planning-item">
                <h3>ייעוד הקרקע</h3>
                <p className="planning-value">מרכז מסחרי</p>
              </div>
              <div className="planning-item">
                <h3>שטח מרכז מסחרי</h3>
                <p className="planning-value">13,200 מ"ר</p>
              </div>
              <div className="planning-item">
                <h3>בעלות</h3>
                <p className="planning-value">פרטית בטאבו</p>
              </div>
            </div>
            <div className="planning-image">
              <img 
                src="/images/metro/Screenshot 2025-11-15 at 17.12.24.png" 
                alt="מצב תכנוני - מפת הקרקע"
                className="planning-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TAMA 70 Section */}
      <section className="tama70-section">
        <div className="tama70-container">
          <div className="section-header">
            <h2 className="section-title">תמ"א 70/א - עדכון תכנית מתאר</h2>
            <p className="section-subtitle">מרכז תחבורה ראשי - תכנון מפורט</p>
          </div>
          <div className="tama70-content">
            <div className="tama70-text">
              <p className="tama70-paragraph">
                מתח"ם מרכזי ומשמעותי המחבר את הערים תל אביב וחולון.
              </p>
              <p className="tama70-paragraph">
                העיריות מקדמות בימים אלה את תכניות מע"ר בן צבי המדגישות את שימור הטבע.
              </p>
              <p className="tama70-paragraph highlight-paragraph">
                המתח"ם מהווה נקודת מפגש לאמצעי התחבורה:
              </p>
              <ul className="tama70-list">
                <li>מטרו קו M1 (החלו עבודות)</li>
                <li>רכבת קלה קו ירוק (2028)</li>
                <li>רכבת ישראל (קיים)</li>
                <li>מסוף אוטובוסים ראשי (בתכנון)</li>
              </ul>
            </div>
            <div className="tama70-images">
              <div className="tama70-image-item">
                <img 
                  src="/images/metro/Screenshot 2025-11-15 at 17.12.31.png" 
                  alt="תמ״א 70 - מפת תכנון"
                  className="tama70-img"
                />
              </div>
              <div className="tama70-image-item">
                <img 
                  src="/images/metro/Screenshot 2025-11-15 at 17.12.34.png" 
                  alt="תמ״א 70 - אזור תעסוקה"
                  className="tama70-img"
                />
              </div>
              <div className="tama70-image-item">
                <img 
                  src="/images/metro/Screenshot 2025-11-15 at 17.12.40.png" 
                  alt="תמ״א 70 - תכנון מפורט"
                  className="tama70-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Holon Junction Section */}
      <section className="junction-section">
        <div className="junction-container">
          <div className="section-header">
            <h2 className="section-title">מתח"ם צומת חולון</h2>
          </div>
          <div className="junction-content">
            <div className="junction-text">
              <p className="junction-paragraph">
                צומת חולון הסמוך למע"ר בן צבי העתידי מתוכנן להיות אחד ממוקדי התחבורה המרכזיים של גוש דן, וצפויים לעבור בו עשרות אלפי נוסעים ביום, בנוסף לשטחים ציבוריים ומסחריים לתועלת הנוסעים.
              </p>
              <h3 className="junction-subtitle">אמצעי תחבורה:</h3>
              <ul className="junction-list">
                <li>הרכבת הקלה הקו הירוק</li>
                <li>קו מטרו M1</li>
                <li>רכבת ישראל</li>
                <li>תחנות אוטובוסים</li>
              </ul>
            </div>
            <div className="junction-image">
              <img 
                src="/images/metro/Screenshot 2025-11-15 at 17.12.46.png" 
                alt="מתח״ם צומת חולון"
                className="junction-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cross Section Section */}
      <section className="cross-section">
        <div className="cross-section-container">
          <div className="section-header">
            <h2 className="section-title">חתך רוחב - מתח"ם</h2>
            <p className="section-subtitle">אינטגרציה רב-מפלסית של מערכות תחבורה</p>
          </div>
          <div className="cross-section-image">
            <img 
              src="/images/metro/Screenshot 2025-11-15 at 17.12.54.png" 
              alt="חתך רוחב - מתח״ם"
              className="cross-section-img"
            />
          </div>
        </div>
      </section>

      {/* Final Render Section */}
      <section className="render-section">
        <div className="render-container">
          <div className="section-header">
            <h2 className="section-title">הדמיה להמחשה</h2>
            <p className="section-subtitle">רובע המטרו - חזון עתידי</p>
          </div>
          <div className="render-image">
            <img 
              src="/images/metro/Screenshot 2025-11-15 at 17.13.01.png" 
              alt="הדמיה - רובע המטרו"
              className="render-img"
            />
          </div>
        </div>
      </section>
    </main>
  )
}

