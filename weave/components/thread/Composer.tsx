'use client'

import { useState } from 'react'
import { Send, Mic, Paperclip, CheckCircle2, Library, Clock } from 'lucide-react'

interface ComposerProps {
  threadId: string
}

export function Composer({ threadId }: ComposerProps) {
  const [message, setMessage] = useState('')
  const [showActions, setShowActions] = useState(false)

  const handleSend = () => {
    if (message.trim()) {
      // Send message
      setMessage('')
    }
  }

  return (
    <div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Type a message..."
            className="w-full px-3 py-2 border border-gray-300 rounded-bubble-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            rows={2}
          />
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-100 rounded-bubble">
            <Paperclip className="w-4 h-4 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-bubble">
            <Mic className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={handleSend}
            disabled={!message.trim()}
            className="p-2 bg-primary-600 text-white rounded-bubble hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={() => setShowActions(!showActions)}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Quick actions
        </button>
        {showActions && (
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 px-2 py-1 bg-gray-100 rounded-bubble">
              <CheckCircle2 className="w-3 h-3" />
              Mark as decision
            </button>
            <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 px-2 py-1 bg-gray-100 rounded-bubble">
              <Library className="w-3 h-3" />
              Add to library
            </button>
            <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 px-2 py-1 bg-gray-100 rounded-bubble">
              <Clock className="w-3 h-3" />
              Defer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

