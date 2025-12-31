'use client'

import { useState } from 'react'

export function ExampleSnippet() {
  const [highlighted, setHighlighted] = useState<string | null>(null)

  return (
    <section className="px-6 py-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Conversation Snippet */}
          <div className="bg-gray-50 rounded-bubble-lg p-4">
            <div className="text-xs text-gray-500 mb-3 font-medium">Example Conversation</div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-500 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Alex</div>
                  <div 
                    className={`text-sm rounded-bubble px-3 py-2 bg-white ${
                      highlighted === 'date' ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onMouseEnter={() => setHighlighted('date')}
                    onMouseLeave={() => setHighlighted(null)}
                  >
                    Want to meet <span className="font-medium text-primary-600">this Saturday at 2pm</span> for coffee?
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-400 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">Sam</div>
                  <div 
                    className={`text-sm rounded-bubble px-3 py-2 bg-white ${
                      highlighted === 'promise' ? 'ring-2 ring-primary-500' : ''
                    }`}
                    onMouseEnter={() => setHighlighted('promise')}
                    onMouseLeave={() => setHighlighted(null)}
                  >
                    Sounds good! <span className="font-medium text-primary-600">I'll bring the notes</span> we discussed.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WEAVE Saved This */}
          <div className="bg-primary-50 rounded-bubble-lg p-4 border border-primary-200">
            <div className="text-xs text-primary-700 mb-3 font-medium">WEAVE saved this</div>
            <div className="space-y-3">
              <div className="bg-white rounded-bubble p-3">
                <div className="text-xs text-gray-500 mb-1">Plan</div>
                <div className="text-sm font-medium text-gray-900 mb-2">Coffee Meeting</div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Date: Saturday, Jan 20</div>
                  <div>Time: 2:00 PM</div>
                  <div>Participants: Alex, Sam</div>
                </div>
              </div>
              <div className="bg-white rounded-bubble p-3">
                <div className="text-xs text-gray-500 mb-1">Promise</div>
                <div className="text-sm font-medium text-gray-900">Sam will bring notes</div>
                <div className="text-xs text-gray-500 mt-1">Status: Pending</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

