'use client'

import { useState } from 'react'

interface BoardColumn {
  id: string
  title: string
  type: string
}

interface BoardInfo {
  id: string
  name: string
  columns: BoardColumn[]
}

export default function TestMondayPage() {
  const [boardInfo, setBoardInfo] = useState<BoardInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchBoardInfo = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/monday-board-info')
      const data = await response.json()
      
      if (data.success) {
        setBoardInfo(data.board)
      } else {
        setError(data.error || 'Failed to fetch board info')
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const testSubmitLead = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Lead - ' + new Date().toLocaleString(),
          phone: '050-123-4567'
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Lead submitted successfully! ID: ' + data.leadId)
      } else {
        setError(data.error || 'Failed to submit lead')
      }
    } catch (err) {
      setError('Network error: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Monday.com Integration Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Board Information</h2>
          <button
            onClick={fetchBoardInfo}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded mb-4"
          >
            {loading ? 'Loading...' : 'Fetch Board Info'}
          </button>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          {boardInfo && (
            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold mb-2">Board: {boardInfo.name}</h3>
              <p className="text-sm text-gray-600 mb-4">ID: {boardInfo.id}</p>
              
              <h4 className="font-semibold mb-2">Columns:</h4>
              <div className="space-y-2">
                {boardInfo.columns?.map((column) => (
                  <div key={column.id} className="border-l-4 border-blue-500 pl-3">
                    <div className="font-medium">{column.title}</div>
                    <div className="text-sm text-gray-600">
                      ID: {column.id} | Type: {column.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Test Lead Submission</h2>
          <button
            onClick={testSubmitLead}
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded"
          >
            {loading ? 'Submitting...' : 'Submit Test Lead'}
          </button>
          <p className="text-sm text-gray-600 mt-2">
            This will create a test lead with current timestamp
          </p>
        </div>
      </div>
    </div>
  )
}
