import { Shield, Zap } from 'lucide-react';
import type { SimulationMode } from '@/pages/Home';

interface HeaderProps {
  mode: SimulationMode;
  onToggleMode: () => void;
}

export default function Header({ mode, onToggleMode }: HeaderProps) {
  return (
    <header className="h-20 border-b border-cyan-500/30 bg-card/50 flex items-center justify-between px-6 glow-cyan">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-magenta-500 rounded-sm flex items-center justify-center">
          <Shield className="w-6 h-6 text-background font-bold" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-cyan-400 tracking-wider">PAMI</h1>
          <p className="text-xs text-muted-foreground tracking-widest">SIMULADOR DE SEGURIDAD</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-xs text-muted-foreground tracking-widest mb-1">MODO ACTUAL</p>
          <p
            className={`text-lg font-bold tracking-wider ${
              mode === 'antes' ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {mode === 'antes' ? 'ANTES' : 'DESPUÉS'}
          </p>
        </div>

        <button
          onClick={onToggleMode}
          className={`relative w-16 h-8 rounded-sm border-2 transition-all duration-300 ${
            mode === 'antes'
              ? 'border-red-400 bg-red-400/10'
              : 'border-green-400 bg-green-400/10'
          } hover:shadow-lg`}
        >
          <div
            className={`absolute top-1 w-6 h-6 rounded-sm bg-gradient-to-br transition-all duration-300 ${
              mode === 'antes'
                ? 'left-1 from-red-400 to-red-600'
                : 'right-1 from-green-400 to-green-600'
            }`}
          />
        </button>

        <div className="text-right">
          <p className="text-xs text-muted-foreground tracking-widest mb-1">ESTADO</p>
          <p className="text-lg font-bold text-green-400 tracking-wider">● ACTIVO</p>
        </div>
      </div>
    </header>
  );
}
