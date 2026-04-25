import { useState, useEffect } from 'react';
import { AlertTriangle, Lock, Zap, Shield, Server, AlertCircle } from 'lucide-react';
import SimulationPanel from '@/components/SimulationPanel';
import SystemLog from '@/components/SystemLog';
import AttackSamples from '@/components/AttackSamples';
import Header from '@/components/Header';

export type SimulationMode = 'antes' | 'despues';
export type AttackType = 'credentials' | 'sql' | 'backups';
export type SimulationPhase = 'idle' | 'login' | 'loading' | 'result' | '2fa';

interface LogEntry {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

export default function Home() {
  const [mode, setMode] = useState<SimulationMode>('antes');
  const [currentAttack, setCurrentAttack] = useState<AttackType | null>(null);
  const [phase, setPhase] = useState<SimulationPhase>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: '14:23:45',
      level: 'info',
      message: '[INIT] Sistema de auditoría iniciado',
    },
    {
      timestamp: '14:23:47',
      level: 'warning',
      message: '[WARNING] NTP no sincronizado - Reloj del sistema desincronizado',
    },
  ]);
  
  type ServiceStatus = 'online' | 'exposed' | 'critical';
  
  const [simulationData, setSimulationData] = useState<{
    devices: number;
    compromised: number;
    inProgress: number;
    alarms: number;
    services: Array<{ name: string; status: ServiceStatus }>;
  }>({
    devices: 12,
    compromised: 0,
    inProgress: 0,
    alarms: 0,
    services: [
      { name: 'Base de Datos', status: 'online' },
      { name: 'Web App', status: 'online' },
      { name: 'Servidor NAS', status: 'online' },
      { name: 'Firewall', status: 'online' },
      { name: 'WAF', status: 'online' },
    ],
  });

  const [controls, setControls] = useState({
    mfa: mode === 'despues',
    waf: mode === 'despues',
    tde: mode === 'despues',
    worm: mode === 'despues',
    vlan: mode === 'despues',
    ntp: mode === 'despues',
    soc: mode === 'despues',
  });

  useEffect(() => {
    setControls({
      mfa: mode === 'despues',
      waf: mode === 'despues',
      tde: mode === 'despues',
      worm: mode === 'despues',
      vlan: mode === 'despues',
      ntp: mode === 'despues',
      soc: mode === 'despues',
    });
  }, [mode]);

  const addLog = (message: string, level: 'info' | 'warning' | 'error' | 'success' = 'info') => {
    let timestamp: string;
    
    if (controls.ntp) {
      // DESPUÉS: NTP sincronizado - ISO 8601
      const now = new Date();
      timestamp = now.toISOString().split('T')[1].split('.')[0];
    } else {
      // ANTES: Sin NTP - timestamps desincronizados
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      const seconds = Math.floor(Math.random() * 60);
      timestamp = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    setLogs((prev) => [...prev, { timestamp, level, message }].slice(-50));
  };

  const executeAttack = async (attackType: AttackType) => {
    setCurrentAttack(attackType);
    setPhase('login');
    setSimulationData((prev) => ({ ...prev, inProgress: 1 }));
    addLog(`[ATTACK] Iniciando simulación: ${attackType}`, 'warning');

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (attackType === 'credentials') {
      setPhase('loading');
      addLog('[CREDENTIALS] Intentando acceso con credenciales básicas (admin/admin123)...', 'warning');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (mode === 'antes') {
        addLog('[SUCCESS] Acceso concedido - Credenciales válidas', 'error');
        addLog('[LATERAL] Movimiento lateral exitoso - Sin segmentación de red', 'error');
        addLog('[EXPOSED] Acceso a: afiliados, recetas_medicas, turnos_medicos, historias_clinicas, empleados_sueldos', 'error');
        setPhase('result');
        setSimulationData((prev) => ({
          ...prev,
          compromised: Math.min(prev.compromised + 1, 3),
          inProgress: 0,
          alarms: 0,
          services: prev.services.map((s) =>
            s.name === 'Web App' ? { ...s, status: 'exposed' } : s
          ),
        }));
      } else {
        addLog('[2FA] Segundo factor requerido - MFA activado', 'info');
        setPhase('2fa');
      }
    } else if (attackType === 'sql') {
      setPhase('loading');
      if (controls.waf) {
        addLog('[SQL] Inyectando payload SQL...', 'warning');
        addLog('[WAF] Web Application Firewall activo - Analizando payload', 'info');
      } else {
        addLog('[SQL] Inyectando payload SQL - SIN WAF - Payload enviado directo al backend', 'error');
      }
      await new Promise((resolve) => setTimeout(resolve, 2500));

      if (mode === 'antes') {
        addLog('[SUCCESS] SQL INJECTION EXITOSA - SIN WAF', 'error');
        addLog('[CRITICAL] TODA LA BASE DE AFILIADOS EXPUESTA EN TEXTO PLANO', 'error');
        addLog('[EXPOSED] DNI: 12345678 | Nombre: Juan Pérez | Enfermedad: Diabetes Mellitus Tipo 2', 'error');
        addLog('[EXPOSED] DNI: 87654321 | Nombre: María García | Enfermedad: Hipertensión Arterial', 'error');
        addLog('[VIOLATION] VIOLACIÓN LEY 25.326 - DATOS SENSIBLES DE SALUD EXPUESTOS SIN CIFRAR', 'error');
        setPhase('result');
        setSimulationData((prev) => ({
          ...prev,
          compromised: Math.min(prev.compromised + 1, 3),
          inProgress: 0,
          alarms: 0,
          services: prev.services.map((s) =>
            s.name === 'Base de Datos' ? { ...s, status: 'exposed' } : s
          ),
        }));
      } else {
        addLog('[WAF] INYECCIÓN SQL BLOQUEADA - WAF interceptó la solicitud maliciosa', 'success');
        setPhase('result');
        setSimulationData((prev) => ({ ...prev, inProgress: 0 }));
      }
    } else if (attackType === 'backups') {
      setPhase('loading');
      addLog('[RANSOMWARE] Accediendo al servidor NAS...', 'warning');
      if (controls.vlan) {
        addLog('[VLAN] Segmentación de red activa - Acceso denegado', 'success');
      } else {
        addLog('[NETWORK] Sin segmentación - Conexión directa al NAS - Connecting to 10.0.50.10:22..', 'error');
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (mode === 'antes') {
        addLog('[CRITICAL] Ejecutando comando de borrado: rm -rf /backups/*', 'error');
        if (!controls.worm) {
          addLog('[CRITICAL] SIN WORM - SIN REGLA 3-2-1 - BORRADO COMPLETO EXITOSO', 'error');
          addLog('[DISASTER] Backups eliminados - Recuperación imposible', 'error');
        }
        setPhase('result');
        setSimulationData((prev) => ({
          ...prev,
          compromised: Math.min(prev.compromised + 1, 3),
          inProgress: 0,
          alarms: 0,
          services: prev.services.map((s) =>
            s.name === 'Servidor NAS' ? { ...s, status: 'critical' } : s
          ),
        }));
      } else {
        addLog('[FIREWALL] Políticas de firewall impidieron acceso no autorizado', 'success');
        addLog('[WORM] Backups protegidos con WORM - Regla 3-2-1 implementada', 'success');
        setPhase('result');
        setSimulationData((prev) => ({ ...prev, inProgress: 0 }));
      }
    }
  };

  const resetSimulation = () => {
    setCurrentAttack(null);
    setPhase('idle');
    setSimulationData((prev) => ({
      ...prev,
      inProgress: 0,
      services: prev.services.map((s) => ({ ...s, status: 'online' })),
    }));
    addLog('[RESET] Simulación finalizada - Sistema reiniciado', 'info');
  };

  const toggleMode = () => {
    const newMode = mode === 'antes' ? 'despues' : 'antes';
    setMode(newMode);
    resetSimulation();
    setSimulationData((prev) => ({
      ...prev,
      compromised: 0,
      inProgress: 0,
      alarms: 0,
      services: prev.services.map((s) => ({ ...s, status: 'online' })),
    }));
    addLog(`[MODE] Cambiado a modo ${newMode.toUpperCase()}`, 'info');
  };

  const controlsList = [
    { key: 'mfa', label: 'MFA', description: 'Autenticación Multifactor' },
    { key: 'waf', label: 'WAF', description: 'Web App Firewall' },
    { key: 'tde', label: 'Cifrado TDE', description: 'Cifrado de Datos' },
    { key: 'worm', label: 'WORM Backup', description: 'Backups Inmutables' },
    { key: 'vlan', label: 'Segmentación VLAN', description: 'Segmentación de Red' },
    { key: 'ntp', label: 'NTP', description: 'Sincronización Horaria' },
    { key: 'soc', label: 'SOC 24/7', description: 'Monitoreo 24/7' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <Header mode={mode} onToggleMode={toggleMode} />

      <div className="flex h-[calc(100vh-80px)] gap-2 p-2">
        {/* Left Panel - Attack Samples */}
        <div className="w-1/4 overflow-y-auto border border-cyan-500/30 rounded-sm p-4 glow-cyan flex flex-col">
          <h2 className="text-lg font-bold mb-4 text-cyan-400 tracking-wider">
            MUESTRAS DE ATAQUE
          </h2>
          <div className="flex-1">
            <AttackSamples
              onExecute={executeAttack}
              disabled={phase !== 'idle'}
              mode={mode}
            />
          </div>
        </div>

        {/* Center Panel - Simulation Area */}
        <div className="flex-1 border border-magenta-500/30 rounded-sm p-6 glow-magenta flex flex-col">
          <SimulationPanel
            phase={phase}
            attackType={currentAttack}
            mode={mode}
            onReset={resetSimulation}
            onValidate2FA={() => {
              if (mode === 'despues') {
                addLog('[2FA] Token validado correctamente', 'success');
              } else {
                addLog('[2FA] Acceso denegado - Token inválido', 'error');
              }
              setPhase('result');
              setSimulationData((prev) => ({ ...prev, inProgress: 0 }));
            }}
          />
        </div>

        {/* Right Panel - System Log */}
        <div className="w-1/4 border border-red-500/30 rounded-sm p-4 glow-red flex flex-col overflow-y-auto">
          {/* Header */}
          <h2 className="text-lg font-bold mb-4 text-red-400 tracking-wider">
            LOGS DEL SISTEMA (SIN SIEM)
          </h2>

          {/* Counters Grid */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-card p-3 rounded-sm border border-red-500/50">
              <div className="text-red-500 text-2xl font-bold text-center mb-1">
                {simulationData.compromised}/3
              </div>
              <div className="text-xs text-muted-foreground text-center tracking-widest">
                COMPROMETIDOS
              </div>
            </div>
            <div className="bg-card p-3 rounded-sm border border-yellow-500/50">
              <div className="text-yellow-400 text-2xl font-bold text-center mb-1">
                {simulationData.inProgress}
              </div>
              <div className="text-xs text-muted-foreground text-center tracking-widest">
                EN CURSO
              </div>
            </div>
            <div className="bg-card p-3 rounded-sm border border-cyan-500/50">
              <div className="text-cyan-400 text-2xl font-bold text-center mb-1">
                {simulationData.alarms}
              </div>
              <div className="text-xs text-muted-foreground text-center tracking-widest">
                SIN ALERTAS
              </div>
            </div>
          </div>

          {/* Controls Table */}
          <div className="mb-4 border border-cyan-500/30 rounded-sm overflow-hidden">
            <div className="grid grid-cols-2 gap-0 bg-card/50 border-b border-cyan-500/30">
              <div className="text-xs font-bold text-cyan-400 p-2 tracking-widest">CONTROL</div>
              <div className="text-xs font-bold text-cyan-400 p-2 tracking-widest text-right">ESTADO</div>
            </div>
            <div className="divide-y divide-cyan-500/20">
              {controlsList.map((control) => (
                <div key={control.key} className="grid grid-cols-2 gap-0 p-2 text-xs hover:bg-card/50">
                  <div className="text-muted-foreground">{control.label}</div>
                  <div className="text-right">
                    {mode === 'antes' ? (
                      <span className="text-red-500 font-bold">● AUSENTE</span>
                    ) : (
                      <span className="text-green-400 font-bold">✓ ACTIVO</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NTP Warning */}
          {mode === 'antes' && (
            <div className="mb-4 p-3 rounded-sm border border-yellow-500/50 bg-yellow-500/10">
              <div className="flex gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-600">
                  Sin NTP: los timestamp de cada servidor tienen horarios distintos. Imposible correlacionar eventos.
                </p>
              </div>
            </div>
          )}

          {/* Logs */}
          <div className="flex-1 flex flex-col min-h-0">
            <h3 className="text-xs font-bold text-cyan-300 mb-2 tracking-widest">
              LOGS DISPERSOS (SIN SIEM) - {logs.length} eventos
            </h3>
            <SystemLog logs={logs} />
          </div>
        </div>
      </div>
    </div>
  );
}
