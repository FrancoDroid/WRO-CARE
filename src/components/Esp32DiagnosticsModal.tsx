import { X, Wifi, Activity, Terminal, ShieldCheck } from 'lucide-react';
import { Esp32Metrics, SystemLog } from '../types';
import careLogo from '../assets/images/care_bot_logo_1787859684353.jpg';

interface Esp32DiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: Esp32Metrics;
  logs: SystemLog[];
}

export function Esp32DiagnosticsModal({
  isOpen,
  onClose,
  metrics,
  logs,
}: Esp32DiagnosticsModalProps) {
  if (!isOpen) return null;

  const formatUptime = (sec: number) => {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-md border border-[#c6c6cd] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#c6c6cd] flex items-center justify-between bg-[#f7f9fb]">
          <div className="flex items-center gap-2.5">
            <img
              src={careLogo}
              alt="CARE Mascot"
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-full object-cover border border-[#c6c6cd]"
            />
            <h3 className="text-lg font-bold text-[#191c1e]">
              Diagnóstico de Hardware - ESP32 NodeMCU
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#76777d] hover:text-[#191c1e] hover:bg-[#e6e8ea] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          {/* Status grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#f7f9fb] p-3 rounded border border-[#e0e3e5]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#45464d] uppercase mb-1">
                <Wifi className="w-3.5 h-3.5 text-[#0058be]" /> Rede Wi-Fi
              </div>
              <span className="font-mono-data font-bold text-xs block text-[#131b2e]">
                {metrics.connected ? `${metrics.rssi} dBm (Excelente)` : 'Sem Conexão'}
              </span>
              <span className="text-[11px] text-[#76777d]">IP: {metrics.ip}</span>
            </div>

            <div className="bg-[#f7f9fb] p-3 rounded border border-[#e0e3e5]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#45464d] uppercase mb-1">
                <Activity className="w-3.5 h-3.5 text-[#009668]" /> Memória Heap
              </div>
              <span className="font-mono-data font-bold text-xs block text-[#131b2e]">
                {metrics.freeHeap} KB Livre
              </span>
              <span className="text-[11px] text-[#76777d]">Tensão: {metrics.voltage}V</span>
            </div>

            <div className="bg-[#f7f9fb] p-3 rounded border border-[#e0e3e5]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#45464d] uppercase mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0058be]" /> Firmware
              </div>
              <span className="font-mono-data font-bold text-xs block text-[#131b2e]">
                v{metrics.firmwareVersion}
              </span>
              <span className="text-[11px] text-[#76777d]">Uptime: {formatUptime(metrics.uptimeSeconds)}</span>
            </div>
          </div>

          {/* GPIO Mapping */}
          <div className="bg-white p-4 rounded border border-[#c6c6cd]">
            <h4 className="text-xs font-bold text-[#191c1e] uppercase tracking-wider mb-3">
              Mapeamento de Pinos GPIO
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-[#f2f4f6] rounded border border-[#e0e3e5]">
                <span className="text-[#76777d] block text-[10px] uppercase">Relé 1 (Peltier)</span>
                <span className="font-mono-data font-bold text-[#0058be]">GPIO {metrics.gpioPins.peltier}</span>
              </div>
              <div className="p-2 bg-[#f2f4f6] rounded border border-[#e0e3e5]">
                <span className="text-[#76777d] block text-[10px] uppercase">Relé 2 (Resistência)</span>
                <span className="font-mono-data font-bold text-[#ba1a1a]">GPIO {metrics.gpioPins.resistance}</span>
              </div>
              <div className="p-2 bg-[#f2f4f6] rounded border border-[#e0e3e5]">
                <span className="text-[#76777d] block text-[10px] uppercase">Relé 3 (Humidificador)</span>
                <span className="font-mono-data font-bold text-[#0058be]">GPIO {metrics.gpioPins.humidifier}</span>
              </div>
              <div className="p-2 bg-[#f2f4f6] rounded border border-[#e0e3e5]">
                <span className="text-[#76777d] block text-[10px] uppercase">Barramento Sensores</span>
                <span className="font-mono-data font-bold text-[#009668]">I2C (SDA/SCL)</span>
              </div>
            </div>
          </div>

          {/* Live Serial / Telemetry Stream Log */}
          <div className="bg-[#131b2e] p-3.5 rounded text-white font-mono-data text-xs flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>ESP32 UART0 Serial Output (115200 baud)</span>
              </div>
              <span className="text-[10px] text-gray-400">Tempo Real</span>
            </div>

            <div className="h-40 overflow-y-auto space-y-1 pr-1 text-[11px]">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-2">
                  <span className="text-gray-500 shrink-0">[{log.timestamp}]</span>
                  <span
                    className={`font-bold shrink-0 ${
                      log.level === 'WARN'
                        ? 'text-amber-400'
                        : log.level === 'ERROR'
                        ? 'text-red-400'
                        : log.level === 'ACTION'
                        ? 'text-cyan-400'
                        : 'text-emerald-300'
                    }`}
                  >
                    [{log.level}]
                  </span>
                  <span className="text-gray-200">{log.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#c6c6cd] bg-[#f7f9fb] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-1.5 text-xs font-bold text-white bg-[#191c1e] hover:bg-black rounded transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
