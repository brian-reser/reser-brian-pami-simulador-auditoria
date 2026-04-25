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
      timestamp: '11:02:30 a. m.',
      level: 'info',
      message: '[SYSTEM] Sistema iniciado. Sin SIEM configurado.',
    },
    {
      timestamp: '08:40:30 a. m.',
      level: 'warning',
      message: '[NTP] ADVERTENCIA: Servidores sin sincronización NTP. Timestamps inconsistentes.',
    },
    {
      timestamp: '01:05:30 p. m.',
      level: 'warning',
      message: '[SOC] SOC no configurado. Sin monitoreo 24/7.',
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
    
    if (mode === 'despues') {
      // DESPUÉS: Timestamps sincronizados (11:58-11:59 a.m. UTC-3)
      const baseTime = new Date('2026-04-25T11:58:42-03:00');
      const currentTime = new Date(baseTime.getTime() + Math.random() * 20000); // +0-20 segundos
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const seconds = currentTime.getSeconds();
      const period = hours >= 12 ? 'p. m.' : 'a. m.';
      const displayHours = hours > 12 ? hours - 12 : hours;
      timestamp = `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${period}`;
    } else {
      // ANTES: Sin NTP - timestamps desincronizados
      const hours = Math.floor(Math.random() * 24);
      const minutes = Math.floor(Math.random() * 60);
      const seconds = Math.floor(Math.random() * 60);
      const period = hours >= 12 ? 'p. m.' : 'a. m.';
      const displayHours = hours > 12 ? hours - 12 : hours;
      timestamp = `${String(displayHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${period}`;
    }
    
    setLogs((prev) => [...prev, { timestamp, level, message }].slice(-50));
  };

  const executeAttack = async (attackType: AttackType) => {
    // Si ya hay un muestreo en resultado, limpiar antes de ejecutar el siguiente
    if (phase === 'result') {
      setSimulationData((prev) => ({
        ...prev,
        services: prev.services.map((s) => ({ ...s, status: 'online' })),
      }));
    }
    
    setCurrentAttack(attackType);
    setPhase('login');
    setSimulationData((prev) => ({ ...prev, inProgress: 1 }));
    addLog(`[ATTACK] Iniciando simulación: ${attackType}`, 'warning');

    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (attackType === 'credentials') {
      setPhase('loading');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (mode === 'antes') {
        addLog('[SRV-WEB] Intento de login recibido desde IP 185.220.101.xx', 'warning');
        addLog('[AUTH] Verificando credenciales: admin / admin123...', 'warning');
        addLog('[AUTH] Credenciales genéricas ACEPTADAS - Sin segundo factor requerido', 'error');
        addLog('[SRV-WEB] Sesión activa. Usuario \'admin\' con acceso total al portal.', 'error');
        addLog('[SRV-DB] Navegación libre por base de datos de afiliados, recetas, turnos...', 'error');
        addLog('[SRV-APP] Movimiento lateral detectado: acceso a /api/sueldos desde sesión de portal', 'error');
        addLog('[SRV-DB] Acceso a tabla \'empleados_sueldos\' - Sin segmentación de red', 'error');
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
        addLog('[IDS] Intento de login detectado desde IP externa 185.220.101.xx (Tor Exit Node)', 'warning');
        addLog('[AUTH] Credenciales \'admin/admin123\' RECHAZADAS - Cuenta genérica deshabilitada', 'success');
        addLog('[AUTH] Sistema requiere usuario nominal: brian.reser@pami.org', 'info');
        addLog('[MFA] Solicitando segundo factor de autenticación (TOTP)...', 'warning');
        addLog('[MFA] SEGUNDO FACTOR NO PROPORCIONADO - Sesión rechazada', 'success');
        addLog('[SIEM] Alerta generada: Intento de acceso sin MFA. IP bloqueada automáticamente.', 'success');
        setPhase('result');
        setSimulationData((prev) => ({ ...prev, inProgress: 0 }));
      }
    } else if (attackType === 'sql') {
      setPhase('loading');
      await new Promise((resolve) => setTimeout(resolve, 2500));

      if (mode === 'antes') {
        addLog('[SRV-WEB] Consulta recibida en campo de búsqueda de afiliados', 'warning');
        addLog('[SRV-WEB] Sin WAF configurado - Payload pasa directo al backend', 'error');
        addLog('[SRV-DB] SQL ejecutado: SELECT * FROM afiliados WHERE dni=\'\'  OR 1=1 --\'', 'error');
        addLog('[SRV-DB] RESULTADO: 1.247.835 registros devueltos - TODA la base de afiliados expuesta', 'error');
        addLog('[SRV-DB] Datos en texto plano: DNI, nombre, dirección, historia clínica, medicación...', 'error');
        addLog('[LEGAL] Violación Ley 25.326 (Protección de Datos Personales) - Datos sensibles de salud expuestos', 'error');
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
        addLog('[WAF] Payload sospechoso detectado en campo de búsqueda: \' OR 1=1 --', 'warning');
        addLog('[WAF] Patrón de SQL Injection identificado - Regla OWASP CRS 942100', 'warning');
        addLog('[WAF] REQUEST BLOQUEADA - Web Application Firewall activo', 'success');
        addLog('[DB] Verificación: datos cifrados con TDE. Incluso con acceso, los datos serían ilegibles.', 'info');
        addLog('[SIEM] Incidente registrado. SoD verificada: usuario sin permisos de lectura directa a BD.', 'success');
        setPhase('result');
        setSimulationData((prev) => ({ ...prev, inProgress: 0 }));
      }
    } else if (attackType === 'backups') {
      setPhase('loading');
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (mode === 'antes') {
        addLog('[SRV-APP] Intento de conexión SSH a nas-backup-01.pami.internal', 'warning');
        addLog('[SRV-NAS] Conexión SSH aceptada - Sin regla de firewall entre segmentos', 'error');
        addLog('[SRV-NAS] Ejecutando: rm -rf /backups/afiliados/* /backups/recetas/*', 'error');
        addLog('[SRV-NAS] BACKUPS ELIMINADOS - Sin protección WORM. Sin regla 3-2-1.', 'error');
        addLog('[RANSOM] Rhysida despliega ransomware. Cifrado de 1.6TB de datos. Sin posibilidad de recuperación.', 'error');
        addLog('[SISTEMA] PAMI fuera de servicio. 5M afiliados sin acceso.', 'error');
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
        addLog('[IDS] Intento de conexión al servidor NAS desde segmento no autorizado', 'warning');
        addLog('[FIREWALL] Conexión RECHAZADA por regla de segmentación de red (VLAN aislada)', 'success');
        addLog('[STORAGE] Backups protegidos con WORM (Write Once Read Many) - Borrado imposible', 'info');
        addLog('[DRP] Regla 3-2-1 activa: 3 copias, 2 medios, 1 offsite. Integridad verificada.', 'success');
        addLog('[SIEM] Alerta crítica generada. Intento de ataque bloqueado y registrado con timestamp consistente.', 'success');
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
    
    // Limpiar logs y establecer logs iniciales según el modo
    if (newMode === 'despues') {
      setLogs([
        {
          timestamp: '11:58:42 a. m.',
          level: 'success',
          message: '[SYSTEM] SIEM inicializado. Monitoreo activo 24/7.',
        },
        {
          timestamp: '11:58:42 a. m.',
          level: 'success',
          message: '[NTP] Sincronización NTP verificada - Todos los servidores en hora (UTC-3).',
        },
        {
          timestamp: '11:58:42 a. m.',
          level: 'success',
          message: '[SOC] SOC 24/7 operativo. Analistas en línea. Auditoría continua activa.',
        },
      ]);
    } else {
      setLogs([
        {
          timestamp: '11:02:30 a. m.',
          level: 'info',
          message: '[SYSTEM] Sistema iniciado. Sin SIEM configurado.',
        },
        {
          timestamp: '08:40:30 a. m.',
          level: 'warning',
          message: '[NTP] ADVERTENCIA: Servidores sin sincronización NTP. Timestamps inconsistentes.',
        },
        {
          timestamp: '01:05:30 p. m.',
          level: 'warning',
          message: '[SOC] SOC no configurado. Sin monitoreo 24/7.',
        },
      ]);
    }
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
              disabled={phase === 'login' || phase === 'loading' || phase === '2fa'}
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
