import { TriangleAlert, RotateCcw } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface EmergencyAlertModalProps {
  isOpen: boolean;
  onReset: () => void;
}

export function EmergencyAlertModal({ isOpen, onReset }: EmergencyAlertModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-lg border-2 border-[#ba1a1a] shadow-2xl w-full max-w-md overflow-hidden">
        {/* Warning Banner */}
        <div className="bg-[#ffdad6] p-6 border-b border-[#ba1a1a]/30 flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#ba1a1a] text-white flex items-center justify-center shadow-lg animate-bounce">
            <TriangleAlert className="w-8 h-8 fill-white text-[#ba1a1a]" strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#ba1a1a] uppercase tracking-wide">
              Parada de Emergência Ativada
            </h3>
            <p className="text-xs font-semibold text-[#93000a] mt-1">
              SAFETY INTERLOCK TRIPPED
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4 text-sm text-[#191c1e]">
          <div className="bg-[#f7f9fb] p-3.5 rounded border border-[#e0e3e5] space-y-1.5 text-xs text-[#45464d]">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Relé Peltier:</span>
              <span className="font-bold text-[#009668]">DESLIGADO (Seguro)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Relé Resistência:</span>
              <span className="font-bold text-[#009668]">DESLIGADO (Seguro)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold">Relé Humidificador:</span>
              <span className="font-bold text-[#009668]">DESLIGADO (Seguro)</span>
            </div>
          </div>

          <p className="text-xs text-[#76777d] text-center leading-relaxed">
            Todos os atuadores foram desligados instantaneamente por comando de segurança. O controle automático foi pausado.
          </p>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onReset();
            }}
            className="w-full py-3 bg-[#191c1e] hover:bg-black text-white font-bold text-sm rounded-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            Desarmar Emergência e Restaurar Sistema
          </button>
        </div>
      </div>
    </div>
  );
}
