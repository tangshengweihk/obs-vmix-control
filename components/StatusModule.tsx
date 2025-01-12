import { Switch } from '@/components/ui/switch'

interface StatusModuleProps {
  softwareType: 'OBS' | 'VMIX';
  connected: boolean;
  autoReconnect: boolean;
  onAutoReconnectChange: (checked: boolean) => void;
  ws: WebSocket | null;
}

export default function StatusModule({ 
  softwareType, 
  connected, 
  autoReconnect,
  onAutoReconnectChange 
}: StatusModuleProps) {
  if (softwareType === 'VMIX') {
    return null
  }

  return (
    <div className="space-y-2">
      {/* Status Indicators */}
      <div className="space-y-2">
        {/* Connection Status */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center">
              <h3 className="text-sm text-gray-400">连接状态</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">自动重连</span>
                <Switch 
                  checked={autoReconnect}
                  onCheckedChange={onAutoReconnectChange}
                  className="data-[state=checked]:bg-amber-400" 
                />
              </div>
            </div>
            <p className={`text-lg font-medium mt-2 ${connected ? 'text-emerald-400' : 'text-red-400'}`}>
              {connected ? 'connected' : 'disconnected'}
            </p>
          </div>
        </div>

        {/* Stream Status */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <h3 className="text-sm text-gray-400">推流状态</h3>
          <p className="text-gray-300 text-lg font-medium mt-2">stopped</p>
        </div>

        {/* Recording Status */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <h3 className="text-sm text-gray-400">录制状态</h3>
          <p className="text-gray-300 text-lg font-medium mt-2">stopped</p>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="space-y-2">
        {/* CPU Usage */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <h3 className="text-sm text-gray-400">CPU使用率</h3>
          <p className="text-gray-300 text-lg font-medium mt-2">1.0%</p>
          <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: '1%' }} />
          </div>
        </div>

        {/* Memory Usage */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <h3 className="text-sm text-gray-400">内存使用</h3>
          <p className="text-gray-300 text-lg font-medium mt-2">356.1MB</p>
          <p className="text-xs text-gray-500 mt-1">系统资源占用</p>
          <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: '35%' }} />
          </div>
        </div>

        {/* Frame Rate */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <h3 className="text-sm text-gray-400">帧率</h3>
          <p className="text-gray-300 text-lg font-medium mt-2">59.9 FPS</p>
          <p className="text-xs text-gray-500 mt-1">丢帧: 0 / 0</p>
        </div>

        {/* Bitrate */}
        <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
          <h3 className="text-sm text-gray-400">比特率</h3>
          <p className="text-gray-300 text-lg font-medium mt-2">0 Kb/s</p>
          <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: '0%' }} />
          </div>
        </div>
      </div>
    </div>
  )
}

