'use client';

import { useState, useRef, useCallback } from 'react';

export interface VoiceRecording {
  audioBlob: Blob;
  audioUrl: string;
  duration: number;
  waveform: number[];
}

/**
 * Hook for recording voice messages
 */
export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<VoiceRecording | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);

  /**
   * Generate waveform data from audio buffer
   */
  const generateWaveform = async (audioBlob: Blob): Promise<number[]> => {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const rawData = audioBuffer.getChannelData(0); // Get first channel
      const samples = 64; // Number of bars in waveform
      const blockSize = Math.floor(rawData.length / samples);
      const waveform: number[] = [];

      for (let i = 0; i < samples; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[i * blockSize + j]);
        }
        waveform.push(sum / blockSize);
      }

      // Normalize to 0-1 range
      const max = Math.max(...waveform);
      return waveform.map(val => max > 0 ? val / max : 0);
    } catch (err) {
      console.error('Error generating waveform:', err);
      // Return a simple waveform if analysis fails
      return Array(64).fill(0).map(() => Math.random() * 0.5 + 0.3);
    }
  };

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      audioChunksRef.current = [];
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
        
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorder.mimeType });
        const audioUrl = URL.createObjectURL(audioBlob);
        const duration = (Date.now() - startTimeRef.current) / 1000;
        
        // Generate waveform
        const waveform = await generateWaveform(audioBlob);
        
        setRecording({
          audioBlob,
          audioUrl,
          duration,
          waveform,
        });
      };

      startTimeRef.current = Date.now();
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err: any) {
      console.error('Error starting recording:', err);
      setError(err.message || 'Failed to access microphone. Please check permissions.');
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
    
    // Clean up stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, [isRecording]);

  const clearRecording = useCallback(() => {
    if (recording?.audioUrl) {
      URL.revokeObjectURL(recording.audioUrl);
    }
    setRecording(null);
    setError(null);
  }, [recording]);

  return {
    isRecording,
    recording,
    error,
    startRecording,
    stopRecording,
    clearRecording,
  };
}
