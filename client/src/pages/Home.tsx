import { useState, useEffect } from 'react';
import { AlertTriangle, Lock, Zap, Shield, Server, AlertCircle } from 'lucide-react';
import SimulationPanel from '@/components/SimulationPanel';
import SystemLog from '@/components/SystemLog';
import AttackSamples from '@/components/AttackSamples';
import Header from '@/components/Header';

export type SimulationMode = 'simulacro' | 'protegido';
export type AttackType = 'credentials' | 'sql' | 'backups';
export type SimulationPhase = 'idle' | 'login' | 'loading' | 'result' | '2fa';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

export default function Home() {
  const [mode, setMode] = useState<SimulationMode>('simulacro');
  const [currentAttack, setCurrentAttack] = useState<AttackType | null>(null);
  const [phase, setPhase] = useState<SimulationPhase>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: '23:45:12',
      level: 'info',
      message: '[INIT] Sistema de auditoría iniciado',
    },
    {
      timestamp: '23:45:13',
      level: 'success',
      message: '[ONLINE] Todos los servicios operacionales',
    },
  ]);
  type ServiceStatus = 'online' | 'exposed' | 'critical';
  
  const [simulationData, setSimulationData] = useState<{
    devices: number;
    incidents: number;
    alarms: number;
    services: Array<{ name: string; status: ServiceStatus }>;
  }>({
    devices: 12,
    incidents: 0,
    alarms: 0,
    services: [
      { name: 'Base de Datos', status: 'online' },
      { name: 'Web App', status: 'online' },
      { name: 'Servidor NAS', status: 'online' },
      { name: 'Firewall', status: 'online' },
      { name: 'WAF', status: 'online' },
    ],
  });

  const addLog = (message: string, level: 'info' | 'warning' | 'error' | 'success' = 'info') => {
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    setLogs((prev) => [...prev, { timestamp, level, message }].slice(-50));
  };

  const executeAttack = async (attackType: AttackType) => {
    setCurrentAttack(attackType);
    setPhase('login');
    addLog(`[ATTACK] Iniciando simulación: ${attackType}`, 'warning');

    // Simulate attack progression
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (attackType === 'credentials') {
      setPhase('loading');
      addLog('[CREDENTIALS] Intentando acceso con datos robados...', 'warning');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (mode === 'simulacro') {
        addLog('[SUCCESS] Acceso concedido - Credenciales válidas', 'error');
        setPhase('result');
        setSimulationData((prev) => ({
          ...prev,
          incidents: prev.incidents + 1,
          alarms: prev.alarms + 1,
          services: prev.services.map((s) =>
            s.name === 'Web App' ? { ...s, status: 'exposed' } : s
          ),
        }));
      } else {
        addLog('[2FA] Segundo factor requerido', 'info');
        setPhase('2fa');
      }
    } else if (attackType === 'sql') {
      setPhase('loading');
      addLog('[SQL] Inyectando payload SQL...', 'warning');
      await new Promise((resolve) => setTimeout(resolve, 2500));

      if (mode === 'simulacro') {
        addLog('[SUCCESS] SQL Injection exitosa - Datos extraídos', 'error');
        setPhase('result');
        setSimulationData((prev) => ({
          ...prev,
          incidents: prev.incidents + 1,
          alarms: prev.alarms + 1,
          services: prev.services.map((s) =>
            s.name === 'Base de Datos' ? { ...s, status: 'exposed' } : s
          ),
        }));
      } else {
        addLog('[WAF] Web Application Firewall bloqueó la inyección', 'success');
        setPhase('result');
      }
    } else if (attackType === 'backups') {
      setPhase('loading');
      addLog('[RANSOMWARE] Accediendo al servidor NAS...', 'warning');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (mode === 'simulacro') {
        addLog('[CRITICAL] Ejecutando comando de borrado: rm -rf /backups/*', 'error');
        setPhase('result');
        setSimulationData((prev) => ({
          ...prev,
          incidents: prev.incidents + 1,
          alarms: prev.alarms + 2,
          services: prev.services.map((s) =>
            s.name === 'Servidor NAS' ? { ...s, status: 'critical' } : s
          ),
        }));
      } else {
        addLog('[FIREWALL] Políticas de firewall impidieron acceso no autorizado', 'success');
        setPhase('result');
      }
    }
  };

  const resetSimulation = () => {
    setCurrentAttack(null);
    setPhase('idle');
    setSimulationData((prev) => ({
      ...prev,
      services: prev.services.map((s) => ({ ...s, status: 'online' })),
    }));
    addLog('[RESET] Simulación finalizada - Sistema reiniciado', 'info');
  };

  const toggleMode = () => {
    const newMode = mode === 'simulacro' ? 'protegido' : 'simulacro';
    setMode(newMode);
    resetSimulation();
    addLog(`[MODE] Cambiado a modo ${newMode}`, 'info');
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Header mode={mode} onToggleMode={toggleMode} />

      <div className="flex h-[calc(100vh-80px)] gap-2 p-2">
        {/* Left Panel - Attack Samples */}
        <div className="w-1/4 overflow-y-auto border border-cyan-500/30 rounded-sm p-4 glow-cyan">
          <h2 className="text-lg font-bold mb-4 text-cyan-400 tracking-wider">
            MUESTRAS DE ATAQUE
          </h2>
          <AttackSamples
            onExecute={executeAttack}
            disabled={phase !== 'idle'}
            mode={mode}
          />
        </div>

        {/* Center Panel - Simulation Area */}
        <div className="flex-1 border border-magenta-500/30 rounded-sm p-6 glow-magenta flex flex-col">
          <SimulationPanel
            phase={phase}
            attackType={currentAttack}
            mode={mode}
            onReset={resetSimulation}
            onValidate2FA={() => {
              if (mode === 'protegido') {
                addLog('[2FA] Token validado correctamente', 'success');
              } else {
                addLog('[2FA] Acceso denegado - Token inválido', 'error');
              }
              setPhase('result');
            }}
          />
        </div>

        {/* Right Panel - System Log */}
        <div className="w-1/4 border border-green-500/30 rounded-sm p-4 glow-green flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-3 text-green-400 tracking-wider">
              ESTADO DEL SISTEMA
            </h2>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-card p-2 rounded-sm border border-cyan-500/50">
                <div className="text-xs text-muted-foreground">DISPOSITIVOS</div>
                <div className="text-xl font-bold text-cyan-400">{simulationData.devices}</div>
              </div>
              <div className="bg-card p-2 rounded-sm border border-yellow-500/50">
                <div className="text-xs text-muted-foreground">INCIDENTES</div>
                <div className="text-xl font-bold text-yellow-400">
                  {simulationData.incidents}
                </div>
              </div>
              <div className="bg-card p-2 rounded-sm border border-red-500/50">
                <div className="text-xs text-muted-foreground">ALARMAS</div>
                <div className="text-xl font-bold text-red-500">{simulationData.alarms}</div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-xs font-bold text-cyan-300 mb-2 tracking-widest">
                SERVICIOS
              </h3>
              <div className="space-y-1">
                {simulationData.services.map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between text-xs p-1 rounded-sm bg-card/50 border border-border/50"
                  >
                    <span>{service.name}</span>
                    <span
                      className={`font-bold ${
                        service.status === 'online'
                          ? 'text-green-400'
                          : service.status === 'exposed'
                            ? 'text-yellow-400'
                            : 'text-red-500'
                      }`}
                    >
                      {service.status === 'online'
                        ? '●'
                        : service.status === 'exposed'
                          ? '◐'
                          : '◯'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SystemLog logs={logs} />
        </div>
      </div>
    </div>
  );
}
