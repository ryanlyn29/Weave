'use client';

import { useState, useRef } from 'react';
import { Mic, MicOff, X, Play, Pause } from 'lucide-react';
import { useVoiceRecorder, VoiceRecording } from '@/lib/hooks/useVoiceRecorder';

interface VoiceRecorderProps {
  onRecordingComplete?: (recording: VoiceRecording) => void;
  onCancel?: () => void;
}

/**
 * Voice recorder component with playback preview
 */
export function VoiceRecorder({ onRecordingComplete, onCancel }: VoiceRecorderProps) {
  const { isRecording, recording, error, startRecording, stopRecording, clearRecording } = useVoiceRecorder();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStart = async () => {
    await startRecording();
  };

  const handleStop = () => {
    stopRecording();
  };

  const handlePlayPause = () => {
    if (!recording || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const handleSend = () => {
    if (recording) {
      onRecordingComplete?.(recording);
      clearRecording();
    }
  };

  const handleCancel = () => {
    clearRecording();
    onCancel?.();
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-700">
          {error}
        </div>
      )}

      {!recording ? (
        <div className="flex items-center gap-3">
          <button
            onClick={isRecording ? handleStop : handleStart}
            className={`p-3 rounded-2xl transition-colors ${
              isRecording
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>
          
          {isRecording && (
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Recording...</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="border border-gray-200 rounded-2xl p-3 bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlayPause}
              className="p-2 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-100"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

            {recording.audioUrl && (
              <audio
                ref={(el) => {
                  audioRef.current = el;
                  if (el) {
                    el.addEventListener('ended', () => setIsPlaying(false));
                    el.addEventListener('pause', () => setIsPlaying(false));
                    el.addEventListener('play', () => setIsPlaying(true));
                  }
                }}
                src={recording.audioUrl}
                hidden
              />
            )}

            <div className="flex-1">
              {recording.waveform && recording.waveform.length > 0 && (
                <div className="flex items-center gap-0.5 h-8">
                  {recording.waveform.map((amp, i) => (
                    <div
                      key={i}
                      className="w-0.5 bg-blue-600 rounded-full"
                      style={{ height: `${amp * 24 + 4}px` }}
                    />
                  ))}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {Math.round(recording.duration)}s
              </div>
            </div>

            <button
              onClick={handleSend}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-2xl hover:bg-blue-700"
            >
              Send
            </button>
            
            <button
              onClick={handleCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-2xl"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
