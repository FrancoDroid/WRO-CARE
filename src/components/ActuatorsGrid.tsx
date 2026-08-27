import { Snowflake, Flame, Droplet } from 'lucide-react';
import { ActuatorState, OperationMode } from '../types';
import { playClickSound } from '../utils/audio';

interface ActuatorsGridProps {
  actuators: ActuatorState;
  mode: OperationMode;
  onToggleActuator: (actuator: keyof ActuatorState) => void;
  disabled?: boolean;
}

export function ActuatorsGrid({
  actuators,
  mode,
  onToggleActuator,
  disabled = false,
}: ActuatorsGridProps) {
  const isAuto = mode === 'AUTOMATICO';

  const handleAction = (actuator: keyof ActuatorState) => {
    if (disabled || isAuto) return;
    playClickSound();
    onToggleActuator(actuator);
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. PELTIER (Cooling) */}
      <div
        id="card-actuator-peltier"
        className={`bg-white p-4 flex flex-col gap-3 items-center text-center rounded-sm transition-all ${
          actuators.peltier
            ? 'border-2 border-[#0058be] shadow-[inset_0_0_0_1px_#0058be]'
            : 'border border-[#c6c6cd]'
        }`}
      >
        <div className="h-10 flex items-center justify-center">
          <Snowflake
            className={`w-8 h-8 transition-colors ${
              actuators.peltier ? 'text-[#0058be] animate-spin' : 'text-[#76777d]'
            }`}
            style={{ animationDuration: '6s' }}
          />
        </div>

        <div>
          <div className="text-[12px] font-bold tracking-wider text-[#45464d] uppercase">
            PELTIER
          </div>
          <div
            className={`text-sm ${
              actuators.peltier
                ? 'text-[#0058be] font-bold'
                : 'text-[#76777d] font-normal'
            }`}
          >
            {actuators.peltier ? 'Ligado' : 'Desligado'}
          </div>
        </div>

        {isAuto ? (
          <button
            type="button"
            disabled
            className="w-full py-2 bg-[#e6e8ea] text-[#76777d] text-[12px] font-bold tracking-wider rounded cursor-not-allowed border border-[#c6c6cd] uppercase"
          >
            {actuators.peltier ? 'DESLIGAR' : 'LIGAR'}
          </button>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleAction('peltier')}
            className={`w-full py-2 text-[12px] font-bold tracking-wider rounded border uppercase transition-all active:scale-[0.98] ${
              actuators.peltier
                ? 'bg-[#ba1a1a] hover:bg-[#a01515] text-white border-[#ba1a1a]'
                : 'bg-[#0058be] hover:bg-[#004bb0] text-white border-[#0058be]'
            }`}
          >
            {actuators.peltier ? 'DESLIGAR' : 'LIGAR'}
          </button>
        )}
      </div>

      {/* 2. RESISTÊNCIA (Heating) */}
      <div
        id="card-actuator-resistance"
        className={`bg-white p-4 flex flex-col gap-3 items-center text-center rounded-sm transition-all ${
          actuators.resistance
            ? 'border-2 border-[#000000] shadow-[inset_0_0_0_1px_#000000]'
            : 'border border-[#c6c6cd]'
        }`}
      >
        <div className="h-10 flex items-center justify-center">
          <Flame
            className={`w-8 h-8 transition-colors ${
              actuators.resistance ? 'text-[#ba1a1a]' : 'text-[#76777d]'
            }`}
          />
        </div>

        <div>
          <div className="text-[12px] font-bold tracking-wider text-[#45464d] uppercase">
            RESISTÊNCIA
          </div>
          <div
            className={`text-sm ${
              actuators.resistance
                ? 'text-[#ba1a1a] font-bold'
                : 'text-[#76777d] font-normal'
            }`}
          >
            {actuators.resistance ? 'Ligado' : 'Desligado'}
          </div>
        </div>

        {isAuto ? (
          <button
            type="button"
            disabled
            className="w-full py-2 bg-[#e6e8ea] text-[#76777d] text-[12px] font-bold tracking-wider rounded cursor-not-allowed border border-[#c6c6cd] uppercase"
          >
            {actuators.resistance ? 'DESLIGAR' : 'LIGAR'}
          </button>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleAction('resistance')}
            className={`w-full py-2 text-[12px] font-bold tracking-wider rounded border uppercase transition-all active:scale-[0.98] ${
              actuators.resistance
                ? 'bg-[#ba1a1a] hover:bg-[#a01515] text-white border-[#ba1a1a]'
                : 'bg-[#0058be] hover:bg-[#004bb0] text-white border-[#0058be]'
            }`}
          >
            {actuators.resistance ? 'DESLIGAR' : 'LIGAR'}
          </button>
        )}
      </div>

      {/* 3. HUMIDIFICADOR (Humidifier) */}
      <div
        id="card-actuator-humidifier"
        className={`bg-white p-4 flex flex-col gap-3 items-center text-center rounded-sm transition-all ${
          actuators.humidifier
            ? 'border-2 border-[#0058be] shadow-[inset_0_0_0_1px_#0058be]'
            : 'border border-[#c6c6cd]'
        }`}
      >
        <div className="h-10 flex items-center justify-center">
          <Droplet
            className={`w-8 h-8 transition-colors ${
              actuators.humidifier ? 'text-[#0058be]' : 'text-[#76777d]'
            }`}
          />
        </div>

        <div>
          <div className="text-[12px] font-bold tracking-wider text-[#45464d] uppercase">
            HUMIDIFICADOR
          </div>
          <div
            className={`text-sm ${
              actuators.humidifier
                ? 'text-[#0058be] font-bold'
                : 'text-[#76777d] font-normal'
            }`}
          >
            {actuators.humidifier ? 'Ligado' : 'Desligado'}
          </div>
        </div>

        {isAuto ? (
          <button
            type="button"
            disabled
            className="w-full py-2 bg-[#e6e8ea] text-[#76777d] text-[12px] font-bold tracking-wider rounded cursor-not-allowed border border-[#c6c6cd] uppercase"
          >
            {actuators.humidifier ? 'DESLIGAR' : 'LIGAR'}
          </button>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={() => handleAction('humidifier')}
            className={`w-full py-2 text-[12px] font-bold tracking-wider rounded border uppercase transition-all active:scale-[0.98] ${
              actuators.humidifier
                ? 'bg-[#ba1a1a] hover:bg-[#a01515] text-white border-[#ba1a1a]'
                : 'bg-[#0058be] hover:bg-[#004bb0] text-white border-[#0058be]'
            }`}
          >
            {actuators.humidifier ? 'DESLIGAR' : 'LIGAR'}
          </button>
        )}
      </div>
    </section>
  );
}
