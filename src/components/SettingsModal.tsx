import { useState, FormEvent } from 'react';
import {
  X,
  Sliders,
  Wind,
  Flame,
  Droplets,
  Check,
} from 'lucide-react';

import { playClickSound } from '../utils/audio';

import { Esp32Settings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Esp32Settings;
  onSave: (settings: Esp32Settings) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  settings,
  onSave,
}: SettingsModalProps) {
  const [form, setForm] =
    useState<Esp32Settings>(settings);

  const [savedSuccess, setSavedSuccess] =
    useState(false);

  if (!isOpen) {
    return null;
  }

  const update = <K extends keyof Esp32Settings>(
    key: K,
    value: Esp32Settings[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleSubmit = (
    event: FormEvent,
  ) => {
    event.preventDefault();

    playClickSound();

    onSave({
      ...form,
      peltier_pwm: Math.max(
        0,
        Math.min(255, form.peltier_pwm),
      ),
      humidifier_pwm: Math.max(
        0,
        Math.min(255, form.humidifier_pwm),
      ),
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

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >
          <div className="space-y-3 bg-[#f7f9fb] p-4 rounded border border-[#e0e3e5]">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#ba1a1a]" />

              <span className="text-xs font-bold text-[#45464d] uppercase tracking-wider">
                Temperatura
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <label className="text-xs text-[#45464d]">
                Mínima
                <input
                  type="number"
                  step="0.1"
                  value={form.target_temp_min}
                  onChange={(e) =>
                    update(
                      'target_temp_min',
                      Number(e.target.value),
                    )
                  }
                  className="mt-1 w-full px-2 py-2 border border-[#c6c6cd] rounded font-mono-data bg-white"
                />
              </label>

              <label className="text-xs text-[#45464d]">
                Máxima
                <input
                  type="number"
                  step="0.1"
                  value={form.target_temp_max}
                  onChange={(e) =>
                    update(
                      'target_temp_max',
                      Number(e.target.value),
                    )
                  }
                  className="mt-1 w-full px-2 py-2 border border-[#c6c6cd] rounded font-mono-data bg-white"
                />
              </label>

              <label className="text-xs text-[#45464d]">
                Limite
                <input
                  type="number"
                  step="0.1"
                  value={form.max_temp}
                  onChange={(e) =>
                    update(
                      'max_temp',
                      Number(e.target.value),
                    )
                  }
                  className="mt-1 w-full px-2 py-2 border border-[#c6c6cd] rounded font-mono-data bg-white"
                />
              </label>
            </div>
          </div>

          <div className="space-y-3 bg-[#f7f9fb] p-4 rounded border border-[#e0e3e5]">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#0058be]" />

              <span className="text-xs font-bold text-[#45464d] uppercase tracking-wider">
                Umidade
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs text-[#45464d]">
                Mínima
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={
                    form.target_humidity_min
                  }
                  onChange={(e) =>
                    update(
                      'target_humidity_min',
                      Number(e.target.value),
                    )
                  }
                  className="mt-1 w-full px-2 py-2 border border-[#c6c6cd] rounded font-mono-data bg-white"
                />
              </label>

              <label className="text-xs text-[#45464d]">
                Máxima
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={
                    form.target_humidity_max
                  }
                  onChange={(e) =>
                    update(
                      'target_humidity_max',
                      Number(e.target.value),
                    )
                  }
                  className="mt-1 w-full px-2 py-2 border border-[#c6c6cd] rounded font-mono-data bg-white"
                />
              </label>
            </div>
          </div>

          <div className="space-y-3 bg-[#f7f9fb] p-4 rounded border border-[#e0e3e5]">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-[#0058be]" />

              <span className="text-xs font-bold text-[#45464d] uppercase tracking-wider">
                Potência PWM
              </span>
            </div>

            <label className="text-xs text-[#45464d] block">
              Peltier: {form.peltier_pwm}

              <input
                type="range"
                min="0"
                max="255"
                step="1"
                value={form.peltier_pwm}
                onChange={(e) =>
                  update(
                    'peltier_pwm',
                    Number(e.target.value),
                  )
                }
                className="mt-2 w-full accent-[#0058be] cursor-pointer"
              />
            </label>

            <label className="text-xs text-[#45464d] block">
              Umidificador: {
                form.humidifier_pwm
              }

              <input
                type="range"
                min="0"
                max="255"
                step="1"
                value={
                  form.humidifier_pwm
                }
                onChange={(e) =>
                  update(
                    'humidifier_pwm',
                    Number(e.target.value),
                  )
                }
                className="mt-2 w-full accent-[#0058be] cursor-pointer"
              />
            </label>
          </div>

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
