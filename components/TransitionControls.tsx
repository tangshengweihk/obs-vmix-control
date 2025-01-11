import React from 'react'

interface TransitionControlsProps {
  softwareType: 'OBS' | 'VMIX'
}

export default function TransitionControls({ softwareType }: TransitionControlsProps) {
  const transitions = softwareType === 'OBS'
    ? ['Cut', 'Fade', 'Swipe', 'Slide']
    : ['Cut', 'Fade', 'Zoom', 'Wipe', 'Slide', 'Fly']

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-4 backdrop-blur-sm h-full">
      <div className="space-y-6">
        <h3 className="font-medium text-lg text-amber-400">Transition</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-2 rounded-md transition-colors duration-200 text-sm">
              Cut
            </button>
            <button className="w-full bg-amber-400 hover:bg-amber-300 text-black font-medium py-2 px-2 rounded-md transition-colors duration-200 text-sm">
              Auto
            </button>
          </div>
          <select className="w-full rounded-md border border-gray-700 bg-gray-700 px-2 py-2 text-sm text-amber-100 focus:border-amber-400 focus:outline-none">
            {transitions.map((transition, index) => (
              <option key={index}>{transition}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

