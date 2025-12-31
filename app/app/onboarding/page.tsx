'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Users, Brain, Mic, Info, ArrowRight, Check } from 'lucide-react'

type RelationshipType = 'partner' | 'family' | 'team' | null
type MemorySensitivity = 'low' | 'medium' | 'high' | null

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [groupName, setGroupName] = useState('')
  const [relationshipType, setRelationshipType] = useState<RelationshipType>(null)
  const [memorySensitivity, setMemorySensitivity] = useState<MemorySensitivity>(null)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const handleComplete = async () => {
    setIsLoading(true)
    // Simulate onboarding completion
    setTimeout(() => {
      setIsLoading(false)
      router.push('/app/inbox')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl border border-gray-200 p-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Step {step} of 5</span>
              <span className="text-xs text-gray-500">{Math.round((step / 5) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="bg-blue-600 h-1 rounded-full transition-all"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Create or Join Group */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">Create or Join a Group</h2>
                <p className="text-sm text-gray-600">
                  WEAVE works best with trusted groups. Start a new group or join an existing one.
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    placeholder="e.g., Family, Work Team, Close Friends"
                    className="w-full px-3 py-2 border border-gray-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    disabled={!groupName.trim()}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Group
                  </button>
                  <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200">
                    Join Existing
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Relationship Type */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">What's your relationship type?</h2>
                <p className="text-sm text-gray-600">
                  This helps WEAVE understand context and extract the right information.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(['partner', 'family', 'team'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setRelationshipType(type)}
                    className={`p-4 border-2 rounded-2xl text-center transition-colors ${
                      relationshipType === type
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Users className={`w-6 h-6 mx-auto mb-2 ${
                      relationshipType === type ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="text-sm font-medium text-gray-900 capitalize">{type}</div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!relationshipType}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Memory Sensitivity */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">Memory Sensitivity</h2>
                <p className="text-sm text-gray-600">
                  How selective should WEAVE be about what gets saved? Higher sensitivity means only the most important items.
                </p>
              </div>
              <div className="space-y-3">
                {(['low', 'medium', 'high'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => setMemorySensitivity(level)}
                    className={`w-full p-4 border-2 rounded-2xl text-left transition-colors ${
                      memorySensitivity === level
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900 capitalize mb-1">{level}</div>
                        <div className="text-xs text-gray-600">
                          {level === 'low' && 'Save more items, including casual mentions'}
                          {level === 'medium' && 'Balance between important and casual items'}
                          {level === 'high' && 'Only save clearly important decisions and plans'}
                        </div>
                      </div>
                      {memorySensitivity === level && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!memorySensitivity}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Voice Features */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">Voice Features</h2>
                <p className="text-sm text-gray-600">
                  Enable voice capture and spoken memory briefings powered by ElevenLabs.
                </p>
              </div>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Mic className="w-5 h-5 text-gray-700" />
                      <span className="text-sm font-medium text-gray-900">Voice Capture</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={voiceEnabled}
                        onChange={(e) => setVoiceEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-600">
                    Record voice messages and have WEAVE transcribe them automatically.
                  </p>
                </div>
                {voiceEnabled && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-700">
                        <p className="font-medium mb-1">Voice Briefings</p>
                        <p>WEAVE can generate spoken summaries of your memories and decisions using ElevenLabs. You can enable this in settings later.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Explanation */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">How WEAVE Works</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Here's a quick overview of how WEAVE extracts and stores information from your conversations.
                </p>
              </div>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">Automatic Extraction</div>
                      <div className="text-xs text-gray-600">
                        As you chat, WEAVE automatically identifies plans, decisions, recommendations, promises, and memories. No need to manually tag anything.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">Bidirectional Linking</div>
                      <div className="text-xs text-gray-600">
                        Every extracted entity is linked back to the exact message where it was mentioned. Click any entity to jump to its source.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Mic className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900 mb-1">Intent-Based Recall</div>
                      <div className="text-xs text-gray-600">
                        Search by what you're trying to remember, not just keywords. Ask "when did we decide on colors?" and WEAVE finds the right moment.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-2xl text-sm font-medium hover:bg-gray-200"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Setting up...' : (
                    <>
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

