import React, { useState, useEffect } from 'react'
import { Play, Video } from 'lucide-react'

interface StreamControlsProps {
  softwareType: 'OBS' | 'VMIX'
}

export default function StreamControls({ softwareType }: StreamControlsProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [streamTime, setStreamTime] = useState(0)
  const [recordTime, setRecordTime] = useState(0)

  useEffect(() => {
    let streamInterval: NodeJS.Timeout
    let recordInterval: NodeJS.Timeout

    if (isStreaming) {
      streamInterval = setInterval(() => {
        setStreamTime((prevTime) => prevTime + 1)
      }, 1000)
    }

    if (isRecording) {
      recordInterval = setInterval(() => {
        setRecordTime((prevTime) => prevTime + 1)
      }, 1000)
    }

    return () => {
      if (streamInterval) clearInterval(streamInterval)
      if (recordInterval) clearInterval(recordInterval)
    }
  }, [isStreaming, isRecording])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (softwareType === 'VMIX') {
    return (
      <div className="space-y-4">
        <button
          onClick={() => setIsStreaming(!isStreaming)}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 ${
            isStreaming
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-amber-400 hover:bg-amber-500 text-black'
          } transition-colors duration-200`}
        >
          {isStreaming ? 'Stop Stream' : 'Start Stream'}
          <Play className="h-4 w-4" />
        </button>
        <button
          onClick={() => setIsRecording(!isRecording)}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          } transition-colors duration-200`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
          <Video className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setIsStreaming(!isStreaming)}
        className="w-full bg-amber-400 hover:bg-amber-500 text-black font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
      >
        Start Stream
        <Play className="h-4 w-4" />
      </button>
      <button
        onClick={() => setIsRecording(!isRecording)}
        className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
      >
        Start Recording
        <Video className="h-4 w-4" />
      </button>
      <div className="space-y-2">
        <div>
          <div className="text-gray-400">Stream Time</div>
          <div className="text-xl font-mono font-bold text-amber-400">
            {formatTime(streamTime)}
          </div>
        </div>
        <div>
          <div className="text-gray-400">Record Time</div>
          <div className="text-xl font-mono font-bold text-amber-400">
            {formatTime(recordTime)}
          </div>
        </div>
      </div>
    </div>
  )
}

