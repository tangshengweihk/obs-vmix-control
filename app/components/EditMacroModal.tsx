import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EditMacroModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, shortcut: string) => void
  initialName: string
  initialShortcut: string
}

export default function EditMacroModal({
  isOpen,
  onClose,
  onSave,
  initialName,
  initialShortcut
}: EditMacroModalProps) {
  const [name, setName] = useState(initialName)
  const [shortcut, setShortcut] = useState(initialShortcut)
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    setName(initialName)
    setShortcut(initialShortcut)
  }, [initialName, initialShortcut])

  const handleSave = () => {
    onSave(name, shortcut)
    onClose()
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault()
    if (isListening) {
      const keys = []
      if (e.ctrlKey) keys.push('Ctrl')
      if (e.shiftKey) keys.push('Shift')
      if (e.altKey) keys.push('Alt')
      if (e.metaKey) keys.push('Meta')
      if (e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt' && e.key !== 'Meta') {
        keys.push(e.key.toUpperCase())
      }
      setShortcut(keys.join('+'))
      setIsListening(false)
    }
  }, [isListening])

  useEffect(() => {
    if (isListening) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isListening, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gray-800 p-6 rounded-lg w-96"
          >
            <h2 className="text-xl font-bold text-amber-400 mb-4">编辑宏</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  名称
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="shortcut" className="block text-sm font-medium text-gray-300">
                  快捷键
                </label>
                <div className="flex mt-1">
                  <input
                    type="text"
                    id="shortcut"
                    value={shortcut}
                    readOnly
                    className="block w-full rounded-l-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-amber-500 focus:ring-amber-500"
                    placeholder={isListening ? "按下快捷键..." : "点击设置快捷键"}
                  />
                  <button
                    onClick={() => setIsListening(true)}
                    className="px-4 py-2 bg-amber-500 text-black hover:bg-amber-400"
                  >
                    {isListening ? "监听中" : "设置"}
                  </button>
                  <button
                    onClick={() => setShortcut('')}
                    className="px-4 py-2 bg-red-500 text-white rounded-r-md hover:bg-red-400"
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-400"
              >
                保存
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

