import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface EditStingerModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string, transitionFile: string) => void
  initialName: string
  initialTransitionFile: string
}

export default function EditStingerModal({
  isOpen,
  onClose,
  onSave,
  initialName,
  initialTransitionFile
}: EditStingerModalProps) {
  const [name, setName] = useState(initialName)
  const [transitionFile, setTransitionFile] = useState(initialTransitionFile)

  useEffect(() => {
    setName(initialName)
    setTransitionFile(initialTransitionFile)
  }, [initialName, initialTransitionFile])

  const handleSave = () => {
    onSave(name, transitionFile)
    onClose()
  }

  // This is a mock list of transition files. In a real application, this would be fetched from the vMix API.
  const transitionFiles = [
    'transition1.mp4', 'transition2.mp4', 'transition3.mp4', 'transition4.mp4',
    'wipe1.png', 'wipe2.png', 'wipe3.png', 'wipe4.png',
    'stinger1.mov', 'stinger2.mov', 'stinger3.mov', 'stinger4.mov'
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gray-800 p-4 sm:p-6 rounded-lg w-full max-w-md"
          >
            <h2 className="text-lg sm:text-xl font-bold text-amber-400 mb-4">编辑 Stinger 转场</h2>
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
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white text-sm sm:text-base shadow-sm focus:border-amber-500 focus:ring-amber-500"
                />
              </div>
              <div>
                <label htmlFor="transitionFile" className="block text-sm font-medium text-gray-300">
                  转场文件
                </label>
                <select
                  id="transitionFile"
                  value={transitionFile}
                  onChange={(e) => setTransitionFile(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white text-sm sm:text-base shadow-sm focus:border-amber-500 focus:ring-amber-500"
                >
                  {transitionFiles.map((file) => (
                    <option key={file} value={file}>
                      {file}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-600 text-white rounded text-sm sm:text-base hover:bg-gray-500"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-amber-500 text-black rounded text-sm sm:text-base hover:bg-amber-400"
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

