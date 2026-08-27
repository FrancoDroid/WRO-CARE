import { Edit2 } from 'lucide-react';
import { TelemetryData } from '../types';
import { playClickSound } from '../utils/audio';

interface TelemetryCardsProps {
  telemetry: TelemetryData;
  onEditTargets: () => void;
}

export function TelemetryCards({ telemetry, onEditTargets }: TelemetryCardsProps) {
  // Determine Temperature Status Badge
  const tempDiff = telemetry.temperature - telemetry.targetTemperature;
  let tempStatusText = 'IDEAL';
  let tempBadgeStyle = 'bg-[#6ffbbe] text-[#005236]';

  if (tempDiff > telemetry.tempTolerance) {
    tempStatusText = 'ALTA';
    tempBadgeStyle = 'bg-[#ffdad6] text-[#93000a]';
  } else if (tempDiff < -telemetry.tempTolerance) {
    tempStatusText = 'BAIXA';
    tempBadgeStyle = 'bg-[#d8e2ff] text-[#004395]';
  }

  // Determine Humidity Status Badge
  const humDiff = telemetry.humidity - telemetry.targetHumidity;
  let humStatusText = 'IDEAL';
  let humBadgeStyle = 'bg-[#6ffbbe] text-[#005236]';

  if (humDiff > telemetry.humidityTolerance) {
    humStatusText = 'ALTA';
    humBadgeStyle = 'bg-[#ffdad6] text-[#93000a]';
  } else if (humDiff < -telemetry.humidityTolerance) {
    humStatusText = 'BAIXA';
    humBadgeStyle = 'bg-[#d8e2ff] text-[#004395]';
  }

  // Format comma decimal for Brazilian/metric notation
  const formattedTemp = telemetry.temperature.toFixed(1).replace('.', ',');
  const formattedTargetTemp = telemetry.targetTemperature.toFixed(1);
  const formattedHum = Math.round(telemetry.humidity);
  const formattedTargetHum = Math.round(telemetry.targetHumidity);

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Temperature Card */}
      <div
        id="card-temperature"
        className="bg-white border border-[#c6c6cd] p-4 flex flex-col gap-2 relative rounded-sm shadow-xs transition-shadow hover:shadow-sm"
      >
        <div className="flex justify-between items-start">
          <span className="text-[12px] font-bold tracking-wider text-[#45464d] uppercase">
            TEMPERATURA
          </span>
          <span
            className={`text-[12px] font-bold tracking-wider px-2 py-0.5 rounded uppercase ${tempBadgeStyle}`}
          >
            {tempStatusText}
          </span>
        </div>

        <div className="font-mono-data text-4xl font-semibold text-[#131b2e] tracking-tight py-1">
          {formattedTemp} <span className="text-lg font-medium text-[#131b2e]">°C</span>
        </div>

        <div className="flex items-center justify-between text-sm text-[#45464d] pt-1">
          <span>Alvo: {formattedTargetTemp}°C</span>
          <button
            onClick={() => {
              playClickSound();
              onEditTargets();
            }}
            title="Ajustar Alvo de Temperatura"
            className="p-1 text-[#76777d] hover:text-[#0058be] hover:bg-[#f2f4f6] rounded transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Humidity Card */}
      <div
        id="card-humidity"
        className="bg-white border border-[#c6c6cd] p-4 flex flex-col gap-2 relative rounded-sm shadow-xs transition-shadow hover:shadow-sm"
      >
        <div className="flex justify-between items-start">
          <span className="text-[12px] font-bold tracking-wider text-[#45464d] uppercase">
            UMIDADE
          </span>
          <span
            className={`text-[12px] font-bold tracking-wider px-2 py-0.5 rounded uppercase ${humBadgeStyle}`}
          >
            {humStatusText}
          </span>
        </div>

        <div className="font-mono-data text-4xl font-semibold text-[#131b2e] tracking-tight py-1">
          {formattedHum} <span className="text-lg font-medium text-[#131b2e]">%</span>
        </div>

        <div className="flex items-center justify-between text-sm text-[#45464d] pt-1">
          <span>Alvo: {formattedTargetHum}%</span>
          <button
            onClick={() => {
              playClickSound();
              onEditTargets();
            }}
            title="Ajustar Alvo de Umidade"
            className="p-1 text-[#76777d] hover:text-[#0058be] hover:bg-[#f2f4f6] rounded transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
