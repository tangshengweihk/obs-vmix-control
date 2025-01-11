'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Edit2 } from 'lucide-react'
import EditMacroModal from './EditMacroModal'

interface MacroButton {
  id: number
  name: string
  shortcut: string
}

interface MacroModuleProps {
  softwareType: 'OBS' | 'VMIX'
}

export default function MacroModule({ softwareType }: MacroModuleProps) {
  const [macroButtons, setMacroButtons] = useState<MacroButton[]>(
    Array.from({ length: 20 }, (_, i) => ({ id: i + 1, name: `M${i + 1}`, shortcut: '' }))
  )
  const [clickedButton, setClickedButton] = useState<number | null>(null)
  const [editingButton, setEditingButton] = useState<MacroButton | null>(null)

  const handleButtonClick = (id: number) => {
    if (editingButton === null) {
      setClickedButton(id)
      // 这里可以添加触发宏的逻辑
      console.log(`Macro ${id} triggered`)
      // 模拟按钮点击效果
      setTimeout(() => setClickedButton(null), 200)
    }
  }

  const handleEditStart = (event: React.MouseEvent, button: MacroButton) => {
    event.stopPropagation()
    setEditingButton(button)
  }

  const handleEditSave = (name: string, shortcut: string) => {
    setMacroButtons(buttons =>
      buttons.map(button =>
        button.id === editingButton?.id ? { ...button, name, shortcut } : button
      )
    )
    setEditingButton(null)
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const pressedKeys = []
    if (e.ctrlKey) pressedKeys.push('Ctrl')
    if (e.shiftKey) pressedKeys.push('Shift')
    if (e.altKey) pressedKeys.push('Alt')
    if (e.metaKey) pressedKeys.push('Meta')
    if (e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt' && e.key !== 'Meta') {
      pressedKeys.push(e.key.toUpperCase())
    }
    const pressedShortcut = pressedKeys.join('+')

    const matchedButton = macroButtons.find(button => button.shortcut === pressedShortcut)
    if (matchedButton) {
      e.preventDefault()
      handleButtonClick(matchedButton.id)
    }
  }, [macroButtons])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <div className={`rounded-lg ${softwareType === 'OBS' ? 'border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm' : ''}`}>
      {softwareType === 'OBS' && <h3 className="font-medium text-lg text-amber-400 mb-4">宏按钮</h3>}
      <div className="grid grid-cols-10 gap-2">
        {macroButtons.map((button) => (
          <div key={button.id} className="relative group">
            <button
              onClick={() => handleButtonClick(button.id)}
              className={`w-full aspect-square rounded-md ${
                clickedButton === button.id ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-200'
              } hover:bg-sky-500 hover:text-white transition-colors duration-200 text-sm font-medium flex flex-col items-center justify-center`}
            >
              <span>{button.name}</span>
              {button.shortcut && (
                <span className="text-xs mt-1 opacity-60">{button.shortcut}</span>
              )}
            </button>
            <button
              onClick={(e) => handleEditStart(e, button)}
              className="absolute top-1 right-1 p-1 bg-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Edit2 size={12} className="text-amber-400" />
            </button>
          </div>
        ))}
      </div>
      <EditMacroModal
        isOpen={editingButton !== null}
        onClose={() => setEditingButton(null)}
        onSave={handleEditSave}
        initialName={editingButton?.name || ''}
        initialShortcut={editingButton?.shortcut || ''}
      />
    </div>
  )
}

