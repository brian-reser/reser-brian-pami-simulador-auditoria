import type { SimulationMode } from '@/pages/Home';

interface ControlsPanelProps {
  controls: {
    mfa: boolean;
    waf: boolean;
    tde: boolean;
    worm: boolean;
    vlan: boolean;
    ntp: boolean;
    soc: boolean;
  };
  mode: SimulationMode;
}

export default function ControlsPanel({ controls, mode }: ControlsPanelProps) {
  const controlsList = [
    { key: 'mfa', label: 'MFA', description: 'Autenticación Multifactor' },
    { key: 'waf', label: 'WAF', description: 'Web App Firewall' },
    { key: 'tde', label: 'TDE', description: 'Cifrado de Datos' },
    { key: 'worm', label: 'WORM', description: 'Backups Inmutables' },
    { key: 'vlan', label: 'VLAN', description: 'Segmentación de Red' },
    { key: 'ntp', label: 'NTP', description: 'Sincronización Horaria' },
    { key: 'soc', label: 'SOC', description: 'Monitoreo 24/7' },
  ];

  return (
    <div>
      <h3 className="text-xs font-bold text-cyan-300 mb-2 tracking-widest">
        CONTROLES DE SEGURIDAD
      </h3>
      <div className="space-y-1">
        {controlsList.map((control) => {
          const isActive = controls[control.key as keyof typeof controls];
          return (
            <div
              key={control.key}
              className={`flex items-center gap-2 text-xs p-1 rounded-sm border ${
                isActive
                  ? 'bg-green-500/10 border-green-500/50 text-green-400'
                  : 'bg-red-500/10 border-red-500/50 text-red-400'
              }`}
            >
              <span className="font-bold w-8">{control.label}</span>
              <span className="text-xs opacity-75">{control.description}</span>
              <span className="ml-auto text-lg">
                {isActive ? '✓' : '✗'}
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-3 p-2 rounded-sm bg-yellow-500/5 border border-yellow-500/30 text-xs">
        <p className="text-yellow-400 font-bold mb-1">FASE: {mode === 'antes' ? 'PRE-REMEDIACIÓN' : 'POST-REMEDIACIÓN (6 MESES)'}</p>
        <p className="text-muted-foreground text-xs">
          {mode === 'antes'
            ? 'Todos los controles desactivados - Sistema vulnerable'
            : 'Controles implementados según hallazgos de auditoría'}
        </p>
      </div>
    </div>
  );
}
