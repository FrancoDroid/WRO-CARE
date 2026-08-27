import { X, Download, TrendingUp, RefreshCw } from 'lucide-react';
import { HistoryRecord } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';

interface TelemetryHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryRecord[];
  targetTemp: number;
  targetHum: number;
  onClearHistory: () => void;
}

export function TelemetryHistoryModal({
  isOpen,
  onClose,
  history,
  targetTemp,
  targetHum,
  onClearHistory,
}: TelemetryHistoryModalProps) {
  if (!isOpen) return null;

  // Calculate statistics
  const temps = history.map((h) => h.temperature);
  const hums = history.map((h) => h.humidity);

  const minTemp = temps.length ? Math.min(...temps).toFixed(1) : '0';
  const maxTemp = temps.length ? Math.max(...temps).toFixed(1) : '0';
  const avgTemp = temps.length ? (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1) : '0';

  const minHum = hums.length ? Math.min(...hums).toFixed(0) : '0';
  const maxHum = hums.length ? Math.max(...hums).toFixed(0) : '0';
  const avgHum = hums.length ? (hums.reduce((a, b) => a + b, 0) / hums.length).toFixed(0) : '0';

  const exportCSV = () => {
    const headers = 'Timestamp,Hora,Temperatura (°C),Umidade (%),Alvo Temp (°C),Alvo Umid (%),Peltier,Resistência,Humidificador\n';
    const rows = history
      .map(
        (h) =>
          `${h.timestampMs},"${h.time}",${h.temperature},${h.humidity},${h.targetTemperature},${h.targetHumidity},${h.peltier},${h.resistance},${h.humidifier}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `telemetria_esp32_care_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-md border border-[#c6c6cd] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#c6c6cd] flex items-center justify-between bg-[#f7f9fb]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#0058be]" />
            <h3 className="text-lg font-bold text-[#191c1e]">
              Histórico de Telemetria Ambiental
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Quick Metrics summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#f2f4f6] p-3 rounded border border-[#e0e3e5]">
              <span className="text-[11px] font-bold text-[#45464d] uppercase block">Temp Média</span>
              <span className="text-xl font-bold font-mono-data text-[#131b2e]">{avgTemp} °C</span>
              <span className="text-[11px] text-[#76777d] block">Min: {minTemp}° / Max: {maxTemp}°</span>
            </div>
            <div className="bg-[#f2f4f6] p-3 rounded border border-[#e0e3e5]">
              <span className="text-[11px] font-bold text-[#45464d] uppercase block">Umidade Média</span>
              <span className="text-xl font-bold font-mono-data text-[#131b2e]">{avgHum} %</span>
              <span className="text-[11px] text-[#76777d] block">Min: {minHum}% / Max: {maxHum}%</span>
            </div>
            <div className="bg-[#f2f4f6] p-3 rounded border border-[#e0e3e5]">
              <span className="text-[11px] font-bold text-[#45464d] uppercase block">Alvos Atuais</span>
              <span className="text-base font-semibold font-mono-data text-[#0058be] block">
                {targetTemp.toFixed(1)}°C / {targetHum}%
              </span>
              <span className="text-[11px] text-[#76777d]">Parâmetros ESP32</span>
            </div>
            <div className="bg-[#f2f4f6] p-3 rounded border border-[#e0e3e5]">
              <span className="text-[11px] font-bold text-[#45464d] uppercase block">Amostras Registradas</span>
              <span className="text-xl font-bold font-mono-data text-[#131b2e]">{history.length}</span>
              <span className="text-[11px] text-[#76777d]">Frequência: 1Hz</span>
            </div>
          </div>

          {/* Chart 1: Temperature Curve */}
          <div className="bg-white p-4 rounded border border-[#c6c6cd]">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-[#191c1e] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" /> Curva de Temperatura (°C)
              </h4>
              <span className="text-xs text-[#76777d]">Alvo: {targetTemp}°C (Linha tracejada)</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e3e5" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#76777d" />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11 }} stroke="#76777d" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#c6c6cd', fontSize: '12px' }}
                    formatter={(val: number) => [`${val.toFixed(1)} °C`, 'Temperatura']}
                  />
                  <ReferenceLine y={targetTemp} stroke="#0058be" strokeDasharray="4 4" label={{ value: 'Alvo', fill: '#0058be', fontSize: 11 }} />
                  <Line type="monotone" dataKey="temperature" stroke="#ba1a1a" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Humidity Curve */}
          <div className="bg-white p-4 rounded border border-[#c6c6cd]">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-[#191c1e] uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0058be]" /> Curva de Umidade Relativa (%)
              </h4>
              <span className="text-xs text-[#76777d]">Alvo: {targetHum}% (Linha tracejada)</span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e3e5" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} stroke="#76777d" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="#76777d" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#c6c6cd', fontSize: '12px' }}
                    formatter={(val: number) => [`${val.toFixed(0)} %`, 'Umidade']}
                  />
                  <ReferenceLine y={targetHum} stroke="#009668" strokeDasharray="4 4" label={{ value: 'Alvo', fill: '#009668', fontSize: 11 }} />
                  <Line type="monotone" dataKey="humidity" stroke="#0058be" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#c6c6cd] bg-[#f7f9fb] flex items-center justify-between">
          <button
            onClick={onClearHistory}
            className="px-3 py-1.5 text-xs text-[#ba1a1a] hover:bg-[#ffdad6] rounded border border-[#ba1a1a]/30 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Limpar Histórico
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="px-4 py-1.5 text-xs font-bold text-[#0058be] bg-[#d8e2ff] hover:bg-[#adc6ff] rounded border border-[#0058be]/30 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar CSV
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#191c1e] hover:bg-black rounded transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
