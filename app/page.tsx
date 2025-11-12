'use client'

import { useState } from 'react'

export default function Home() {
  const [leadData, setLeadData] = useState({
    name: '',
    phone: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

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
        setLeadData({ name: '', phone: '' })
      } else {
        setSubmitMessage('אירעה שגיאה. אנא נסו שוב או התקשרו אלינו ישירות.')
      }
    } catch (error) {
      setSubmitMessage('אירעה שגיאה. אנא נסו שוב או התקשרו אלינו ישירות.')
    }
    
    setIsSubmitting(false)
    setTimeout(() => setSubmitMessage(''), 5000)
  }

  const handleCallClick = () => {
    window.location.href = 'tel:+972501234567'
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-video-background">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="hero-video"
          >
            <source src="/images/property-video.mp4" type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="exclusive-badge">🔥 בלעדי 🔥</div>
          <h1 className="gold-title">קרקע יוקרתית למכירה בתל אביב</h1>
          <div className="price">799,000 ש״ח</div>
          <p className="subtitle">
            זכויות בנייה ללא מגבלות • מיקום אסטרטגי בתל אביב ליד מפגש צירי מטרו ורכבת קלה
          </p>
          <button className="cta-button" onClick={handleCallClick}>
            📞 התקשרו עכשיו לפרטים
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-container">
          <h2>למה לבחור בקרקע הזו?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏗️</div>
              <h3>זכויות בנייה ללא מגבלות</h3>
              <p>אפשרות לבנות בניין מגורים או משרדים ללא הגבלות תכנוניות מיוחדות</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚇</div>
              <h3>רכבת קלה ומטרו</h3>
              <p>גישה ישירה לקו האדום של הרכבת הקלה - 2 דקות לעזריאלי, 2 תחנות לרוטשילד</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>השקעה יוקרתית</h3>
              <p>קרקע בתל אביב במיקום מעולה - השקעה בטוחה עם פוטנציאל עליה גבוה</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>מיקום מרכזי</h3>
              <p>קרוב לכל השירותים, קניונים, בתי חולים ומוסדות חינוך מובילים</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>זמינות מיידית</h3>
              <p>הקרקע זמינה להעברה מיידית עם כל האישורים והרישיונות</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>הזדמנות בלעדית</h3>
              <p>מוצע בבלעדיות - הזדמנות יחידה לרכוש קרקע באזור מבוקש זה</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="location">
        <div className="location-container">
          <h2>מיקום אסטרטגי בתל אביב</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: '#666' }}>
            הקרקע ממוקמת במיקום אסטרטגי בתל אביב, עם גישה מעולה לכל חלקי העיר ואזור המרכז
          </p>
          
          <div className="map-container">
            <img 
              src="/images/map_crop_test.jpg" 
              alt="מפת מיקום הקרקע בתל אביב עם קווי הרכבת הקלה והמטרו"
              style={{ 
                width: '100%', 
                maxWidth: '600px', 
                borderRadius: '15px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                margin: '2rem auto',
                display: 'block'
              }}
            />
          </div>
          
          <div className="location-highlights">
            <div className="highlight-item">
              <div className="icon">🏢</div>
              <h4>מרכז עזריאלי</h4>
              <p>2 דקות ברכבת הקלה</p>
            </div>
            <div className="highlight-item">
              <div className="icon">🚇</div>
              <h4>רחוב רוטשילד</h4>
              <p>2 תחנות ברכבת הקלה</p>
            </div>
            <div className="highlight-item">
              <div className="icon">✈️</div>
              <h4>שדה התעופה בן גוריון</h4>
              <p>21 דקות ברכבת ישראל</p>
            </div>
            <div className="highlight-item">
              <div className="icon">🚗</div>
              <h4>כבישים ראשיים</h4>
              <p>גישה ישירה לכביש 4 ו-5</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Footer */}
      <div className="floating-footer">
        <div className="footer-content">
          <div className="footer-text">
            <h3>מעוניינים? בואו נדבר!</h3>
            <p>השאירו פרטים או התקשרו עכשיו לקבלת מידע מפורט</p>
          </div>
          
          <div className="footer-actions">
            <a href="tel:+972501234567" className="call-button">
              📞 התקשרו עכשיו
            </a>
            
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
    </main>
  )
}
