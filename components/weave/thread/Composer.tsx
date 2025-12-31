'use client'

import { useState, useRef } from 'react'
import { Send, Mic, Paperclip, CheckCircle2, Library, Clock } from 'lucide-react'
import { api, ApiError, FileAttachment } from '@/lib/api-client'
import { useRouter } from 'next/navigation'
import { VoiceRecorder } from '@/components/ui/VoiceRecorder'
import { VoiceRecording } from '@/lib/hooks/useVoiceRecorder'
import { FileAttachmentList } from '@/components/ui/FileAttachmentList'

interface ComposerProps {
  threadId: string
  onMessageSent?: () => void
}

export function Composer({ threadId, onMessageSent }: ComposerProps) {
  const router = useRouter()
  const [message, setMessage] = useState('')
  const [showActions, setShowActions] = useState(false)
  const [sending, setSending] = useState(false)
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setAttachedFiles(prev => [...prev, ...files])
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSend = async () => {
    if ((!message.trim() && attachedFiles.length === 0) || sending) return

    const messageContent = message.trim() || (attachedFiles.length > 0 ? 'Shared files' : '')
    
    // Optimistic UI: Create temporary message immediately
    const optimisticMessage: any = {
      id: `temp-${Date.now()}`,
      threadId,
      senderId: 'current-user', // Will be replaced by real ID
      type: 'text',
      content: messageContent,
      fileAttachments: attachedFiles.map((file, idx) => ({
        url: URL.createObjectURL(file),
        filename: file.name,
        size: file.size,
        type: file.type,
      })),
      timestamp: new Date().toISOString(),
    }

    // Clear input immediately for better UX
    const savedMessage = message
    const savedFiles = [...attachedFiles]
    setMessage('')
    setAttachedFiles([])
    
    // Trigger optimistic update callback if provided
    onMessageSent?.()

    try {
      setSending(true)
      
      // Upload files if any
      let fileAttachments: FileAttachment[] = []
      if (savedFiles.length > 0) {
        const uploadPromises = savedFiles.map(file => api.uploadFile(file))
        const uploadResults = await Promise.all(uploadPromises)
        fileAttachments = uploadResults.map(result => ({
          url: result.url,
          filename: result.filename,
          size: result.size,
          type: result.type,
        }))
      }
      
      // Send message
      await api.sendMessage({
        threadId,
        content: messageContent,
        type: 'text',
        fileAttachments: fileAttachments.length > 0 ? fileAttachments : undefined,
      })
      
      // Real-time updates via SSE will handle adding the actual message
      // No need to manually refresh here
      router.refresh()
    } catch (error) {
      console.error('Error sending message:', error)
      
      // Rollback: restore message on error
      setMessage(savedMessage)
      setAttachedFiles(savedFiles)
      
      if (error instanceof ApiError) {
        alert(`Failed to send message: ${error.message}`)
      } else {
        alert('Failed to send message. Please try again.')
      }
    } finally {
      setSending(false)
    }
  }

  const handleVoiceRecordingComplete = async (recording: VoiceRecording) => {
    try {
      setSending(true)
      
      // Upload audio
      const uploadResult = await api.uploadAudio(recording.audioBlob)
      
      // Send voice message
      await api.sendMessage({
        threadId,
        content: 'Voice message', // Optional text caption
        type: 'voice',
        audioUrl: uploadResult.url,
        waveform: recording.waveform,
      })
      
      setShowVoiceRecorder(false)
      onMessageSent?.()
      router.refresh()
    } catch (error) {
      console.error('Error sending voice message:', error)
      if (error instanceof ApiError) {
        alert(`Failed to send voice message: ${error.message}`)
      } else {
        alert('Failed to send voice message. Please try again.')
      }
    } finally {
      setSending(false)
    }
  }

  if (showVoiceRecorder) {
    return (
      <div>
        <VoiceRecorder
          onRecordingComplete={handleVoiceRecordingComplete}
          onCancel={() => setShowVoiceRecorder(false)}
        />
      </div>
    )
  }

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
      />
      
      {attachedFiles.length > 0 && (
        <div className="mb-2">
          <FileAttachmentList files={attachedFiles} onRemove={handleRemoveFile} />
        </div>
      )}
      
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
            className="w-full px-3 py-2 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            rows={2}
          />
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-gray-100 rounded-2xl"
            title="Attach file"
          >
            <Paperclip className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={() => setShowVoiceRecorder(true)}
            className="p-2 hover:bg-gray-100 rounded-2xl"
            title="Record voice message"
          >
            <Mic className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={handleSend}
            disabled={(!message.trim() && attachedFiles.length === 0) || sending}
            className="p-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 px-2 py-1 bg-gray-100 rounded-2xl">
              <CheckCircle2 className="w-3 h-3" />
              Mark as decision
            </button>
            <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 px-2 py-1 bg-gray-100 rounded-2xl">
              <Library className="w-3 h-3" />
              Add to library
            </button>
            <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900 px-2 py-1 bg-gray-100 rounded-2xl">
              <Clock className="w-3 h-3" />
              Defer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

