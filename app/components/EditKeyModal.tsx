import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EditKeyModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, inputSourceOrScene: string) => void
  initialName: string
  initialInputSourceOrScene: string
  softwareType: 'OBS' | 'VMIX'
}

export default function EditKeyModal({
  isOpen,
  onClose,
  onSave,
  initialName,
  initialInputSourceOrScene,
  softwareType
}: EditKeyModalProps) {
  const [name, setName] = useState(initialName)
  const [inputSourceOrScene, setInputSourceOrScene] = useState(initialInputSourceOrScene)

  useEffect(() => {
    setName(initialName)
    setInputSourceOrScene(initialInputSourceOrScene)
  }, [initialName, initialInputSourceOrScene])

  const handleSave = () => {
    onSave(name, inputSourceOrScene)
    onClose()
  }

  const inputSources = ['Input 1', 'Input 2', 'Input 3', 'Input 4', 'Input 5']
  const scenes = ['Scene 1', 'Scene 2', 'Scene 3', 'Scene 4', 'Scene 5']

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
            <h2 className="text-xl font-bold text-amber-400 mb-4">编辑Key</h2>
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
                <label htmlFor="inputSourceOrScene" className="block text-sm font-medium text-gray-300">
                  {softwareType === 'VMIX' ? '输入源' : '场景'}
                </label>
                <select
                  id="inputSourceOrScene"
                  value={inputSourceOrScene}
                  onChange={(e) => setInputSourceOrScene(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-amber-500 focus:ring-amber-500"
                >
                  {(softwareType === 'VMIX' ? inputSources : scenes).map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
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

