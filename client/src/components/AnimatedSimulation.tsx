import { useEffect, useState } from 'react';

interface AnimationFrame {
  title: string;
  subtitle: string;
  content: React.ReactNode;
  duration: number; // en segundos
}

interface AnimatedSimulationProps {
  attackType: 'credentials' | 'sql' | 'backups';
  mode: 'antes' | 'despues';
}

export default function AnimatedSimulation({ attackType, mode }: AnimatedSimulationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const frames: Record<string, AnimationFrame[]> = {
    credentials_despues: [
      {
        title: 'Ataque en Progreso',
        subtitle: 'Ingresando credenciales',
        content: (
          <div className="space-y-4 font-mono text-sm">
            <div>Usuario: <span className="text-cyan-400">admin</span></div>
            <div>Contraseña: <span className="text-cyan-400">••••••••</span></div>
          </div>
        ),
        duration: 6,
      },
      {
        title: 'Segundo Factor Requerido',
        subtitle: 'Credenciales genéricas rechazadas',
        content: (
          <div className="space-y-4 font-mono text-sm">
            <div className="text-yellow-400">Se requiere usuario nominal:</div>
            <div className="text-3xl font-bold text-green-400">brian.reser@pami.org</div>
            <div className="text-yellow-400 mt-4">Esperando token TOTP...</div>
          </div>
        ),
        duration: 15,
      },
      {
        title: 'ACCESO DENEGADO',
        subtitle: 'Segundo Factor No Proporcionado',
        content: (
          <div className="space-y-4 font-mono text-xs">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-red-500">
                  <td className="p-2 text-red-400">Credenciales genéricas:</td>
                  <td className="p-2 text-red-500 font-bold">DESHABILITADAS</td>
                </tr>
                <tr className="border-b border-red-500">
                  <td className="p-2 text-red-400">Usuario requerido:</td>
                  <td className="p-2 text-cyan-400">brian.reser@pami.org</td>
                </tr>
                <tr className="border-b border-red-500">
                  <td className="p-2 text-red-400">Control activo:</td>
                  <td className="p-2 text-green-400">MFA Obligatorio (TOTP)</td>
                </tr>
                <tr className="border-b border-red-500">
                  <td className="p-2 text-red-400">Tipo de control:</td>
                  <td className="p-2 text-green-400">Preventivo</td>
                </tr>
                <tr className="border-b border-red-500">
                  <td className="p-2 text-red-400">Marco:</td>
                  <td className="p-2 text-green-400">IAAA – Autenticación Multifactor</td>
                </tr>
                <tr>
                  <td className="p-2 text-red-400">Resultado:</td>
                  <td className="p-2 text-green-400">Sesión rechazada. IP bloqueada.</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 p-2 bg-green-900 border border-green-500 text-green-400 text-xs">
              Control de seguridad operativo – Ataque neutralizado
            </div>
          </div>
        ),
        duration: 0, // No auto-advance
      },
    ],
    sql_despues: [
      {
        title: 'Inyectando Payload SQL',
        subtitle: 'WAF analizando el payload...',
        content: (
          <div className="space-y-4 font-mono text-sm">
            <div className="bg-gray-900 p-3 border border-yellow-500 text-yellow-400">
              ' OR 1=1; DROP TABLE historias_clinicas; --
            </div>
          </div>
        ),
        duration: 5,
      },
      {
        title: 'INYECCIÓN SQL BLOQUEADA',
        subtitle: 'Web Application Firewall Activo',
        content: (
          <div className="space-y-4 font-mono text-xs">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-green-500">
                  <td className="p-2 text-green-400">Regla WAF:</td>
                  <td className="p-2 text-cyan-400">OWASP CRS 942100</td>
                </tr>
                <tr className="border-b border-green-500">
                  <td className="p-2 text-green-400">Control activo:</td>
                  <td className="p-2 text-cyan-400">WAF + SoD + Cifrado TDE</td>
                </tr>
                <tr className="border-b border-green-500">
                  <td className="p-2 text-green-400">Tipo de control:</td>
                  <td className="p-2 text-cyan-400">Preventivo</td>
                </tr>
                <tr className="border-b border-green-500">
                  <td className="p-2 text-green-400">Marco:</td>
                  <td className="p-2 text-cyan-400">ISO 27002 – A.14</td>
                </tr>
                <tr>
                  <td className="p-2 text-green-400">Resultado:</td>
                  <td className="p-2 text-cyan-400">Payload neutralizado. Datos cifrados.</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 p-2 bg-green-900 border border-green-500 text-green-400 text-xs">
              Control de seguridad operativo – Ataque neutralizado
            </div>
          </div>
        ),
        duration: 0, // No auto-advance
      },
    ],
    backups_despues: [
      {
        title: 'Accediendo al Servidor NAS',
        subtitle: 'Verificando reglas de firewall...',
        content: (
          <div className="space-y-4 font-mono text-sm">
            <div className="bg-gray-900 p-3 border border-yellow-500 text-yellow-400">
              $ ssh root@nas-backup-01.pami.internal
              <br />
              Connecting to 10.0.50.10:22
            </div>
          </div>
        ),
        duration: 5,
      },
      {
        title: 'SABOTAJE IMPEDIDO',
        subtitle: 'Backups Inmutables Protegidos',
        content: (
          <div className="space-y-4 font-mono text-xs">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-green-500">
                  <td className="p-2 text-green-400">Segmentación:</td>
                  <td className="p-2 text-cyan-400">VLAN aislada – Conexión rechazada</td>
                </tr>
                <tr className="border-b border-green-500">
                  <td className="p-2 text-green-400">Control activo:</td>
                  <td className="p-2 text-cyan-400">WORM + Regla 3-2-1 + Segmentación</td>
                </tr>
                <tr className="border-b border-green-500">
                  <td className="p-2 text-green-400">Tipo de control:</td>
                  <td className="p-2 text-cyan-400">Correctivo</td>
                </tr>
                <tr className="border-b border-green-500">
                  <td className="p-2 text-green-400">Marco:</td>
                  <td className="p-2 text-cyan-400">NIST Recover (RC.RP)</td>
                </tr>
                <tr>
                  <td className="p-2 text-green-400">Resultado:</td>
                  <td className="p-2 text-cyan-400">Borrado imposible. Integridad verificada.</td>
                </tr>
              </tbody>
            </table>
            <div className="mt-4 p-2 bg-green-900 border border-green-500 text-green-400 text-xs">
              Control de seguridad operativo – Ataque neutralizado
            </div>
          </div>
        ),
        duration: 0, // No auto-advance
      },
    ],
  };

  const key = `${attackType}_${mode}`;
  const animationFrames = frames[key] || frames.credentials_despues;

  useEffect(() => {
    if (!isAnimating || currentFrame >= animationFrames.length) return;

    const frame = animationFrames[currentFrame];
    if (frame.duration === 0) {
      setIsAnimating(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentFrame((prev) => (prev + 1) % animationFrames.length);
    }, frame.duration * 1000);

    return () => clearTimeout(timer);
  }, [currentFrame, isAnimating, animationFrames]);

  const frame = animationFrames[currentFrame];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-green-400">{frame.title}</h2>
        <p className="text-lg text-cyan-300">{frame.subtitle}</p>
      </div>

      <div className="bg-gray-900 border-2 border-cyan-500 p-6 rounded-lg min-h-48">
        {frame.content}
      </div>

      {/* Frame indicator */}
      <div className="flex justify-center gap-2">
        {animationFrames.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-8 rounded transition-all ${
              index === currentFrame ? 'bg-green-400' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
