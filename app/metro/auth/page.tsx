'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function MetroAuth() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if already authenticated
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/metro-auth')
      const data = await response.json()
      if (data.authenticated) {
        router.push('/metro')
      }
    } catch (error) {
      // Ignore errors
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/metro-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        // Small delay to ensure cookie is set, then reload to refresh auth state
        setTimeout(() => {
          window.location.href = '/metro'
        }, 200)
      } else {
        setError(data.error || 'סיסמה שגויה. אנא נסה שוב.')
        setPassword('') // Clear password field
      }
    } catch (error) {
      setError('שגיאה בשרת. אנא נסה שוב.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0fff0 0%, #ffffff 50%, #fdf5e6 100%)',
      padding: '2rem',
      direction: 'rtl'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 700,
          marginBottom: '1rem',
          color: '#1d1d1f',
          textAlign: 'center'
        }}>
          רובע המטרו
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#6e6e73',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          אנא הזן סיסמה לגישה למצגת
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="סיסמה"
            required
            style={{
              width: '100%',
              padding: '1rem',
              border: '1px solid #d2d2d7',
              borderRadius: '12px',
              fontSize: '1rem',
              marginBottom: '1rem',
              direction: 'rtl',
              fontFamily: 'inherit'
            }}
          />
          
          {error && (
            <div style={{
              background: '#ffe5e5',
              color: '#c41e3a',
              padding: '0.75rem',
              borderRadius: '8px',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #005F39 0%, #00A060 50%, #B8860B 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
          >
            {isLoading ? 'בודק...' : 'כניסה'}
          </button>
        </form>
      </div>
    </div>
  )
}

