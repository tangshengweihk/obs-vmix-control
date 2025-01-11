'use client'

import { useState } from 'react'
import { Edit2 } from 'lucide-react'
import EditStingerModal from './EditStingerModal'

interface Stinger {
  id: number
  name: string
  transitionFile: string
}

export default function StingerModule() {
  const [stingers, setStingers] = useState<Stinger[]>([
    { id: 1, name: 'Stinger 1', transitionFile: 'transition1.mp4' },
    { id: 2, name: 'Stinger 2', transitionFile: 'transition2.mp4' },
    { id: 3, name: 'Stinger 3', transitionFile: 'transition3.mp4' },
    { id: 4, name: 'Stinger 4', transitionFile: 'transition4.mp4' },
  ])
  const [activeStinger, setActiveStinger] = useState<number | null>(null)
  const [editingStinger, setEditingStinger] = useState<Stinger | null>(null)

  const handleStingerClick = (id: number) => {
    setActiveStinger(id === activeStinger ? null : id)
  }

  const handleEditStart = (event: React.MouseEvent, stinger: Stinger) => {
    event.stopPropagation()
    setEditingStinger(stinger)
  }

  const handleEditSave = (name: string, transitionFile: string) => {
    setStingers(stingers.map(stinger =>
      stinger.id === editingStinger?.id ? { ...stinger, name, transitionFile } : stinger
    ))
    setEditingStinger(null)
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-400">Stinger 转场</h3>
      <div className="grid grid-cols-2 gap-2">
        {stingers.map((stinger) => (
          <div key={stinger.id} className="relative group">
            <button
              onClick={() => handleStingerClick(stinger.id)}
              className={`w-full rounded-md p-2 sm:p-3 text-xs sm:text-sm font-medium transition-colors duration-200 ${
                activeStinger === stinger.id
                  ? 'bg-amber-400 text-black'
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
            >
              {stinger.name}
            </button>
            <button
              onClick={(e) => handleEditStart(e, stinger)}
              className="absolute top-1 right-1 p-1 bg-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Edit2 size={12} className="text-amber-400" />
            </button>
          </div>
        ))}
      </div>
      <EditStingerModal
        isOpen={editingStinger !== null}
        onClose={() => setEditingStinger(null)}
        onSave={handleEditSave}
        initialName={editingStinger?.name || ''}
        initialTransitionFile={editingStinger?.transitionFile || ''}
      />
    </div>
  )
}

