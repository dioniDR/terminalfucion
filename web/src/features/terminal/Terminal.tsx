import React, { useEffect, useRef, useState } from 'react';
import ReconnectingWebSocket from 'reconnecting-websocket';

interface TerminalProps {
  wsUrl?: string;
}

const Terminal: React.FC<TerminalProps> = ({ wsUrl = 'ws://localhost:8000/ws' }) => {
  const [connected, setConnected] = useState(false);
  const [output, setOutput] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const wsRef = useRef<ReconnectingWebSocket | null>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    wsRef.current = new ReconnectingWebSocket(wsUrl);

    wsRef.current.onopen = () => {
      setConnected(true);
      setOutput(prev => [...prev, '> Connected to server']);
    };

    wsRef.current.onclose = () => {
      setConnected(false);
      setOutput(prev => [...prev, '> Disconnected from server']);
    };

    wsRef.current.onmessage = (event) => {
      if (event.data === '[CLEAR]') {
        setOutput([]);
      } else {
        setOutput(prev => [...prev, `< ${event.data}`]);
      }
    };

    return () => {
      wsRef.current?.close();
    };
  }, [wsUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Enviar comando como JSON
    const command = JSON.stringify({ command: input });
    wsRef.current?.send(command);
    setOutput(prev => [...prev, `> ${input}`]);
    setInput('');
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-black text-green-400 p-4 rounded-lg shadow-lg">
        <div
          ref={terminalRef}
          className="font-mono text-sm h-[400px] overflow-y-auto mb-4 whitespace-pre-wrap"
        >
          {output.map((line, i) => (
            <div key={i} className="py-1">
              {line}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-gray-900 text-green-400 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder={connected ? "Enter command..." : "Disconnected"}
            disabled={!connected}
          />
          <button
            type="submit"
            disabled={!connected}
            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Terminal;
