import { useState, useEffect } from 'react';
import { Lock, AlertTriangle, CheckCircle, XCircle, Loader } from 'lucide-react';
import type { SimulationMode, AttackType, SimulationPhase } from '@/pages/Home';

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
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4 text-cyan-400">⟳</div>
          <h2 className="text-2xl font-bold text-cyan-400 mb-2 tracking-wider">
            ESPERANDO SIMULACIÓN
          </h2>
          <p className="text-muted-foreground text-sm">
            Selecciona una muestra de ataque para comenzar
          </p>
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
    const isSuccess = mode === 'protegido';
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
      <div className="flex items-center justify-center h-full">
        <div className="w-full max-w-lg text-center">
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

          <div className="bg-card border-2 rounded-sm p-4 mb-6 text-left">
            {attackType === 'credentials' && (
              <div className="space-y-2 text-sm font-mono">
                <p className="text-cyan-400">
                  {isSuccess ? '[BLOCKED] Autenticación de dos factores requerida' : '[EXPOSED] Credenciales comprometidas'}
                </p>
                <p className="text-muted-foreground">
                  {isSuccess
                    ? 'La defensa de 2FA bloqueó el acceso no autorizado'
                    : 'Usuario: admin | Contraseña: ••••••'}
                </p>
              </div>
            )}

            {attackType === 'sql' && (
              <div className="space-y-2 text-sm font-mono">
                <p className="text-cyan-400">
                  {isSuccess
                    ? '[BLOCKED] WAF interceptó la solicitud maliciosa'
                    : '[SUCCESS] Datos extraídos de la base de datos'}
                </p>
                {!isSuccess && (
                  <table className="w-full text-left text-xs mt-2">
                    <thead>
                      <tr className="border-b border-cyan-500/30">
                        <th className="text-cyan-400">ID</th>
                        <th className="text-cyan-400">Nombre</th>
                        <th className="text-cyan-400">DNI</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-yellow-400">1</td>
                        <td className="text-yellow-400">Juan Pérez</td>
                        <td className="text-yellow-400">12345678</td>
                      </tr>
                      <tr>
                        <td className="text-yellow-400">2</td>
                        <td className="text-yellow-400">María García</td>
                        <td className="text-yellow-400">87654321</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {attackType === 'backups' && (
              <div className="space-y-2 text-sm font-mono">
                <p className="text-cyan-400">
                  {isSuccess
                    ? '[BLOCKED] Firewall impidió acceso al NAS'
                    : '[CRITICAL] Backups eliminados del sistema'}
                </p>
                {!isSuccess && (
                  <p className="text-red-500 mt-2">
                    $ rm -rf /backups/* <br />
                    $ shred -vfz -n 10 /backups/.* <br />
                    [COMPLETE] Eliminación de datos completada
                  </p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onReset}
            className="bg-magenta-500 hover:bg-magenta-600 text-background font-bold py-2 px-6 rounded-sm transition-all duration-200 tracking-wider text-sm glow-magenta"
          >
            REINICIAR SIMULACIÓN
          </button>
        </div>
      </div>
    );
  }

  return null;
}
