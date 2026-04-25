import { useState } from 'react';
import { Lock, AlertTriangle, CheckCircle, XCircle, Loader } from 'lucide-react';
import type { SimulationMode, AttackType, SimulationPhase } from '@/pages/Home';
import AnimatedSimulation from './AnimatedSimulation';

interface SimulationPanelProps {
  phase: SimulationPhase;
  attackType: AttackType | null;
  mode: SimulationMode;
  onReset: () => void;
  onValidate2FA: () => void;
}

export default function SimulationPanel({
  phase,
  attackType,
  mode,
  onReset,
  onValidate2FA,
}: SimulationPanelProps) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (phase === 'idle') {
    const isAntes = mode === 'antes';
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4 tracking-wider">
            PORTAL DE AFILIADOS PAMI
          </h2>
          <div className={`text-lg font-bold mb-6 tracking-wider ${isAntes ? 'text-red-500' : 'text-green-400'}`}>
            {isAntes ? 'Estado: Agosto 2023 - Sin controles de seguridad implementados' : 'Estado: Post-auditoría - Todos los controles implementados y verificados'}
          </div>
          <p className="text-muted-foreground text-sm mb-8">
            Seleccione un muestreo en el panel izquierdo para comenzar la simulación.
          </p>
          <div className="text-6xl text-cyan-400 opacity-50">⟳</div>
        </div>
      </div>
    );
  }

  if (phase === 'login') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full max-w-sm border-2 border-cyan-500 rounded-sm p-6 bg-card/80 glow-cyan">
          <h2 className="text-xl font-bold text-cyan-400 mb-6 tracking-wider">
            PORTAL DE ACCESO
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground tracking-widest mb-2 block">
                USUARIO
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background border border-cyan-500/50 rounded-sm px-3 py-2 text-foreground text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground tracking-widest mb-2 block">
                CONTRASEÑA
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-cyan-500/50 rounded-sm px-3 py-2 text-foreground text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
            </div>

            <button
              onClick={() => {
                if (password) {
                  setIsProcessing(true);
                  setTimeout(() => setIsProcessing(false), 500);
                }
              }}
              disabled={isProcessing}
              className={`w-full font-bold py-2 rounded-sm transition-all duration-200 tracking-wider text-sm ${
                isProcessing
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-cyan-500 hover:bg-cyan-600 text-background glow-cyan'
              }`}
            >
              {isProcessing ? 'PROCESANDO...' : 'ACCEDER'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Loader className="w-12 h-12 text-magenta-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-bold text-magenta-400 mb-2 tracking-wider">
            PROCESANDO...
          </h2>
          <p className="text-muted-foreground text-sm">
            {attackType === 'credentials' && 'Validando credenciales...'}
            {attackType === 'sql' && 'Inyectando payload SQL...'}
            {attackType === 'backups' && 'Accediendo a servidor NAS...'}
          </p>
        </div>
      </div>
    );
  }

  if (phase === '2fa') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-full max-w-sm border-2 border-green-500 rounded-sm p-6 bg-card/80 glow-green">
          <h2 className="text-xl font-bold text-green-400 mb-6 tracking-wider">
            SEGUNDO FACTOR REQUERIDO
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground tracking-widest mb-2 block">
                USUARIO REQUERIDO
              </label>
              <input
                type="text"
                value={username}
                disabled
                className="w-full bg-background border border-green-500/50 rounded-sm px-3 py-2 text-foreground text-sm opacity-60"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground tracking-widest mb-2 block">
                TOKEN OTP
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="000000"
                className="w-full bg-background border border-green-500/50 rounded-sm px-3 py-2 text-foreground text-sm focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 text-center tracking-widest"
              />
            </div>

            <button
              onClick={onValidate2FA}
              disabled={isProcessing}
              className={`w-full font-bold py-2 rounded-sm transition-all duration-200 tracking-wider text-sm ${
                isProcessing
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-background glow-green'
              }`}
            >
              {isProcessing ? 'VALIDANDO...' : 'VALIDAR TOKEN'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'result') {
    const isSuccess = mode === 'despues';
    
    // En modo DESPUÉS, mostrar animación interactiva
    if (isSuccess && attackType) {
      return (
        <div className="flex items-center justify-center h-full overflow-y-auto">
          <div className="w-full max-w-2xl py-6 px-4">
            <AnimatedSimulation attackType={attackType} mode={mode} />
          </div>
        </div>
      );
    }
    
    const resultTitle =
      attackType === 'credentials'
        ? isSuccess
          ? 'ACCESO DENEGADO'
          : 'ACCESO CONCEDIDO'
        : attackType === 'sql'
          ? isSuccess
            ? 'INYECCIÓN SQL BLOQUEADA'
            : 'SQL INJECTION EXITOSA'
          : isSuccess
            ? 'SABOTAJE IMPEDIDO'
            : 'BACKUPS ELIMINADOS';

    return (
      <div className="flex items-center justify-center h-full overflow-y-auto">
        <div className="w-full max-w-2xl text-center py-6">
          <div
            className={`text-6xl mb-4 ${
              isSuccess ? 'text-green-400' : 'text-red-500'
            }`}
          >
            {isSuccess ? <CheckCircle className="w-24 h-24 mx-auto" /> : <XCircle className="w-24 h-24 mx-auto" />}
          </div>

          <h2
            className={`text-3xl font-bold mb-4 tracking-wider ${
              isSuccess ? 'text-green-400' : 'text-red-500'
            }`}
          >
            {resultTitle}
          </h2>

          <div className="bg-card border-2 rounded-sm p-4 mb-6 text-left max-h-96 overflow-y-auto">
            {attackType === 'credentials' && (
              <div className="space-y-2 text-sm font-mono">
                <p className="text-cyan-400">
                  {isSuccess ? '[BLOCKED] Autenticación de dos factores requerida' : '[EXPOSED] Credenciales comprometidas'}
                </p>
                <p className="text-muted-foreground">
                  {isSuccess
                    ? 'La defensa de 2FA bloqueó el acceso no autorizado'
                    : 'Usuario: admin | Contraseña: admin123'}
                </p>
                {!isSuccess && (
                  <>
                    <p className="text-red-500 font-bold mt-3">[LATERAL] Movimiento lateral exitoso - Sin segmentación de red</p>
                    <p className="text-red-500">[EXPOSED] Acceso a todas las bases de datos:</p>
                    <ul className="text-red-500 ml-4 mt-2 space-y-1">
                      <li>• afiliados (5.2M registros)</li>
                      <li>• recetas_medicas</li>
                      <li>• turnos_medicos</li>
                      <li>• historias_clinicas (SENSIBLE)</li>
                      <li>• empleados_sueldos</li>
                    </ul>
                  </>
                )}
              </div>
            )}

            {attackType === 'sql' && (
              <div className="space-y-2 text-sm font-mono">
                <p className={isSuccess ? 'text-green-400' : 'text-red-500 font-bold'}>
                  {isSuccess
                    ? '[BLOCKED] WAF interceptó la solicitud maliciosa'
                    : '[SUCCESS] SQL INJECTION EXITOSA - SIN WAF'}
                </p>
                {!isSuccess && (
                  <div className="mt-3">
                    <p className="text-red-500 font-bold mb-2">TODA LA BASE DE AFILIADOS EXPUESTA EN TEXTO PLANO</p>
                    <table className="w-full text-left text-xs border border-red-500/30">
                      <thead>
                        <tr className="border-b border-red-500/50 bg-red-500/10">
                          <th className="text-red-400 p-1">DNI</th>
                          <th className="text-red-400 p-1">Nombre</th>
                          <th className="text-red-400 p-1">Enfermedad (Historia Clínica)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-red-500/20">
                          <td className="text-red-500 p-1">12345678</td>
                          <td className="text-red-500 p-1">Juan Pérez</td>
                          <td className="text-red-500 p-1">Diabetes Mellitus Tipo 2</td>
                        </tr>
                        <tr className="border-b border-red-500/20">
                          <td className="text-red-500 p-1">87654321</td>
                          <td className="text-red-500 p-1">María García</td>
                          <td className="text-red-500 p-1">Hipertensión Arterial</td>
                        </tr>
                        <tr>
                          <td className="text-red-500 p-1">55555555</td>
                          <td className="text-red-500 p-1">Carlos López</td>
                          <td className="text-red-500 p-1">Cáncer de Próstata</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-red-500 font-bold mt-3">VIOLACIÓN LEY 25.326 - DATOS SENSIBLES DE SALUD EXPUESTOS SIN CIFRAR</p>
                  </div>
                )}
              </div>
            )}

            {attackType === 'backups' && (
              <div className="space-y-2 text-sm font-mono">
                {isSuccess ? (
                  <>
                    <p className="text-green-400 font-bold">[BLOCKED] Segmentación de red activa - Acceso denegado</p>
                    <p className="text-green-400">[PROTECTED] Backups protegidos con WORM</p>
                    <p className="text-green-400">[SAFE] Regla 3-2-1 implementada correctamente</p>
                  </>
                ) : (
                  <>
                    <p className="text-red-500 font-bold">[CRITICAL] Accediendo al servidor NAS...</p>
                    <p className="text-red-500">Connecting to 10.0.50.10:22..</p>
                    <p className="text-red-500 font-bold mt-2">SIN SEGMENTACIÓN - CONEXIÓN DIRECTA AL NAS</p>
                    <p className="text-red-500 mt-2">
                      $ rm -rf /backups/* <br />
                      $ shred -vfz -n 10 /backups/.* <br />
                      [COMPLETE] Eliminación de datos completada
                    </p>
                    <p className="text-red-500 font-bold mt-2">SIN WORM - SIN REGLA 3-2-1 - BORRADO COMPLETO EXITOSO</p>
                    <p className="text-red-500 font-bold mt-2">RECUPERACIÓN IMPOSIBLE - SISTEMA COMPLETAMENTE COMPROMETIDO</p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
