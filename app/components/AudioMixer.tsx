interface AudioMixerProps {
  softwareType: 'OBS' | 'VMIX'
}

export default function AudioMixer({ softwareType }: AudioMixerProps) {
  const audioSources = softwareType === 'OBS'
    ? ['Mic 1', 'Mic 2', 'Desktop Audio', 'Media Source']
    : ['Input 1', 'Input 2', 'Input 3', 'Input 4', 'Master']

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-800/50 p-6 backdrop-blur-sm">
      <h3 className="font-medium text-lg text-amber-400 mb-4">Audio Mixer</h3>
      <div className="space-y-4">
        {audioSources.map((source, index) => (
          <div key={index} className="flex items-center space-x-4">
            <span className="w-24 text-sm text-amber-100">{source}</span>
            <input
              type="range"
              min="0"
              max="100"
              className="flex-1 accent-amber-400"
            />
            <span className="w-12 text-right text-sm text-amber-100">0 dB</span>
            <button className="rounded-md p-2 text-amber-400 hover:bg-gray-700 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 6L8 10H6C5.44772 10 5 10.4477 5 11V13C5 13.5523 5.44772 14 6 14H8L12 18V6Z" />
                <path d="M17 7L15 9" />
                <path d="M15 15L17 17" />
                <path d="M15 9L17 7" />
                <path d="M17 17L15 15" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

