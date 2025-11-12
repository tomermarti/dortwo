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

    // Monday.com API integration
    const mondayApiKey = process.env.MONDAY_API_KEY
    const mondayBoardId = process.env.MONDAY_BOARD_ID

    console.log('Environment check:', { 
      hasApiKey: !!process.env.MONDAY_API_KEY, 
      hasBoardId: !!process.env.MONDAY_BOARD_ID,
      boardId: mondayBoardId
    })

    if (!mondayApiKey || !mondayBoardId) {
      console.error('Monday.com credentials not configured')
      return NextResponse.json(
        { error: 'שגיאה בהגדרות המערכת' },
        { status: 500 }
      )
    }

    // Create item in Monday.com - Simplified and more robust
    const cleanPhone = phone.replace(/[^0-9]/g, '')
    const cleanName = name.replace(/"/g, '\\"')
    
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

    // Optional: Send email notification or SMS
    // You can add additional integrations here

    return NextResponse.json({
      success: true,
      message: 'הפרטים נשמרו בהצלחה',
      leadId: mondayData.data?.create_item?.id
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'שגיאה כללית במערכת' },
      { status: 500 }
    )
  }
}
