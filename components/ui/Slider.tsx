'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface SliderProps {
  value: number
  min: number
  max: number
  step?: number
  onChange: (value: number) => void
  className?: string
  disabled?: boolean
}

export function Slider({ value, min, max, step = 0.1, onChange, className = '', disabled = false }: SliderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const percentage = ((value - min) / (max - min)) * 100

  const updateValueFromEvent = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return
    
    const rect = sliderRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    const newValue = min + (percentage / 100) * (max - min)
    const steppedValue = Math.round(newValue / step) * step
    const clampedValue = Math.max(min, Math.min(max, steppedValue))
    
    onChange(clampedValue)
  }, [min, max, step, onChange])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled) return
    setIsDragging(true)
    updateValueFromEvent(e)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      if (disabled) return
      updateValueFromEvent(e)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, disabled, updateValueFromEvent])

  return (
    <div className={`relative ${className}`}>
      <div
        ref={sliderRef}
        className={`
          relative h-2 bg-gray-200 rounded-full cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onMouseDown={handleMouseDown}
      >
        <div
          className="absolute h-full bg-blue-600 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
        <div
          className={`
            absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-blue-600 rounded-full
            transition-all cursor-grab active:cursor-grabbing
            ${disabled ? 'cursor-not-allowed' : ''}
          `}
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    </div>
  )
}

