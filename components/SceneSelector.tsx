interface SceneSelectorProps {
  softwareType: 'OBS' | 'VMIX'
}

export default function SceneSelector({ softwareType }: SceneSelectorProps) {
  const scenes = softwareType === 'OBS' 
    ? ['Main Camera', 'Screen Share', 'Overlay 1', 'Overlay 2'] 
    : ['Input 1', 'Input 2', 'Input 3', 'Input 4', 'Overlay']

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
      <h3 className="font-medium text-lg text-amber-400 mb-4">
        {softwareType === 'OBS' ? 'Scenes' : 'Inputs'}
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {scenes.map((scene, index) => (
          <button
            key={index}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-gray-700 text-amber-100 h-9 px-4 py-2 hover:bg-gray-600 transition-colors duration-200"
          >
            {scene}
          </button>
        ))}
      </div>
    </div>
  )
}

