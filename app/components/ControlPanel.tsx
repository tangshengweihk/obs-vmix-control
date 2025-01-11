'use client'

import { motion } from 'framer-motion'
import StatusModule from './StatusModule'
import StreamControls from './StreamControls'
import MacroModule from './MacroModule'
import ProgramModule from './ProgramModule'
import TransitionControls from './TransitionControls'
import AudioMixer from './AudioMixer'
import ExternalModule from './ExternalModule'
import KeyModule from './KeyModule'
import StingerModule from './StingerModule'

interface Panel {
  id: string
  name: string
  softwareType: 'OBS' | 'VMIX'
  ip: string
  port: string
}

interface ControlPanelProps {
  panel: Panel
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
}

export default function ControlPanel({ panel }: ControlPanelProps) {
  if (panel.softwareType === 'VMIX') {
    return (
      <motion.div
        key={panel.id}
        initial="hidden"
        animate="visible"
        className="p-2 sm:p-4 space-y-4"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left Side - Status and Controls */}
          <div className="w-full lg:w-64 space-y-4">
            <div className="text-amber-400 text-xl sm:text-2xl font-bold">{panel.name}</div>
            <div className="text-gray-400 text-xs sm:text-sm">
              已接到到 <span className="text-amber-400">VMIX</span>，地址：{panel.ip}:{panel.port}
            </div>
            <StreamControls softwareType="VMIX" />
            <StingerModule />
          </div>
          
          {/* Right Side - Main Content */}
          <motion.div variants={fadeIn} className="flex-1 space-y-4">
            <MacroModule softwareType="VMIX" />
            <ProgramModule softwareType="VMIX" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
              <div className="sm:col-span-1 lg:col-span-3">
                <ExternalModule />
              </div>
              <div className="sm:col-span-1 lg:col-span-6">
                <KeyModule softwareType="VMIX" />
              </div>
              <div className="sm:col-span-1 lg:col-span-3">
                <TransitionControls softwareType="VMIX" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      key={panel.id}
      initial="hidden"
      animate="visible"
      className="p-2 sm:p-4 space-y-4"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left Side - Status and Controls */}
        <div className="w-full lg:w-80 space-y-4">
          <div className="text-amber-400 text-xl sm:text-2xl font-bold">{panel.name}</div>
          <div className="text-gray-400 text-xs sm:text-sm">
            已连接到 <span className="text-amber-400">OBS</span>，地址：{panel.ip}:{panel.port}
          </div>
          <StatusModule softwareType="OBS" />
          <StreamControls softwareType="OBS" />
        </div>
        
        {/* Right Side - Main Content */}
        <div className="flex-1 space-y-4">
          <MacroModule softwareType="OBS" />
          <ProgramModule softwareType="OBS" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4">
            <div className="sm:col-span-1 lg:col-span-4">
              <AudioMixer softwareType="OBS" />
            </div>
            <div className="sm:col-span-1 lg:col-span-5">
              <KeyModule softwareType="OBS" />
            </div>
            <div className="sm:col-span-1 lg:col-span-3">
              <TransitionControls softwareType="OBS" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

