import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { name, phone, email, utmCampaign, utmAdset, utmAd } = await request.json()

    // Validate required fields
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'חסרים פרטים נדרשים' },
        { status: 400 }
      )
    }

    // Clean data for webhook
    const cleanPhone = phone.replace(/[^0-9]/g, '')
    
    console.log('Processing lead:', { name, phone: cleanPhone })

    // Send data to Make.com webhook
    try {
      const makeWebhookUrl = 'https://hook.eu2.make.com/uatk47itcov5t98aj9ojiaiiwwvhhpck'
      
      const webhookPayload = {
        name,
        phone: cleanPhone,
        email: email || '',
        utmCampaign: utmCampaign || '',
        utmAdset: utmAdset || '',
        utmAd: utmAd || '',
        source: 'website_lead_form',
        timestamp: new Date().toISOString(),
        leadId: `lead_${Date.now()}`
      }

      console.log('Sending to Make.com webhook:', webhookPayload)

      const makeResponse = await fetch(makeWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload)
      })

      if (!makeResponse.ok) {
        console.error('Make.com webhook error:', makeResponse.status, await makeResponse.text())
        // Don't fail the entire request if webhook fails
      } else {
        console.log('Make.com webhook sent successfully')
      }
    } catch (webhookError) {
      console.error('Error sending to Make.com webhook:', webhookError)
      // Don't fail the entire request if webhook fails
    }

    return NextResponse.json({
      success: true,
      message: 'הפרטים נשלחו בהצלחה',
      leadId: `lead_${Date.now()}`
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'שגיאה כללית במערכת' },
      { status: 500 }
    )
  }
}