import React, { useState, useEffect } from 'react'
import { Play, Video } from 'lucide-react'

interface StreamControlsProps {
  softwareType: 'OBS' | 'VMIX'
  ws: WebSocket | null
}

export default function StreamControls({ softwareType, ws }: StreamControlsProps) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [streamTime, setStreamTime] = useState(0)
  const [recordTime, setRecordTime] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [streamButtonActive, setStreamButtonActive] = useState(false)
  const [recordButtonActive, setRecordButtonActive] = useState(false)

  // 发送 WebSocket 请求
  const sendRequest = (requestType: string) => {
    if (!ws || ws.readyState !== WebSocket.OPEN || !isAuthenticated) {
      console.log('WebSocket not ready:', {
        exists: !!ws,
        readyState: ws?.readyState,
        authenticated: isAuthenticated
      });
      return;
    }

    const messageId = Math.random().toString(36).slice(2);
    const request = {
      "op": 6,
      "d": {
        "requestType": requestType,
        "requestId": messageId,
        "requestData": {}
      }
    };

    console.log(`Sending ${requestType} request:`, request);
    ws.send(JSON.stringify(request));
  };

  // 处理推流控制
  const handleStreamToggle = () => {
    console.log('Stream toggle clicked, current state:', isStreaming);
    setStreamButtonActive(true); // 按钮点击后立即变红
    if (isStreaming) {
      sendRequest('StopStream');
    } else {
      sendRequest('StartStream');
    }
  };

  // 处理录制控制
  const handleRecordToggle = () => {
    console.log('Record toggle clicked, current state:', isRecording);
    setRecordButtonActive(true); // 按钮点击后立即变红
    if (isRecording) {
      sendRequest('StopRecord');
    } else {
      sendRequest('StartRecord');
    }
  };

  useEffect(() => {
    let streamInterval: NodeJS.Timeout
    let recordInterval: NodeJS.Timeout

    if (isStreaming) {
      streamInterval = setInterval(() => {
        setStreamTime((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      setStreamTime(0)
      setStreamButtonActive(false) // 停止推流时重置按钮状态
    }

    if (isRecording) {
      recordInterval = setInterval(() => {
        setRecordTime((prevTime) => prevTime + 1)
      }, 1000)
    } else {
      setRecordTime(0)
      setRecordButtonActive(false) // 停止录制时重置按钮状态
    }

    return () => {
      if (streamInterval) clearInterval(streamInterval)
      if (recordInterval) clearInterval(recordInterval)
    }
  }, [isStreaming, isRecording])

  // 监听 WebSocket 消息
  useEffect(() => {
    if (!ws) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const response = JSON.parse(event.data);
        console.log('Received WebSocket message:', response);
        
        // 处理认证成功消息
        if (response.op === 2) {
          console.log('Authentication successful');
          setIsAuthenticated(true);
          // 认证成功后获取初始状态
          sendRequest('GetStreamStatus');
          sendRequest('GetRecordStatus');
          return;
        }
        
        // 处理事件消息
        if (response.op === 5) {
          const { eventType, eventData } = response.d;
          console.log('Received event:', eventType, eventData);
          
          switch (eventType) {
            case 'StreamStateChanged':
              console.log('Stream state changed:', eventData.outputActive);
              setIsStreaming(eventData.outputActive);
              if (!eventData.outputActive) {
                setStreamButtonActive(false); // 收到停止推流事件时重置按钮状态
              }
              break;
            case 'RecordStateChanged':
              console.log('Record state changed:', eventData.outputActive);
              setIsRecording(eventData.outputActive);
              if (!eventData.outputActive) {
                setRecordButtonActive(false); // 收到停止录制事件时重置按钮状态
              }
              break;
          }
        }

        // 处理请求响应
        if (response.op === 7) {
          const { requestType, requestStatus } = response.d;
          console.log('Received response for', requestType, ':', requestStatus);

          if (requestStatus.result === true) {
            switch (requestType) {
              case 'StartStream':
                console.log('Stream started successfully');
                setIsStreaming(true);
                break;
              case 'StopStream':
                console.log('Stream stopped successfully');
                setIsStreaming(false);
                setStreamButtonActive(false); // 停止推流成功时重置按钮状态
                break;
              case 'StartRecord':
                console.log('Recording started successfully');
                setIsRecording(true);
                break;
              case 'StopRecord':
                console.log('Recording stopped successfully');
                setIsRecording(false);
                setRecordButtonActive(false); // 停止录制成功时重置按钮状态
                break;
              case 'GetStreamStatus':
                console.log('Got stream status:', response.d.responseData);
                if (response.d.responseData) {
                  setIsStreaming(response.d.responseData.outputActive || false);
                }
                break;
              case 'GetRecordStatus':
                console.log('Got record status:', response.d.responseData);
                if (response.d.responseData) {
                  setIsRecording(response.d.responseData.outputActive || false);
                }
                break;
            }
          } else {
            console.error('Request failed:', requestType, requestStatus.code, requestStatus.comment);
            // 请求失败时重置对应的按钮状态
            if (requestType === 'StartStream' || requestType === 'StopStream') {
              setStreamButtonActive(false);
            } else if (requestType === 'StartRecord' || requestType === 'StopRecord') {
              setRecordButtonActive(false);
            }
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error, event.data);
      }
    };

    ws.addEventListener('message', handleMessage);

    // WebSocket 断开时重置状态
    const handleClose = () => {
      console.log('WebSocket closed, resetting states');
      setIsAuthenticated(false);
      setIsStreaming(false);
      setIsRecording(false);
      setStreamTime(0);
      setRecordTime(0);
      setStreamButtonActive(false);
      setRecordButtonActive(false);
    };

    ws.addEventListener('close', handleClose);

    return () => {
      console.log('Cleaning up WebSocket listeners');
      ws.removeEventListener('message', handleMessage);
      ws.removeEventListener('close', handleClose);
    };
  }, [ws]);

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
          onClick={handleStreamToggle}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 ${
            streamButtonActive
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-amber-400 hover:bg-amber-500 text-black'
          } transition-colors duration-200`}
        >
          {isStreaming ? 'Stop Stream' : 'Start Stream'}
          <Play className="h-4 w-4" />
        </button>
        <button
          onClick={handleRecordToggle}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 ${
            recordButtonActive
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-gray-700 hover:bg-gray-600 text-white'
          } transition-colors duration-200`}
        >
          {isRecording ? 'Stop Recording' : 'Start Recording'}
          <Video className="h-4 w-4" />
        </button>
        {/* 只在实际推流和录制时显示时间 */}
        {(isStreaming || isRecording) && (
          <div className="space-y-2">
            {isStreaming && (
              <div>
                <div className="text-gray-400">Stream Time</div>
                <div className="text-xl font-mono font-bold text-amber-400">
                  {formatTime(streamTime)}
                </div>
              </div>
            )}
            {isRecording && (
              <div>
                <div className="text-gray-400">Record Time</div>
                <div className="text-xl font-mono font-bold text-amber-400">
                  {formatTime(recordTime)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <button
        onClick={handleStreamToggle}
        className={`w-full inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 ${
          streamButtonActive
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-amber-400 hover:bg-amber-500 text-black'
        } transition-colors duration-200`}
      >
        {isStreaming ? 'Stop Stream' : 'Start Stream'}
        <Play className="h-4 w-4" />
      </button>
      <button
        onClick={handleRecordToggle}
        className={`w-full inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 ${
          recordButtonActive
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-gray-700 hover:bg-gray-600 text-white'
        } transition-colors duration-200`}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
        <Video className="h-4 w-4" />
      </button>
      {/* 只在实际推流和录制时显示时间 */}
      {(isStreaming || isRecording) && (
        <div className="space-y-2">
          {isStreaming && (
            <div>
              <div className="text-gray-400">Stream Time</div>
              <div className="text-xl font-mono font-bold text-amber-400">
                {formatTime(streamTime)}
              </div>
            </div>
          )}
          {isRecording && (
            <div>
              <div className="text-gray-400">Record Time</div>
              <div className="text-xl font-mono font-bold text-amber-400">
                {formatTime(recordTime)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

