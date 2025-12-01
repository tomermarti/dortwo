import { NextRequest, NextResponse } from 'next/server'

const METRO_PASSWORD = process.env.METRO_PASSWORD || 'DOR22!'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    // Debug: Check if password matches (remove in production if needed)
    const passwordMatch = password === METRO_PASSWORD

    if (passwordMatch) {
      const response = NextResponse.json({ success: true })
      // Set cookie that expires in 7 days
      response.cookies.set('metro-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.VERCEL === '1', // Only secure on Vercel (HTTPS)
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/' // Root path so it's accessible everywhere
      })
      return response
    } else {
      return NextResponse.json({ success: false, error: 'סיסמה שגויה' }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'שגיאה בשרת' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const authCookie = request.cookies.get('metro-auth')
  const isAuthenticated = authCookie?.value === 'authenticated'
  return NextResponse.json({ authenticated: isAuthenticated })
}

