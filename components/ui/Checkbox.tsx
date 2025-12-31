'use client'

import { Check } from 'lucide-react'

interface CheckboxProps {
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
  disabled?: boolean
}

export function Checkbox({ checked, onChange, className = '', disabled = false }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`
        w-4 h-4 flex items-center justify-center border-2 rounded transition-colors
        ${checked 
          ? 'bg-blue-600 border-blue-600' 
          : 'bg-white border-gray-300'
        }
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer hover:border-blue-400'
        }
        ${className}
      `}
    >
      {checked && (
        <Check className="w-3 h-3 text-white" strokeWidth={3} />
      )}
    </button>
  )
}

