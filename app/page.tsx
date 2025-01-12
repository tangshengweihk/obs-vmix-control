'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import ControlPanel from '@/components/ControlPanel'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings } from 'lucide-react'
import { Switch } from '@/components/ui/switch'

interface Panel {
  id: string
  name: string
  softwareType: 'OBS' | 'VMIX'
  ip: string
  port: string
  connected: boolean
  autoReconnect: boolean
  ws: WebSocket | null
}

// 预设的20个面板配置
const defaultPanels: Panel[] = [
  // OBS面板 1-10
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `obs${i + 1}`,
    name: `OBS${i + 1}`,
    softwareType: 'OBS' as const,
    ip: '',
    port: '4455',
    connected: false,
    autoReconnect: true,
    ws: null
  })),
  // VMIX面板 1-10
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `vmix${i + 1}`,
    name: `VMIX${i + 1}`,
    softwareType: 'VMIX' as const,
    ip: '',
    port: '8088',
    connected: false,
    autoReconnect: true,
    ws: null
  }))
];

export default function Home() {
  // 使用 useEffect 来处理客户端数据加载
  const [isClient, setIsClient] = useState(false);
  
  // 从本地存储加载面板配置
  const [panels, setPanels] = useState<Panel[]>(defaultPanels);
  const [activePanel, setActivePanel] = useState<Panel | null>(defaultPanels[0]);
  const [showSettings, setShowSettings] = useState(false);
  const [editingPanel, setEditingPanel] = useState<Panel | null>(null);

  // 在客户端加载数据
  useEffect(() => {
    const savedPanels = localStorage.getItem('panels');
    const savedActivePanel = localStorage.getItem('activePanel');
    
    if (savedPanels) {
      setPanels(JSON.parse(savedPanels));
    }
    
    if (savedActivePanel) {
      setActivePanel(JSON.parse(savedActivePanel));
    }
    
    setIsClient(true);
  }, []);

  // 保存面板配置到本地存储
  useEffect(() => {
    if (isClient) {
      localStorage.setItem('panels', JSON.stringify(panels));
    }
  }, [panels, isClient]);

  // 保存当前活动面板到本地存储
  useEffect(() => {
    if (isClient && activePanel) {
      localStorage.setItem('activePanel', JSON.stringify(activePanel));
    }
  }, [activePanel, isClient]);

  // 处理连接状态
  useEffect(() => {
    if (!activePanel?.ip) {
      setPanels(prev => prev.map(p => 
        p.id === activePanel?.id ? { ...p, connected: false, ws: null } : p
      ));
      return;
    }

    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;
    let isConnected = false;
    let reconnectAttempts = 0;
    const MAX_RECONNECT_ATTEMPTS = 3;

    const updateConnectionStatus = (panelId: string, status: boolean, websocket: WebSocket | null = null) => {
      setPanels(prev => prev.map(p => 
        p.id === panelId ? { ...p, connected: status, ws: websocket } : p
      ));
      if (activePanel && activePanel.id === panelId) {
        setActivePanel(prev => prev ? { ...prev, connected: status, ws: websocket } : prev);
      }
      isConnected = status;
      if (status) {
        reconnectAttempts = 0;
      }
    };

    const connect = async () => {
      // 确保清理任何现有的连接
      if (ws) {
        console.log('Cleaning up existing connection before reconnecting');
        ws.onclose = null; // 移除旧的onclose处理器，防止触发重连
        ws.close();
        ws = null;
        updateConnectionStatus(activePanel.id, false, null);
      }
      clearTimeout(reconnectTimeout);

      // 开始连接时设置为未连接状态
      updateConnectionStatus(activePanel.id, false, null);

      try {
        const wsUrl = `ws://${activePanel.ip}:${activePanel.port}`;
        console.log(`Connecting to ${activePanel.name}:`, wsUrl);

        if (activePanel.softwareType === 'OBS') {
          // OBS WebSocket 连接
          const obsWebSocket = new WebSocket(wsUrl);
          ws = obsWebSocket;
          
          obsWebSocket.onopen = () => {
            console.log(`${activePanel.name} WebSocket connection opened`);
            updateConnectionStatus(activePanel.id, false, obsWebSocket);
          };

          obsWebSocket.onmessage = (event) => {
            try {
              const response = JSON.parse(event.data);
              console.log(`${activePanel.name} Response:`, response);

              if (response.op === 0) {
                console.log(`${activePanel.name}: Received Hello message, sending Identify request`);
                const identifyRequest = {
                  "op": 1,
                  "d": {
                    "rpcVersion": response.d.rpcVersion,
                    "eventSubscriptions": 33
                  }
                };
                obsWebSocket.send(JSON.stringify(identifyRequest));
              } else if (response.op === 2) {
                console.log(`${activePanel.name}: Successfully authenticated`);
                updateConnectionStatus(activePanel.id, true, obsWebSocket);
              } else if (response.error) {
                console.error(`${activePanel.name} WebSocket error:`, response.error);
                updateConnectionStatus(activePanel.id, false, null);
              }
            } catch (error) {
              console.error(`${activePanel.name} Error parsing message:`, error);
            }
          };
        } else {
          // vMix WebSocket 连接
          const vmixWebSocket = new WebSocket(wsUrl);
          ws = vmixWebSocket;
          
          vmixWebSocket.onopen = () => {
            console.log(`${activePanel.name} connection opened`);
            updateConnectionStatus(activePanel.id, true, vmixWebSocket);
          };
        }

        // 通用的错误和关闭处理
        ws.onerror = (error) => {
          console.error(`${activePanel.name} WebSocket error:`, error);
          updateConnectionStatus(activePanel.id, false, null);
        };

        ws.onclose = (event) => {
          console.log(`${activePanel.name} WebSocket closed:`, event);
          updateConnectionStatus(activePanel.id, false, null);

          // 如果开启了自动重连且重试次数未超过限制，则尝试重新连接
          if (activePanel.autoReconnect && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            console.log(`${activePanel.name}: Attempting to reconnect... (${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})`);
            reconnectAttempts++;
            reconnectTimeout = setTimeout(connect, 3000);
          }
        };

      } catch (error) {
        console.error(`${activePanel.name} Connection error:`, error);
        updateConnectionStatus(activePanel.id, false, null);
      }
    };

    // 立即尝试连接
    connect();

    // 清理函数
    return () => {
      if (ws) {
        console.log(`Cleaning up ${activePanel.name} WebSocket connection`);
        ws.onclose = null; // 移除onclose处理器，防止触发重连
        ws.close();
        ws = null;
        updateConnectionStatus(activePanel.id, false, null);
      }
      clearTimeout(reconnectTimeout);
    };
  }, [activePanel?.id, activePanel?.ip, activePanel?.port, activePanel?.autoReconnect, activePanel?.softwareType]);

  const handleUpdatePanel = (updatedPanel: Panel) => {
    setPanels(prev => prev.map(p => p.id === updatedPanel.id ? updatedPanel : p));
    setActivePanel(updatedPanel);
  };

  const handleOpenSettings = (panel: Panel) => {
    setEditingPanel({ ...panel });
    setShowSettings(true);
  };

  const handleSaveSettings = () => {
    if (editingPanel) {
      // 先断开当前连接
      setPanels(prev => prev.map(p => 
        p.id === editingPanel.id ? { ...editingPanel, connected: false } : p
      ));
      
      // 更新面板信息
      handleUpdatePanel(editingPanel);
      setShowSettings(false);
    }
  };

  // 分离OBS和VMIX面板
  const obsPanels = panels.filter(p => p.softwareType === 'OBS');
  const vmixPanels = panels.filter(p => p.softwareType === 'VMIX');

  return (
    <div className="min-h-screen bg-black">
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      
      {/* 顶部导航栏 */}
      <nav className="fixed top-0 left-0 right-0 bg-slate-900/90 backdrop-blur z-50 border-b border-slate-800">
        <div className="flex items-center justify-between h-14 px-4">
          {/* OBS面板（左侧） */}
          <div className="flex space-x-1">
            {obsPanels.map(panel => (
              <button
                key={panel.id}
                onClick={() => setActivePanel(panel)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
                  ${activePanel?.id === panel.id 
                    ? 'bg-amber-500 text-black' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                {panel.name}
              </button>
            ))}
          </div>
          
          {/* VMIX面板（右侧） */}
          <div className="flex space-x-1">
            {vmixPanels.map(panel => (
              <button
                key={panel.id}
                onClick={() => setActivePanel(panel)}
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors
                  ${activePanel?.id === panel.id 
                    ? 'bg-amber-500 text-black' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
              >
                {panel.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="pt-16 container mx-auto relative z-10">
        {activePanel && (
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-amber-500">
                  IP地址: <span className="text-white">{!isClient ? '加载中...' : (activePanel.ip || '未设置')}</span>
                </div>
                <div className="text-amber-500">
                  端口: <span className="text-white">{!isClient ? '加载中...' : activePanel.port}</span>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => handleOpenSettings(activePanel)}
                className="bg-slate-800 hover:bg-slate-700"
              >
                <Settings className="w-4 h-4 mr-2" />
                设置
              </Button>
            </div>
            {isClient && (
              <ControlPanel 
                panel={activePanel} 
                onPanelUpdate={(updatedPanel) => {
                  setPanels(prev => prev.map(p => 
                    p.id === updatedPanel.id ? updatedPanel : p
                  ));
                  setActivePanel(updatedPanel);
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* 设置对话框 */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-amber-500">面板设置</DialogTitle>
            <DialogDescription className="text-slate-400">
              修改面板的配置信息
            </DialogDescription>
          </DialogHeader>
          
          {editingPanel && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">面板名称</label>
                <Input
                  value={editingPanel.name}
                  disabled
                  className="bg-slate-800 border-slate-700 opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">软件类型</label>
                <Input
                  value={editingPanel.softwareType}
                  disabled
                  className="bg-slate-800 border-slate-700 opacity-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">IP地址</label>
                <Input
                  value={editingPanel.ip}
                  onChange={(e) => setEditingPanel({...editingPanel, ip: e.target.value})}
                  placeholder="输入IP地址"
                  className="bg-slate-800 border-slate-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">WebSocket端口</label>
                <Input
                  value={editingPanel.port}
                  disabled
                  className="bg-slate-800 border-slate-700 opacity-50"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-200">自动重连</label>
                <Switch
                  checked={editingPanel.autoReconnect}
                  onCheckedChange={(checked) => {
                    setEditingPanel({ ...editingPanel, autoReconnect: checked });
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowSettings(false)}
              className="text-slate-400 border-slate-700 hover:bg-slate-800"
            >
              取消
            </Button>
            <Button
              onClick={handleSaveSettings}
              className="bg-amber-500 hover:bg-amber-600 text-black"
              disabled={!editingPanel?.ip}
            >
              保存
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

