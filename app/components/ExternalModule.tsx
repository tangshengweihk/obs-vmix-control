import React, { useState } from 'react'
import { Switch } from '@/components/ui/switch'

interface ExternalOutput {
  id: number
  name: string
  isOn: boolean
}

export default function ExternalModule() {
  const [outputs, setOutputs] = useState<ExternalOutput[]>([
    { id: 1, name: 'Output 1', isOn: false },
    { id: 2, name: 'Output 2', isOn: false },
    { id: 3, name: 'Output 3', isOn: false },
    { id: 4, name: 'Output 4', isOn: false },
  ])

  const toggleOutput = (id: number) => {
    setOutputs(outputs.map(output => 
      output.id === id ? { ...output, isOn: !output.isOn } : output
    ))
  }

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm h-full">
      <h3 className="font-medium text-lg text-amber-400">External</h3>
      <div className="space-y-6">
        {outputs.map(output => (
          <div key={output.id} className="flex items-center justify-between">
            <span className="text-gray-300">{output.name}</span>
            <Switch
              checked={output.isOn}
              onCheckedChange={() => toggleOutput(output.id)}
              className="data-[state=checked]:bg-amber-400"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

