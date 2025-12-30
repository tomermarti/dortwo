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

    // Clean data for all integrations
    const cleanPhone = phone.replace(/[^0-9]/g, '')
    const cleanName = name.replace(/"/g, '\\"')
    
    // Monday.com API integration
    const mondayApiKey = process.env.MONDAY_API_KEY
    const mondayBoardId = process.env.MONDAY_BOARD_ID

    console.log('Environment check:', { 
      hasApiKey: !!process.env.MONDAY_API_KEY, 
      hasBoardId: !!process.env.MONDAY_BOARD_ID,
      boardId: mondayBoardId
    })

    let mondayItemId = null
    
    if (!mondayApiKey || !mondayBoardId) {
      console.warn('Monday.com credentials not configured - skipping Monday integration')
    } else {
      // Create item in Monday.com - Simplified and more robust
      console.log('Creating lead:', { name: cleanName, phone: cleanPhone })
      
      // Use variables instead of inline strings to avoid escaping issues
      const mondayQuery = `
        mutation($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
          create_item (
            board_id: $boardId
            item_name: $itemName
            column_values: $columnValues
          ) {
            id
            name
          }
        }
      `
      
      const variables = {
        boardId: mondayBoardId,
        itemName: name,
        columnValues: JSON.stringify({
          "phone_mktsh1jg": cleanPhone,
          "priority_1": {
            "label": "אתר אינטרנט"
          }
        })
      }
      
      console.log('Monday query:', mondayQuery)
      console.log('Variables:', variables)

      const mondayResponse = await fetch('https://api.monday.com/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': mondayApiKey,
        },
        body: JSON.stringify({
          query: mondayQuery,
          variables: variables
        })
      })

      if (!mondayResponse.ok) {
        const errorText = await mondayResponse.text()
        console.error('Monday.com API error:', errorText)
        return NextResponse.json(
          { error: 'שגיאה בשמירת הפרטים', details: errorText },
          { status: 500 }
        )
      }

      const mondayData = await mondayResponse.json()
      
      if (mondayData.errors) {
        console.error('Monday.com GraphQL errors:', mondayData.errors)
        return NextResponse.json(
          { error: 'שגיאה בשמירת הפרטים', details: mondayData.errors },
          { status: 500 }
        )
      }
      
      mondayItemId = mondayData.data?.create_item?.id
    }

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
        mondayItemId: mondayItemId
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
      message: 'הפרטים נשמרו בהצלחה',
      leadId: mondayItemId
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'שגיאה כללית במערכת' },
      { status: 500 }
    )
  }
}