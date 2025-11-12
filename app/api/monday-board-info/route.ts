import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const mondayApiKey = process.env.MONDAY_API_KEY
    const mondayBoardId = process.env.MONDAY_BOARD_ID

    if (!mondayApiKey || !mondayBoardId) {
      return NextResponse.json(
        { error: 'Monday.com credentials not configured' },
        { status: 500 }
      )
    }

    // Query to get board information and columns
    const mondayQuery = `
      query {
        boards(ids: [${mondayBoardId}]) {
          id
          name
          description
          columns {
            id
            title
            type
            settings_str
          }
        }
      }
    `

    const mondayResponse = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': mondayApiKey,
      },
      body: JSON.stringify({
        query: mondayQuery
      })
    })

    if (!mondayResponse.ok) {
      const errorText = await mondayResponse.text()
      console.error('Monday.com API error:', errorText)
      return NextResponse.json(
        { error: 'Failed to fetch board information', details: errorText },
        { status: 500 }
      )
    }

    const mondayData = await mondayResponse.json()
    
    if (mondayData.errors) {
      console.error('Monday.com GraphQL errors:', mondayData.errors)
      return NextResponse.json(
        { error: 'GraphQL errors', details: mondayData.errors },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      board: mondayData.data?.boards?.[0] || null
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
