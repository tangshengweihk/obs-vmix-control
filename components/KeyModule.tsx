import React, { useState } from 'react'
import { Edit2 } from 'lucide-react'
import EditKeyModal from './EditKeyModal'

interface Key {
  id: number
  name: string
  inputSource?: string
  scene?: string
  isPgm: boolean
}

interface KeyModuleProps {
  softwareType: 'OBS' | 'VMIX'
}

export default function KeyModule({ softwareType }: KeyModuleProps) {
  const [keys, setKeys] = useState<Key[]>(() => {
    if (softwareType === 'OBS') {
      return [
        { id: 1, name: 'Key 1 PGM', scene: 'Scene 1', isPgm: true },
        { id: 2, name: 'Key 2 PGM', scene: 'Scene 2', isPgm: true },
        { id: 3, name: 'Key 3 PGM', scene: 'Scene 3', isPgm: true },
        { id: 4, name: 'Key 4 PGM', scene: 'Scene 4', isPgm: true },
        { id: 5, name: 'Key 1 PVW', scene: 'Scene 1', isPgm: false },
        { id: 6, name: 'Key 2 PVW', scene: 'Scene 2', isPgm: false },
        { id: 7, name: 'Key 3 PVW', scene: 'Scene 3', isPgm: false },
        { id: 8, name: 'Key 4 PVW', scene: 'Scene 4', isPgm: false },
      ]
    } else {
      return [
        { id: 1, name: 'Key 1 PGM', inputSource: 'Input 1', isPgm: true },
        { id: 2, name: 'Key 2 PGM', inputSource: 'Input 2', isPgm: true },
        { id: 3, name: 'Key 3 PGM', inputSource: 'Input 3', isPgm: true },
        { id: 4, name: 'Key 4 PGM', inputSource: 'Input 4', isPgm: true },
        { id: 5, name: 'Key 1 PVW', inputSource: 'Input 1', isPgm: false },
        { id: 6, name: 'Key 2 PVW', inputSource: 'Input 2', isPgm: false },
        { id: 7, name: 'Key 3 PVW', inputSource: 'Input 3', isPgm: false },
        { id: 8, name: 'Key 4 PVW', inputSource: 'Input 4', isPgm: false },
      ]
    }
  })
  const [activeKeys, setActiveKeys] = useState<number[]>([])
  const [editingKey, setEditingKey] = useState<Key | null>(null)

  const toggleKey = (keyId: number) => {
    setActiveKeys(prev => 
      prev.includes(keyId) 
        ? prev.filter(k => k !== keyId) 
        : [...prev, keyId]
    )
  }

  const handleEditStart = (key: Key) => {
    setEditingKey(key)
  }

  const handleEditSave = (name: string, inputSourceOrScene: string) => {
    setKeys(keys.map(key =>
      key.id === editingKey?.id 
        ? softwareType === 'OBS'
          ? { ...key, name, scene: inputSourceOrScene }
          : { ...key, name, inputSource: inputSourceOrScene }
        : key
    ))
    setEditingKey(null)
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm h-full">
      <h3 className="font-medium text-lg text-amber-400 mb-4">Key</h3>
      <div className="grid grid-cols-4 gap-2">
        {keys.map((key) => (
          <div key={key.id} className="relative group">
            <button
              onClick={() => toggleKey(key.id)}
              className={`rounded-md h-20 ${
                activeKeys.includes(key.id) 
                  ? key.isPgm 
                    ? 'bg-red-500 text-white' 
                    : 'bg-amber-400 text-black'
                  : 'bg-gray-700 text-amber-100'
              } hover:bg-amber-300 hover:text-black transition-colors duration-200 text-xs font-medium flex items-center justify-center p-2 text-center w-full`}
            >
              <span className="whitespace-normal leading-tight">
                {key.name}
              </span>
            </button>
            <button
              onClick={() => handleEditStart(key)}
              className="absolute top-1 right-1 p-1 bg-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Edit2 size={12} className="text-amber-400" />
            </button>
          </div>
        ))}
      </div>
      <EditKeyModal
        isOpen={editingKey !== null}
        onClose={() => setEditingKey(null)}
        onSave={handleEditSave}
        initialName={editingKey?.name || ''}
        initialInputSourceOrScene={softwareType === 'OBS' ? editingKey?.scene || '' : editingKey?.inputSource || ''}
        softwareType={softwareType}
      />
    </div>
  )
}

