'use client'

import { useState } from 'react'
import Navbar from './components/Navbar'
import ConnectionForm from './components/ConnectionForm'
import ControlPanel from './components/ControlPanel'
import PanelSettings from './components/PanelSettings'

interface Panel {
  id: string
  name: string
  softwareType: 'OBS' | 'VMIX'
  ip: string
  port: string
}

export default function Home() {
  const [panels, setPanels] = useState<Panel[]>([])
  const [activePanelId, setActivePanelId] = useState<string | null>(null)
  const [editingPanelId, setEditingPanelId] = useState<string | null>(null)

  const handleConnect = (name: string, type: 'OBS' | 'VMIX', ip: string, port: string) => {
    const newPanel: Panel = {
      id: Date.now().toString(),
      name,
      softwareType: type,
      ip,
      port
    }
    setPanels([...panels, newPanel])
    setActivePanelId(newPanel.id)
  }

  const handleAddPanel = () => {
    setActivePanelId(null)
  }

  const handleDeletePanel = (id: string) => {
    setPanels(panels.filter(panel => panel.id !== id))
    if (activePanelId === id) {
      setActivePanelId(null)
    }
  }

  const handleEditPanel = (id: string) => {
    setEditingPanelId(id)
  }

  const handleUpdatePanel = (updatedPanel: Panel) => {
    setPanels(panels.map(panel => panel.id === updatedPanel.id ? updatedPanel : panel))
    setEditingPanelId(null)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <Navbar 
        panels={panels}
        activePanelId={activePanelId}
        onPanelSelect={setActivePanelId}
        onAddPanel={handleAddPanel}
        onDeletePanel={handleDeletePanel}
        onEditPanel={handleEditPanel}
      />
      <main className="container mx-auto px-4 py-8 relative z-10">
        {activePanelId === null ? (
          <ConnectionForm onConnect={handleConnect} />
        ) : (
          <ControlPanel panel={panels.find(p => p.id === activePanelId)!} />
        )}
      </main>
      {editingPanelId && (
        <PanelSettings
          panel={panels.find(p => p.id === editingPanelId)!}
          onUpdate={handleUpdatePanel}
          onClose={() => setEditingPanelId(null)}
        />
      )}
    </div>
  )
}

