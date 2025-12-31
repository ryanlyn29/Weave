'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { MessageSquare, Mic, Plus, Tag, Calendar, FileText, Paperclip, X, Users, CheckCircle2, MessageCircle } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { mockThreads, mockMessages, mockEntities } from '@/lib/weaveMockData'

export function BottomBar() {
  const router = useRouter()
  const pathname = usePathname()
  const [composeModalOpen, setComposeModalOpen] = useState(false)
  const [voiceModalOpen, setVoiceModalOpen] = useState(false)
  const [libraryModalOpen, setLibraryModalOpen] = useState(false)
  const [composeText, setComposeText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [context, setContext] = useState('')
  const [commentary, setCommentary] = useState('')
  const [calendarEvent, setCalendarEvent] = useState({
    date: '',
    time: '',
    title: '',
  })
  const [showCalendarForm, setShowCalendarForm] = useState(false)
  const [attachedVoice, setAttachedVoice] = useState<string | null>(null)
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null)
  const [showThreadSelector, setShowThreadSelector] = useState(false)
  const [librarySelectedThreads, setLibrarySelectedThreads] = useState<string[]>([])
  const [librarySelectedMessages, setLibrarySelectedMessages] = useState<string[]>([])
  const [librarySelectedEntities, setLibrarySelectedEntities] = useState<string[]>([])
  const [libraryCustomTags, setLibraryCustomTags] = useState<string[]>([])
  const [libraryTagInput, setLibraryTagInput] = useState('')
  const [libraryNotes, setLibraryNotes] = useState('')
  const [libraryViewMode, setLibraryViewMode] = useState<'conversations' | 'messages' | 'entities'>('conversations')

  const handleCompose = () => {
    // Always open compose modal
    setComposeModalOpen(true)
    // If on a thread page, pre-select that thread
    if (pathname?.startsWith('/app/thread/')) {
      const threadId = pathname.split('/app/thread/')[1]?.split('?')[0]
      setSelectedThreadId(threadId || null)
    } else {
      setSelectedThreadId(null)
      setShowThreadSelector(true)
    }
  }

  const handleVoice = () => {
    setVoiceModalOpen(true)
  }

  const handleAddToLibrary = () => {
    setLibraryModalOpen(true)
    // Pre-select current thread if on thread page
    if (pathname?.startsWith('/app/thread/')) {
      const threadId = pathname.split('/app/thread/')[1]?.split('?')[0]
      if (threadId && !librarySelectedThreads.includes(threadId)) {
        setLibrarySelectedThreads([threadId])
      }
    }
  }

  const handleToggleThread = (threadId: string) => {
    setLibrarySelectedThreads(prev =>
      prev.includes(threadId)
        ? prev.filter(id => id !== threadId)
        : [...prev, threadId]
    )
    // Clear selected messages when thread is deselected
    if (librarySelectedThreads.includes(threadId)) {
      const threadMessages = mockMessages[threadId] || []
      setLibrarySelectedMessages(prev =>
        prev.filter(msgId => !threadMessages.some(m => m.id === msgId))
      )
    }
  }

  const handleToggleMessage = (messageId: string) => {
    setLibrarySelectedMessages(prev =>
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    )
  }

  const handleToggleEntity = (entityId: string) => {
    setLibrarySelectedEntities(prev =>
      prev.includes(entityId)
        ? prev.filter(id => id !== entityId)
        : [...prev, entityId]
    )
  }

  const handleAddLibraryTag = () => {
    if (libraryTagInput.trim() && !libraryCustomTags.includes(libraryTagInput.trim())) {
      setLibraryCustomTags([...libraryCustomTags, libraryTagInput.trim()])
      setLibraryTagInput('')
    }
  }

  const handleRemoveLibraryTag = (tag: string) => {
    setLibraryCustomTags(libraryCustomTags.filter(t => t !== tag))
  }

  const handleSaveToLibrary = () => {
    const libraryData = {
      threads: librarySelectedThreads,
      messages: librarySelectedMessages,
      entities: librarySelectedEntities,
      tags: libraryCustomTags,
      notes: libraryNotes,
    }

    console.log('Saving to library:', libraryData)
    
    // Reset form
    setLibrarySelectedThreads([])
    setLibrarySelectedMessages([])
    setLibrarySelectedEntities([])
    setLibraryCustomTags([])
    setLibraryTagInput('')
    setLibraryNotes('')
    setLibraryViewMode('conversations')
    setLibraryModalOpen(false)
    
    // Navigate to library to see saved items
    router.push('/app/library')
  }

  const handleSendCompose = async () => {
    if (!composeText.trim() && !attachedVoice) {
      return
    }

    // If no thread selected and not on a thread page, require thread selection
    if (!selectedThreadId && !pathname?.startsWith('/app/thread/')) {
      setShowThreadSelector(true)
      return
    }

    const threadId = selectedThreadId || pathname?.split('/app/thread/')[1]?.split('?')[0]

    // Prepare message data
    const messageData = {
      text: composeText,
      voice: attachedVoice,
      tags,
      context,
      commentary,
      calendarEvent: showCalendarForm && calendarEvent.title ? calendarEvent : null,
      threadId,
    }

    // Simulate sending message (in production, this would call an API)
    console.log('Sending message:', messageData)
    
    // Reset form
    setComposeText('')
    setTags([])
    setContext('')
    setCommentary('')
    setCalendarEvent({ date: '', time: '', title: '' })
    setAttachedVoice(null)
    setSelectedThreadId(null)
    setShowThreadSelector(false)
    setShowCalendarForm(false)
    setComposeModalOpen(false)

    // If not on thread page, navigate to it
    if (threadId && !pathname?.startsWith('/app/thread/')) {
      router.push(`/app/thread/${threadId}`)
    } else if (threadId) {
      // Refresh current page to show new message
      router.refresh()
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag))
  }

  const handleVoiceAttach = () => {
    setVoiceModalOpen(true)
  }

  const handleVoiceRecorded = () => {
    setAttachedVoice('voice-recording-' + Date.now())
    setVoiceModalOpen(false)
    setIsRecording(false)
  }

  return (
    <>
      <div className="h-16 bg-white border-t border-gray-200 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCompose}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Compose</span>
          </button>
          <button 
            onClick={handleVoice}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Mic className="w-4 h-4" />
            <span className="hidden sm:inline">Voice</span>
          </button>
          <button 
            onClick={handleAddToLibrary}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add to Library</span>
          </button>
        </div>
      </div>

      <Modal
        isOpen={composeModalOpen}
        onClose={() => {
          setComposeModalOpen(false)
          setComposeText('')
          setTags([])
          setContext('')
          setCommentary('')
          setCalendarEvent({ date: '', time: '', title: '' })
          setAttachedVoice(null)
          setShowCalendarForm(false)
          setSelectedThreadId(null)
          setShowThreadSelector(false)
        }}
        title="Compose Message"
      >
        <div className="space-y-4">
          {/* Thread/Recipient Selection */}
          {showThreadSelector && (
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Send to</label>
              <div className="space-y-1 max-h-40 overflow-y-auto border border-gray-300 rounded-2xl p-2">
                {mockThreads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => {
                      setSelectedThreadId(thread.id)
                      setShowThreadSelector(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-2xl text-sm transition-colors ${
                      selectedThreadId === thread.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{thread.title || 'Untitled'}</span>
                    </div>
                    {thread.mlSummary && (
                      <div className="text-xs text-gray-500 mt-0.5">{thread.mlSummary}</div>
                    )}
                  </button>
                ))}
              </div>
              {selectedThreadId && (
                <button
                  onClick={() => {
                    setSelectedThreadId(null)
                    setShowThreadSelector(true)
                  }}
                  className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                >
                  Change thread
                </button>
              )}
            </div>
          )}

          {/* Selected Thread Display (when on thread page) */}
          {!showThreadSelector && pathname?.startsWith('/app/thread/') && (
            <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-2xl text-sm text-blue-700">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>
                  {mockThreads.find(t => t.id === pathname.split('/app/thread/')[1]?.split('?')[0])?.title || 'Current thread'}
                </span>
              </div>
            </div>
          )}

          {/* Main Message */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Message</label>
            <textarea
              value={composeText}
              onChange={(e) => setComposeText(e.target.value)}
              placeholder="Type your message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={4}
            />
          </div>

          {/* Voice Attachment */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Voice</label>
            {attachedVoice ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-2xl">
                <Mic className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 flex-1">Voice recording attached</span>
                <button
                  onClick={() => setAttachedVoice(null)}
                  className="p-1 hover:bg-blue-100 rounded"
                >
                  <X className="w-3 h-3 text-blue-600" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleVoiceAttach}
                className="w-full px-3 py-2 border border-gray-300 rounded-2xl text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
                <span>Record voice message</span>
              </button>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddTag()
                  }
                }}
                placeholder="Add tag..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm hover:bg-gray-200"
              >
                <Tag className="w-4 h-4" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-2xl text-xs"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:bg-blue-100 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Context */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Context</label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Add context or background information..."
              className="w-full px-3 py-2 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={2}
            />
          </div>

          {/* Commentary */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Commentary</label>
            <textarea
              value={commentary}
              onChange={(e) => setCommentary(e.target.value)}
              placeholder="Add your commentary or notes..."
              className="w-full px-3 py-2 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={2}
            />
          </div>

          {/* Calendar Event */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Calendar Event</label>
            {!showCalendarForm ? (
              <button
                onClick={() => setShowCalendarForm(true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-2xl text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Add calendar event</span>
              </button>
            ) : (
              <div className="space-y-2 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Event Details</span>
                  <button
                    onClick={() => {
                      setShowCalendarForm(false)
                      setCalendarEvent({ date: '', time: '', title: '' })
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-3 h-3 text-gray-500" />
                  </button>
                </div>
                <input
                  type="text"
                  value={calendarEvent.title}
                  onChange={(e) => setCalendarEvent({ ...calendarEvent, title: e.target.value })}
                  placeholder="Event title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={calendarEvent.date}
                    onChange={(e) => setCalendarEvent({ ...calendarEvent, date: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="time"
                    value={calendarEvent.time}
                    onChange={(e) => setCalendarEvent({ ...calendarEvent, time: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Attachments */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Attachments</label>
            <button className="w-full px-3 py-2 border border-gray-300 rounded-2xl text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              <span>Attach file</span>
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={handleSendCompose}
              disabled={(!composeText.trim() && !attachedVoice) || (showThreadSelector && !selectedThreadId)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
            <button
              onClick={() => {
                setComposeModalOpen(false)
                setComposeText('')
                setTags([])
                setContext('')
                setCommentary('')
                setCalendarEvent({ date: '', time: '', title: '' })
                setAttachedVoice(null)
                setShowCalendarForm(false)
              }}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={voiceModalOpen}
        onClose={() => {
          setVoiceModalOpen(false)
          setIsRecording(false)
        }}
        title="Voice Capture"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-center py-8">
            {isRecording ? (
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center mb-4 animate-pulse">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <p className="text-sm text-gray-600">Recording...</p>
              </div>
            ) : (
              <button
                onClick={() => setIsRecording(true)}
                className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
              >
                <Mic className="w-8 h-8" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {isRecording ? (
              <>
                <button
                  onClick={() => {
                    setIsRecording(false)
                    setVoiceModalOpen(false)
                  }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleVoiceRecorded}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700"
                >
                  Stop & Attach
                </button>
              </>
            ) : (
              <button
                onClick={() => setVoiceModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={libraryModalOpen}
        onClose={() => {
          setLibraryModalOpen(false)
          setLibrarySelectedThreads([])
          setLibrarySelectedMessages([])
          setLibrarySelectedEntities([])
          setLibraryCustomTags([])
          setLibraryTagInput('')
          setLibraryNotes('')
          setLibraryViewMode('conversations')
        }}
        title="Add to Library"
      >
        <div className="space-y-4 max-h-[80vh] overflow-y-auto">
          {/* View Mode Tabs */}
          <div className="flex gap-2 border-b border-gray-200 pb-2">
            <button
              onClick={() => setLibraryViewMode('conversations')}
              className={`px-3 py-1.5 text-xs font-medium rounded-2xl transition-colors ${
                libraryViewMode === 'conversations'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Conversations
            </button>
            <button
              onClick={() => setLibraryViewMode('messages')}
              className={`px-3 py-1.5 text-xs font-medium rounded-2xl transition-colors ${
                libraryViewMode === 'messages'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setLibraryViewMode('entities')}
              className={`px-3 py-1.5 text-xs font-medium rounded-2xl transition-colors ${
                libraryViewMode === 'entities'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Entities
            </button>
          </div>

          {/* Conversations View */}
          {libraryViewMode === 'conversations' && (
            <div className="space-y-2">
              <label className="text-xs text-gray-500 mb-2 block">Select Conversations</label>
              <div className="space-y-1 max-h-60 overflow-y-auto border border-gray-300 rounded-2xl p-2">
                {mockThreads.map((thread) => {
                  const isSelected = librarySelectedThreads.includes(thread.id)
                  return (
                    <button
                      key={thread.id}
                      onClick={() => handleToggleThread(thread.id)}
                      className={`w-full text-left px-3 py-2 rounded-2xl text-sm transition-colors flex items-center gap-2 ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{thread.title || 'Untitled'}</div>
                        {thread.mlSummary && (
                          <div className="text-xs text-gray-500 truncate">{thread.mlSummary}</div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Messages View */}
          {libraryViewMode === 'messages' && (
            <div className="space-y-2">
              <label className="text-xs text-gray-500 mb-2 block">Select Messages</label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {librarySelectedThreads.length > 0 ? (
                  librarySelectedThreads.map((threadId) => {
                    const messages = mockMessages[threadId] || []
                    const thread = mockThreads.find(t => t.id === threadId)
                    return (
                      <div key={threadId} className="border border-gray-300 rounded-2xl p-2">
                        <div className="text-xs font-medium text-gray-700 mb-2">
                          {thread?.title || 'Untitled'}
                        </div>
                        <div className="space-y-1">
                          {messages.map((message) => {
                            const isSelected = librarySelectedMessages.includes(message.id)
                            return (
                              <button
                                key={message.id}
                                onClick={() => handleToggleMessage(message.id)}
                                className={`w-full text-left px-2 py-1.5 rounded-2xl text-xs transition-colors flex items-center gap-2 ${
                                  isSelected
                                    ? 'bg-blue-50 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                <div className={`w-3 h-3 rounded border flex items-center justify-center flex-shrink-0 ${
                                  isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                                }`}>
                                  {isSelected && <CheckCircle2 className="w-2 h-2 text-white" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="truncate">{message.content}</div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(message.timestamp).toLocaleDateString()}
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">
                    Select conversations first to view messages
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Entities View */}
          {libraryViewMode === 'entities' && (
            <div className="space-y-2">
              <label className="text-xs text-gray-500 mb-2 block">Select Entities</label>
              <div className="space-y-1 max-h-60 overflow-y-auto border border-gray-300 rounded-2xl p-2">
                {mockEntities.map((entity) => {
                  const isSelected = librarySelectedEntities.includes(entity.id)
                  return (
                    <button
                      key={entity.id}
                      onClick={() => handleToggleEntity(entity.id)}
                      className={`w-full text-left px-3 py-2 rounded-2xl text-sm transition-colors flex items-center gap-2 ${
                        isSelected
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{entity.title}</div>
                        <div className="text-xs text-gray-500">
                          {entity.type} • {entity.status}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Customization Options */}
          <div className="pt-4 border-t border-gray-200 space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Custom Tags</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={libraryTagInput}
                  onChange={(e) => setLibraryTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddLibraryTag()
                    }
                  }}
                  placeholder="Add tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddLibraryTag}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm hover:bg-gray-200"
                >
                  <Tag className="w-4 h-4" />
                </button>
              </div>
              {libraryCustomTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {libraryCustomTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded-2xl text-xs"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveLibraryTag(tag)}
                        className="hover:bg-blue-100 rounded"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Notes</label>
              <textarea
                value={libraryNotes}
                onChange={(e) => setLibraryNotes(e.target.value)}
                placeholder="Add notes about this library entry..."
                className="w-full px-3 py-2 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
              />
            </div>
          </div>

          {/* Summary */}
          {(librarySelectedThreads.length > 0 || librarySelectedMessages.length > 0 || librarySelectedEntities.length > 0) && (
            <div className="pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500 space-y-1">
                <div>Selected: {librarySelectedThreads.length} conversation{librarySelectedThreads.length !== 1 ? 's' : ''}</div>
                <div>{librarySelectedMessages.length} message{librarySelectedMessages.length !== 1 ? 's' : ''}</div>
                <div>{librarySelectedEntities.length} entit{librarySelectedEntities.length !== 1 ? 'ies' : 'y'}</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-gray-200">
            <button
              onClick={handleSaveToLibrary}
              disabled={librarySelectedThreads.length === 0 && librarySelectedMessages.length === 0 && librarySelectedEntities.length === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save to Library
            </button>
            <button
              onClick={() => {
                setLibraryModalOpen(false)
                setLibrarySelectedThreads([])
                setLibrarySelectedMessages([])
                setLibrarySelectedEntities([])
                setLibraryCustomTags([])
                setLibraryTagInput('')
                setLibraryNotes('')
                setLibraryViewMode('conversations')
              }}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}

