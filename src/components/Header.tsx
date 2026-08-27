import { Volume2, VolumeX, BarChart2, Settings, Wifi, WifiOff } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled, playClickSound } from '../utils/audio';
import { useState } from 'react';
import careLogo from '../assets/images/care_bot_logo_1787859684353.jpg';

interface HeaderProps {
  connected: boolean;
  onToggleConnection: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onOpenDiagnostics: () => void;
}

export function Header({
  connected,
  onToggleConnection,
  onOpenHistory,
  onOpenSettings,
  onOpenDiagnostics,
}: HeaderProps) {
  const [soundOn, setSoundOn] = useState(isSoundEnabled());

  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playClickSound();
  };

  return (
    <header
      id="care-header"
      className="bg-[#f7f9fb] border-b border-[#c6c6cd] sticky top-0 z-40 w-full px-4 md:px-8 py-2.5 flex justify-between items-center"
    >
      {/* Brand & CARE Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-full overflow-hidden border border-[#c6c6cd] bg-white flex items-center justify-center shadow-xs shrink-0 ring-2 ring-emerald-500/20">
          <img
            src={careLogo}
            alt="Logo CARE Robot"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex items-baseline gap-1.5">
          <h1 className="text-xl md:text-2xl font-bold tracking-tighter text-[#000000]">
            CARE
          </h1>
          <span className="hidden sm:inline-block text-[11px] font-semibold text-[#45464d] uppercase tracking-wider">
            ESP32 Controller
          </span>
        </div>
      </div>

      {/* Action Controls & Connection Status */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Quick Tools */}
        <div className="flex items-center gap-1">
          <button
            id="btn-telemetry-history"
            onClick={() => {
              playClickSound();
              onOpenHistory();
            }}
            title="Histórico de Telemetria e Gráficos"
            className="p-2 text-[#45464d] hover:text-[#191c1e] hover:bg-[#e6e8ea] rounded-md transition-colors"
          >
            <BarChart2 className="w-4 h-4" />
          </button>

          <button
            id="btn-settings"
            onClick={() => {
              playClickSound();
              onOpenSettings();
            }}
            title="Configurar Alvos e Parâmetros"
            className="p-2 text-[#45464d] hover:text-[#191c1e] hover:bg-[#e6e8ea] rounded-md transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            id="btn-sound-toggle"
            onClick={handleToggleSound}
            title={soundOn ? 'Silenciar Áudio' : 'Ativar Efeitos Sonoros'}
            className="p-2 text-[#45464d] hover:text-[#191c1e] hover:bg-[#e6e8ea] rounded-md transition-colors"
          >
            {soundOn ? (
              <Volume2 className="w-4 h-4 text-[#0058be]" />
            ) : (
              <VolumeX className="w-4 h-4 text-[#76777d]" />
            )}
          </button>
        </div>

        <div className="h-4 w-px bg-[#c6c6cd] hidden sm:block" />

        {/* Live ESP32 Status indicator */}
        <button
          id="btn-connection-status"
          onClick={() => {
            playClickSound();
            onOpenDiagnostics();
          }}
          className="flex items-center gap-2 py-1 px-2.5 rounded-md hover:bg-[#e6e8ea] transition-colors border border-transparent hover:border-[#c6c6cd]"
          title="Clique para inspecionar diagnóstico do ESP32"
        >
          {connected ? (
            <>
              <div className="w-2 h-2 rounded-full bg-[#10b981] status-pulse-emerald" />
              <span className="text-[12px] font-bold tracking-wider text-[#45464d] uppercase">
                CONECTADO
              </span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 rounded-full bg-[#ba1a1a] status-pulse-crimson" />
              <span className="text-[12px] font-bold tracking-wider text-[#ba1a1a] uppercase">
                DESCONECTADO
              </span>
            </>
          )}
        </button>

        {/* Toggle connection simulation */}
        <button
          id="btn-toggle-connection-sim"
          onClick={() => {
            playClickSound();
            onToggleConnection();
          }}
          title={connected ? 'Simular perda de conexão' : 'Restabelecer conexão'}
          className="p-1.5 text-[#76777d] hover:text-[#191c1e] hover:bg-[#e6e8ea] rounded transition-colors"
        >
          {connected ? (
            <Wifi className="w-4 h-4 text-[#10b981]" />
          ) : (
            <WifiOff className="w-4 h-4 text-[#ba1a1a]" />
          )}
        </button>
      </div>
    </header>
  );
}
