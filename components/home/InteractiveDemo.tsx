'use client'

import { useState } from 'react'

export function InteractiveDemo() {
  const [hovered, setHovered] = useState<string | null>(null)

  const messages = [
    { id: '1', sender: 'Alex', text: 'Let\'s schedule the team review for', highlight: 'next Friday at 3pm', type: 'date' },
    { id: '2', sender: 'Sam', text: 'Perfect! I promise to have the', highlight: 'design mockups ready', type: 'promise' },
    { id: '3', sender: 'Alex', text: 'Great. Also, we should', highlight: 'decide on the color scheme', type: 'decision' },
  ]

  return (
    <section id="how-it-works" className="px-6 py-16 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-medium text-gray-900 mb-8 text-center">
          Interactive Demo
        </h2>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="flex gap-3"
                onMouseEnter={() => setHovered(msg.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 mb-1">{msg.sender}</div>
                  <div className={`text-sm rounded-xl px-3 py-2 bg-white border border-gray-200 transition-all ${
                    hovered === msg.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}>
                    {msg.text}{' '}
                    <span className={`font-medium ${
                      hovered === msg.id ? 'text-blue-700' : 'text-blue-600'
                    }`}>
                      {msg.highlight}
                    </span>
                  </div>
                  {hovered === msg.id && (
                    <div className="mt-2 text-xs text-gray-600 bg-blue-50 rounded-xl px-2 py-1 border border-blue-200">
                      WEAVE extracted: {msg.type} → Saved to Library
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
