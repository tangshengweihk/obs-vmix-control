import { useState } from 'react'
import { Plus, Trash2, Settings } from 'lucide-react'

interface Panel {
  id: string
  name: string
}

interface NavbarProps {
  panels: Panel[]
  activePanelId: string | null
  onPanelSelect: (id: string | null) => void
  onAddPanel: () => void
  onDeletePanel: (id: string) => void
  onEditPanel: (id: string) => void
}

export default function Navbar({ panels, activePanelId, onPanelSelect, onDeletePanel, onAddPanel, onEditPanel }: NavbarProps) {
  const [isDeleteMode, setIsDeleteMode] = useState(false)

  return (
    <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center">
            <span className="font-medium text-amber-400">Control Panel</span>
          </div>
          
          <div className="flex-grow flex items-center justify-center gap-2">
            {panels.map((panel) => (
              <div key={panel.id} className="flex items-center">
                <button
                  onClick={() => onPanelSelect(panel.id)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    activePanelId === panel.id
                      ? 'bg-amber-400 text-black'
                      : 'text-amber-400 hover:bg-gray-800'
                  } transition-colors duration-200`}
                >
                  {panel.name}
                </button>
                {isDeleteMode && (
                  <button
                    onClick={() => onDeletePanel(panel.id)}
                    className="ml-1 p-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                    aria-label={`Delete ${panel.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onAddPanel}
              className="rounded-md p-2 text-amber-400 hover:bg-gray-800 transition-colors duration-200"
              aria-label="Add new panel"
            >
              <Plus className="h-5 w-5" />
            </button>
            {activePanelId && (
              <button
                onClick={() => onEditPanel(activePanelId)}
                className="rounded-md p-2 text-amber-400 hover:bg-gray-800 transition-colors duration-200"
                aria-label="Edit panel settings"
              >
                <Settings className="h-5 w-5" />
              </button>
            )}
            <button
              onClick={() => setIsDeleteMode(!isDeleteMode)}
              className={`rounded-md p-2 ${
                isDeleteMode ? 'bg-red-500 text-white' : 'text-amber-400 hover:bg-gray-800'
              } transition-colors duration-200`}
              aria-label="Toggle delete mode"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

