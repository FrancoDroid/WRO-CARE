import { Info, Sliders } from 'lucide-react';
import { OperationMode } from '../types';
import { playSwitchSound } from '../utils/audio';

interface OperationModeCardProps {
  mode: OperationMode;
  onSelectMode: (mode: OperationMode) => void;
  disabled?: boolean;
}

export function OperationModeCard({
  mode,
  onSelectMode,
  disabled = false,
}: OperationModeCardProps) {
  const handleModeChange = (newMode: OperationMode) => {
    if (disabled || newMode === mode) return;
    playSwitchSound(newMode === 'AUTOMATICO');
    onSelectMode(newMode);
  };

  return (
    <section
      id="card-operation-mode"
      className="bg-white border border-[#c6c6cd] p-4 flex flex-col gap-3 rounded-sm shadow-xs"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[#191c1e]">
          Modo de Operação
        </h2>
        <span className="text-[11px] font-medium text-[#76777d]">
          {mode === 'AUTOMATICO' ? 'Auto-regulação PID' : 'Supervisão Manual'}
        </span>
      </div>

      {/* Segmented Toggle */}
      <div className="flex bg-[#f2f4f6] rounded-md p-1 gap-1 border border-[#e0e3e5]">
        <button
          id="btn-mode-automatic"
          type="button"
          disabled={disabled}
          onClick={() => handleModeChange('AUTOMATICO')}
          className={`flex-1 py-2 text-[12px] font-bold tracking-wider rounded transition-all flex items-center justify-center gap-1.5 ${
            mode === 'AUTOMATICO'
              ? 'bg-[#0058be] text-white shadow-xs'
              : 'text-[#45464d] hover:bg-[#e0e3e5]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          AUTOMÁTICO
        </button>

        <button
          id="btn-mode-manual"
          type="button"
          disabled={disabled}
          onClick={() => handleModeChange('MANUAL')}
          className={`flex-1 py-2 text-[12px] font-bold tracking-wider rounded transition-all flex items-center justify-center gap-1.5 ${
            mode === 'MANUAL'
              ? 'bg-[#0058be] text-white shadow-xs'
              : 'text-[#45464d] hover:bg-[#e0e3e5]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          MANUAL
        </button>
      </div>

      {/* Status Notice */}
      <div className="flex items-center gap-2.5 text-[#45464d] text-sm bg-[#eceef0] p-3 rounded border border-[#c6c6cd]">
        {mode === 'AUTOMATICO' ? (
          <>
            <Info className="w-4 h-4 text-[#76777d] shrink-0" />
            <span className="text-xs md:text-sm font-normal leading-tight">
              Sistema operando sob lógica do ESP32.
            </span>
          </>
        ) : (
          <>
            <Sliders className="w-4 h-4 text-[#0058be] shrink-0" />
            <span className="text-xs md:text-sm font-normal leading-tight text-[#131b2e]">
              Controle manual ativo: atuadores liberados para acionamento direto.
            </span>
          </>
        )}
      </div>
    </section>
  );
}
