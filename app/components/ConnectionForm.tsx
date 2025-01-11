import { useState } from 'react';

interface ConnectionFormProps {
  onConnect: (name: string, type: 'OBS' | 'VMIX', ip: string, port: string) => void
}

export default function ConnectionForm({ onConnect }: ConnectionFormProps) {
  const [softwareType, setSoftwareType] = useState<'OBS' | 'VMIX'>('OBS');
  const [port, setPort] = useState('4455');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onConnect(
      formData.get('name') as string,
      formData.get('type') as 'OBS' | 'VMIX',
      formData.get('ip') as string,
      formData.get('port') as string
    );
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-amber-400">Connect to Stream Software</h1>
        <p className="mt-2 text-sm text-gray-400">
          Add a new OBS or vMix control panel to manage your stream
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-amber-400">
            Panel Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-amber-100 placeholder:text-gray-500 focus:border-amber-400 focus:outline-none transition-colors duration-200"
            placeholder="Enter panel name"
          />
        </div>
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-amber-400">
            Software Type
          </label>
          <select
            name="type"
            id="type"
            value={softwareType}
            onChange={(e) => {
              setSoftwareType(e.target.value as 'OBS' | 'VMIX');
              setPort(e.target.value === 'OBS' ? '4455' : '8088');
            }}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-amber-100 focus:border-amber-400 focus:outline-none transition-colors duration-200"
          >
            <option value="OBS">OBS</option>
            <option value="VMIX">vMix</option>
          </select>
        </div>
        <div>
          <label htmlFor="ip" className="block text-sm font-medium text-amber-400">
            IP Address
          </label>
          <input
            type="text"
            name="ip"
            id="ip"
            required
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-amber-100 placeholder:text-gray-500 focus:border-amber-400 focus:outline-none transition-colors duration-200"
            placeholder="Enter IP address"
          />
        </div>
        <div>
          <label htmlFor="port" className="block text-sm font-medium text-amber-400">
            WebSocket Port
          </label>
          <input
            type="text"
            name="port"
            id="port"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-amber-100 placeholder:text-gray-500 focus:border-amber-400 focus:outline-none transition-colors duration-200"
            placeholder={`Enter WebSocket port (default: ${softwareType === 'OBS' ? '4455' : '8088'})`}
          />
        </div>
        <button
          type="submit"
          className="mt-6 w-full rounded-md bg-amber-400 px-4 py-2 text-sm font-medium text-black hover:bg-amber-300 transition-colors duration-200"
        >
          Connect
        </button>
      </form>
    </div>
  );
}

