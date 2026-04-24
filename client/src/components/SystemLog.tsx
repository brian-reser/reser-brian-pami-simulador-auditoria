import { useEffect, useRef } from 'react';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

interface SystemLogProps {
  logs: LogEntry[];
}

export default function SystemLog({ logs }: SystemLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-cyan-400';
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <h3 className="text-xs font-bold text-green-300 mb-2 tracking-widest">LOG DE EVENTOS</h3>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-1 text-xs font-mono bg-background/50 border border-green-500/30 rounded-sm p-2"
      >
        {logs.length === 0 ? (
          <p className="text-muted-foreground">Esperando eventos...</p>
        ) : (
          logs.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-muted-foreground flex-shrink-0">[{log.timestamp}]</span>
              <span className={`flex-1 ${getLevelColor(log.level)}`}>{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
