import { AlertTriangle, Database, Lock } from 'lucide-react';
import type { AttackType, SimulationMode } from '@/pages/Home';

interface AttackSamplesProps {
  onExecute: (attackType: AttackType) => void;
  disabled: boolean;
  mode: SimulationMode;
}

const attacks = [
  {
    id: 'credentials',
    title: 'ROBO DE CREDENCIALES',
    description: 'Simula acceso con datos robados mediante phishing',
    icon: Lock,
  },
  {
    id: 'sql',
    title: 'INYECCIÓN SQL',
    description: 'Extrae datos mediante inyección SQL en formularios',
    icon: Database,
  },
  {
    id: 'backups',
    title: 'BORRADO DE BACKUPS',
    description: 'Ransomware que elimina copias de seguridad',
    icon: AlertTriangle,
  },
];

export default function AttackSamples({ onExecute, disabled, mode }: AttackSamplesProps) {
  return (
    <div className="space-y-3">
      {attacks.map((attack) => {
        const Icon = attack.icon;
        return (
          <div
            key={attack.id}
            className="border border-cyan-500/50 rounded-sm p-3 bg-card/50 hover:bg-card/80 transition-all duration-200"
          >
            <div className="flex items-start gap-2 mb-2">
              <Icon className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-1" />
              <h3 className="text-xs font-bold text-cyan-300 tracking-wider flex-1">
                {attack.title}
              </h3>
            </div>

            <p className="text-xs text-muted-foreground mb-3 leading-tight">
              {attack.description}
            </p>

            <button
              onClick={() => onExecute(attack.id as AttackType)}
              disabled={disabled}
              className={`w-full py-2 rounded-sm font-bold text-xs tracking-wider transition-all duration-200 ${
                disabled
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white glow-red'
              }`}
            >
              EJECUTAR MUESTRA
            </button>
          </div>
        );
      })}

      <div className="mt-4 p-3 border border-yellow-500/30 rounded-sm bg-yellow-500/5">
        <p className="text-xs text-yellow-400 font-bold mb-1 tracking-wider">
          MODO: {mode.toUpperCase()}
        </p>
        <p className="text-xs text-muted-foreground">
          {mode === 'simulacro'
            ? 'Los ataques serán exitosos. Observa las vulnerabilidades.'
            : 'Las defensas bloquearán los ataques. Observa la protección.'}
        </p>
      </div>
    </div>
  );
}
