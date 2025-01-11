import React, { useState } from 'react'

interface Panel {
  id: string
  name: string
  softwareType: 'OBS' | 'VMIX'
  ip: string
  port: string
}

interface PanelSettingsProps {
  panel: Panel
  onUpdate: (updatedPanel: Panel) => void
  onClose: () => void
}

export default function PanelSettings({ panel, onUpdate, onClose }: PanelSettingsProps) {
  const [name, setName] = useState(panel.name)
  const [ip, setIp] = useState(panel.ip)
  const [port, setPort] = useState(panel.port)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate({ ...panel, name, ip, port })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-amber-400 mb-4">Panel Settings</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-amber-400">
              Panel Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-amber-100 focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="ip" className="block text-sm font-medium text-amber-400">
              IP Address
            </label>
            <input
              type="text"
              id="ip"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-amber-100 focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="port" className="block text-sm font-medium text-amber-400">
              Port
            </label>
            <input
              type="text"
              id="port"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-amber-100 focus:border-amber-400 focus:outline-none"
            />
          </div>
          <div className="flex justify-end space-x-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-gray-700 text-amber-100 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-amber-400 text-black hover:bg-amber-300 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

