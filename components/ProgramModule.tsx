import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Edit2 } from 'lucide-react'
import EditInputModal from './EditInputModal'

interface Input {
  id: number
  name: string
  scene: string
}

interface ProgramModuleProps {
  softwareType: 'OBS' | 'VMIX'
}

export default function ProgramModule({ softwareType }: ProgramModuleProps) {
  const [inputs, setInputs] = useState<Input[]>(
    Array.from({ length: 10 }, (_, i) => ({ id: i + 1, name: `Input ${i + 1}`, scene: `Scene ${i + 1}` }))
  )
  const [selectedPgm, setSelectedPgm] = useState<number | null>(null)
  const [selectedPvw, setSelectedPvw] = useState<number | null>(null)
  const [editingInput, setEditingInput] = useState<Input | null>(null)

  const handleEditStart = (input: Input) => {
    setEditingInput(input)
  }

  const handleEditSave = (name: string, scene: string) => {
    setInputs(inputs.map(input =>
      input.id === editingInput?.id ? { ...input, name, scene } : input
    ))
    setEditingInput(null)
  }

  const renderButton = (input: Input, index: number, isPgm: boolean) => (
    <div key={`${isPgm ? 'pgm' : 'pvw'}-${input.id}`} className="relative group">
      <button
        onClick={() => isPgm ? setSelectedPgm(index) : setSelectedPvw(index)}
        className={`w-full aspect-square rounded-md ${
          (isPgm ? selectedPgm : selectedPvw) === index
            ? isPgm ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
            : 'bg-gray-700 text-amber-100'
        } hover:${isPgm ? 'bg-red-500' : 'bg-green-500'} hover:text-white transition-colors duration-200 text-sm font-medium flex items-center justify-center`}
      >
        {input.name}
      </button>
      <button
        onClick={() => handleEditStart(input)}
        className="absolute top-1 right-1 p-1 bg-gray-600 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <Edit2 size={12} className="text-amber-400" />
      </button>
    </div>
  )

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-lg text-amber-400 mb-4">
            {softwareType === 'OBS' ? 'PGM' : 'Program'}
          </h3>
          <div className="grid grid-cols-10 gap-2">
            {inputs.map((input, index) => renderButton(input, index, true))}
          </div>
        </div>
        <div>
          <h3 className="font-medium text-lg text-amber-400 mb-4">
            {softwareType === 'OBS' ? 'PVW' : 'Preview'}
          </h3>
          <div className="grid grid-cols-10 gap-2">
            {inputs.map((input, index) => renderButton(input, index, false))}
          </div>
        </div>
      </div>
      <EditInputModal
        isOpen={editingInput !== null}
        onClose={() => setEditingInput(null)}
        onSave={handleEditSave}
        initialName={editingInput?.name || ''}
        initialScene={editingInput?.scene || ''}
        softwareType={softwareType}
      />
    </div>
  )
}

