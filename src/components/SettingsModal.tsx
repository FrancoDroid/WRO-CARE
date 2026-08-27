import { useState, FormEvent } from 'react';
import { X, Sliders, Wind, Flame, Droplets, Check } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetTemp: number;
  targetHum: number;
  tempTolerance: number;
  humTolerance: number;
  onSave: (targets: {
    targetTemperature: number;
    targetHumidity: number;
    tempTolerance: number;
    humidityTolerance: number;
  }) => void;
  onInjectDisturbance: (type: 'HEAT' | 'COLD' | 'HUMID' | 'DRY') => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  targetTemp,
  targetHum,
  tempTolerance,
  humTolerance,
  onSave,
  onInjectDisturbance,
}: SettingsModalProps) {
  if (!isOpen) return null;

  const [tTemp, setTTemp] = useState<number>(targetTemp);
  const [tHum, setTHum] = useState<number>(targetHum);
  const [tTol, setTTol] = useState<number>(tempTolerance);
  const [hTol, setHTol] = useState<number>(humTolerance);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    playClickSound();
    onSave({
      targetTemperature: tTemp,
      targetHumidity: tHum,
      tempTolerance: tTol,
      humidityTolerance: hTol,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-md border border-[#c6c6cd] shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#c6c6cd] flex items-center justify-between bg-[#f7f9fb]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#0058be]" />
            <h3 className="text-lg font-bold text-[#191c1e]">
              Parâmetros de Controle ESP32
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#76777d] hover:text-[#191c1e] hover:bg-[#e6e8ea] rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Temperature Target & Tolerance */}
          <div className="space-y-3 bg-[#f7f9fb] p-4 rounded border border-[#e0e3e5]">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#45464d] uppercase tracking-wider">
                Temperatura Alvo
              </label>
              <span className="font-mono-data font-bold text-[#131b2e] text-base">
                {tTemp.toFixed(1)} °C
              </span>
            </div>
            <input
              type="range"
              min="15.0"
              max="35.0"
              step="0.5"
              value={tTemp}
              onChange={(e) => setTTemp(parseFloat(e.target.value))}
              className="w-full accent-[#0058be] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#76777d]">
              <span>15.0°C</span>
              <span>Faixa ideal (20°C - 24°C)</span>
              <span>35.0°C</span>
            </div>

            <div className="pt-2 border-t border-[#e0e3e5] flex items-center justify-between">
              <span className="text-xs text-[#45464d]">Banda de Histerese / Tolerância:</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={tTol}
                  onChange={(e) => setTTol(parseFloat(e.target.value) || 0.5)}
                  className="w-16 px-2 py-1 text-xs border border-[#c6c6cd] rounded font-mono-data text-center bg-white"
                />
                <span className="text-xs text-[#76777d]">± °C</span>
              </div>
            </div>
          </div>

          {/* Humidity Target & Tolerance */}
          <div className="space-y-3 bg-[#f7f9fb] p-4 rounded border border-[#e0e3e5]">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-[#45464d] uppercase tracking-wider">
                Umidade Alvo
              </label>
              <span className="font-mono-data font-bold text-[#131b2e] text-base">
                {tHum.toFixed(0)} %
              </span>
            </div>
            <input
              type="range"
              min="20"
              max="90"
              step="1"
              value={tHum}
              onChange={(e) => setTHum(parseInt(e.target.value))}
              className="w-full accent-[#0058be] cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-[#76777d]">
              <span>20%</span>
              <span>Faixa ideal (45% - 65%)</span>
              <span>90%</span>
            </div>

            <div className="pt-2 border-t border-[#e0e3e5] flex items-center justify-between">
              <span className="text-xs text-[#45464d]">Banda de Histerese / Tolerância:</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="1"
                  max="15"
                  step="1"
                  value={hTol}
                  onChange={(e) => setHTol(parseInt(e.target.value) || 5)}
                  className="w-16 px-2 py-1 text-xs border border-[#c6c6cd] rounded font-mono-data text-center bg-white"
                />
                <span className="text-xs text-[#76777d]">± %</span>
              </div>
            </div>
          </div>

          {/* Environmental Simulation Disturbance */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold text-[#45464d] uppercase tracking-wider block">
              Simular Perturbação Ambiental
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onInjectDisturbance('HEAT');
                }}
                className="p-2 text-xs text-[#ba1a1a] bg-[#ffdad6]/60 hover:bg-[#ffdad6] rounded border border-[#ba1a1a]/20 flex items-center gap-1.5 justify-center transition-colors"
              >
                <Flame className="w-3.5 h-3.5" />
                + Calor (+3°C)
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onInjectDisturbance('COLD');
                }}
                className="p-2 text-xs text-[#0058be] bg-[#d8e2ff]/60 hover:bg-[#d8e2ff] rounded border border-[#0058be]/20 flex items-center gap-1.5 justify-center transition-colors"
              >
                <Wind className="w-3.5 h-3.5" />
                - Frio (-3°C)
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onInjectDisturbance('HUMID');
                }}
                className="p-2 text-xs text-[#009668] bg-[#6ffbbe]/40 hover:bg-[#6ffbbe]/70 rounded border border-[#009668]/20 flex items-center gap-1.5 justify-center transition-colors"
              >
                <Droplets className="w-3.5 h-3.5" />
                + Vapor (+15% UR)
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onInjectDisturbance('DRY');
                }}
                className="p-2 text-xs text-[#76777d] bg-[#f2f4f6] hover:bg-[#e0e3e5] rounded border border-[#c6c6cd] flex items-center gap-1.5 justify-center transition-colors"
              >
                <Wind className="w-3.5 h-3.5" />
                Ar Seco (-15% UR)
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#c6c6cd]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#45464d] hover:bg-[#e6e8ea] rounded transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 text-xs font-bold text-white bg-[#0058be] hover:bg-[#004bb0] rounded flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  Salvo!
                </>
              ) : (
                'Salvar Parâmetros'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
