'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface VoiceMessagePlayerProps {
  audioUrl: string;
  waveform?: number[];
}

/**
 * Audio player component for voice messages
 */
export function VoiceMessagePlayer({ audioUrl, waveform }: VoiceMessagePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioUrl]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };

  const formatTime = (seconds: number): string => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-2xl px-3 py-2">
      <button
        onClick={handlePlayPause}
        className="p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex-shrink-0"
      >
        {isPlaying ? (
          <Pause className="w-3.5 h-3.5" />
        ) : (
          <Play className="w-3.5 h-3.5" />
        )}
      </button>

      {waveform && waveform.length > 0 ? (
        <div className="flex-1 flex items-center gap-0.5 h-6">
          {waveform.map((amp, i) => {
            const isActive = (i / waveform.length) * 100 <= progress;
            return (
              <div
                key={i}
                className={`w-0.5 rounded-full transition-colors ${
                  isActive && isPlaying ? 'bg-blue-600' : 'bg-blue-400'
                }`}
                style={{ height: `${amp * 20 + 4}px` }}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex-1 h-1 bg-blue-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <span className="text-xs text-blue-700 font-medium flex-shrink-0">
        {formatTime(isPlaying ? currentTime : duration)}
      </span>

      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
}
