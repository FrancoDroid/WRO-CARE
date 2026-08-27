import { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { TelemetryCards } from './components/TelemetryCards';
import { OperationModeCard } from './components/OperationModeCard';
import { ActuatorsGrid } from './components/ActuatorsGrid';
import { EmergencyFooter } from './components/EmergencyFooter';
import { TelemetryHistoryModal } from './components/TelemetryHistoryModal';
import { SettingsModal } from './components/SettingsModal';
import { Esp32DiagnosticsModal } from './components/Esp32DiagnosticsModal';
import { EmergencyAlertModal } from './components/EmergencyAlertModal';
import {
  OperationMode,
  ActuatorState,
  TelemetryData,
  HistoryRecord,
  Esp32Metrics,
  SystemLog,
} from './types';

export default function App() {
  // 1. Core Environmental Telemetry State (Initialized to match screenshot)
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    temperature: 22.4,
    humidity: 58,
    targetTemperature: 22.0,
    targetHumidity: 50,
    tempTolerance: 0.3,
    humidityTolerance: 4,
    timestamp: new Date(),
  });

  // 2. Operation Mode ('AUTOMATICO' as in screenshot)
  const [mode, setMode] = useState<OperationMode>('AUTOMATICO');

  // 3. Actuators State (Resistance ON, Peltier OFF, Humidifier OFF as in screenshot)
  const [actuators, setActuators] = useState<ActuatorState>({
    peltier: false,
    resistance: true,
    humidifier: false,
  });

  // 4. Hardware / Network Connection State
  const [connected, setConnected] = useState<boolean>(true);
  const [emergencyStopped, setEmergencyStopped] = useState<boolean>(false);
  const [lastUpdateText, setLastUpdateText] = useState<string>('Agora');

  // 5. Historical Data for Graphing
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    // Seed initial 15 points leading up to current screenshot state
    const now = Date.now();
    const initialPoints: HistoryRecord[] = [];
    for (let i = 15; i >= 0; i--) {
      const timeDate = new Date(now - i * 3000);
      const timeStr = timeDate.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      const t = 21.6 + (0.8 * (15 - i)) / 15 + (Math.random() * 0.1 - 0.05);
      const h = 57 + Math.sin(i / 2) * 2;
      initialPoints.push({
        time: timeStr,
        timestampMs: timeDate.getTime(),
        temperature: Number(t.toFixed(1)),
        humidity: Math.round(h),
        targetTemperature: 22.0,
        targetHumidity: 50,
        peltier: 0,
        resistance: 1,
        humidifier: 0,
      });
    }
    return initialPoints;
  });

  // 6. ESP32 Hardware Diagnostics & Serial Logs
  const [metrics, setMetrics] = useState<Esp32Metrics>({
    connected: true,
    ip: '192.168.1.104',
    rssi: -58,
    freeHeap: 184.6,
    uptimeSeconds: 14280,
    voltage: 3.31,
    firmwareVersion: '1.4.2-rel',
    gpioPins: {
      peltier: 18,
      resistance: 19,
      humidifier: 21,
      tempSensor: 'SHT31 (0x44)',
      humiditySensor: 'SHT31 (0x44)',
    },
  });

  const [logs, setLogs] = useState<SystemLog[]>([
    {
      id: 'log-1',
      timestamp: '11:58:10',
      level: 'INFO',
      message: 'ESP32 booted successfully. Firmware v1.4.2-rel.',
    },
    {
      id: 'log-2',
      timestamp: '11:58:12',
      level: 'INFO',
      message: 'I2C Sensor SHT31 detected on address 0x44.',
    },
    {
      id: 'log-3',
      timestamp: '11:59:01',
      level: 'ACTION',
      message: 'Auto-regulation loop started. Target: 22.0°C / 50% UR.',
    },
    {
      id: 'log-4',
      timestamp: '11:59:30',
      level: 'WARN',
      message: 'Temp (21.7°C) below target. Activating Resistance (GPIO 19).',
    },
  ]);

  // Modal Controls
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);

  // Helper to add system log
  const addLog = useCallback((level: SystemLog['level'], message: string) => {
    const timeStr = new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setLogs((prev) => [
      {
        id: `log-${Date.now()}-${Math.random()}`,
        timestamp: timeStr,
        level,
        message,
      },
      ...prev.slice(0, 49),
    ]);
  }, []);

  // References for live simulation step
  const telemetryRef = useRef(telemetry);
  telemetryRef.current = telemetry;
  const actuatorsRef = useRef(actuators);
  actuatorsRef.current = actuators;
  const modeRef = useRef(mode);
  modeRef.current = mode;
  const connectedRef = useRef(connected);
  connectedRef.current = connected;
  const emergencyRef = useRef(emergencyStopped);
  emergencyRef.current = emergencyStopped;

  // 7. Simulation Loop Engine (Runs every 1.5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!connectedRef.current || emergencyRef.current) {
        return;
      }

      const curTel = telemetryRef.current;
      const curAct = actuatorsRef.current;
      const curMode = modeRef.current;

      // Physics model calculation:
      // Thermal step
      let deltaTemp = 0;
      if (curAct.resistance) deltaTemp += 0.08;
      if (curAct.peltier) deltaTemp -= 0.09;
      // Ambient dissipation towards 23.5°C
      const ambientTemp = 23.5;
      deltaTemp += (ambientTemp - curTel.temperature) * 0.015;
      // Small sensor jitter
      const jitterT = (Math.random() - 0.5) * 0.04;
      const nextTemp = Math.max(10, Math.min(45, curTel.temperature + deltaTemp + jitterT));

      // Humidity step
      let deltaHum = 0;
      if (curAct.humidifier) deltaHum += 0.8;
      if (curAct.peltier) deltaHum -= 0.3; // cooling condensation
      // Ambient dissipation towards 55%
      const ambientHum = 55;
      deltaHum += (ambientHum - curTel.humidity) * 0.015;
      const jitterH = (Math.random() - 0.5) * 0.2;
      const nextHum = Math.max(15, Math.min(95, curTel.humidity + deltaHum + jitterH));

      // Automatic ESP32 Regulation Logic
      let nextActuators = { ...curAct };

      if (curMode === 'AUTOMATICO') {
        const tDiff = nextTemp - curTel.targetTemperature;
        const hDiff = nextHum - curTel.targetHumidity;

        // Temperature regulation
        if (tDiff < -curTel.tempTolerance) {
          // Cold -> Turn on Resistance, Turn off Peltier
          if (!curAct.resistance || curAct.peltier) {
            nextActuators.resistance = true;
            nextActuators.peltier = false;
            addLog('ACTION', `ESP32 Auto: Temp baixa (${nextTemp.toFixed(1)}°C). Ligando Resistência.`);
          }
        } else if (tDiff > curTel.tempTolerance) {
          // Hot -> Turn on Peltier, Turn off Resistance
          if (!curAct.peltier || curAct.resistance) {
            nextActuators.peltier = true;
            nextActuators.resistance = false;
            addLog('ACTION', `ESP32 Auto: Temp alta (${nextTemp.toFixed(1)}°C). Ligando Peltier.`);
          }
        } else {
          // Inside deadband -> Turn both off once stabilized
          if (Math.abs(tDiff) < 0.1 && (curAct.peltier || curAct.resistance)) {
            nextActuators.peltier = false;
            nextActuators.resistance = false;
            addLog('INFO', `ESP32 Auto: Temp ideal (${nextTemp.toFixed(1)}°C). Atuadores térmicos em repouso.`);
          }
        }

        // Humidity regulation
        if (hDiff < -curTel.humidityTolerance) {
          if (!curAct.humidifier) {
            nextActuators.humidifier = true;
            addLog('ACTION', `ESP32 Auto: Umidade baixa (${Math.round(nextHum)}%). Ligando Humidificador.`);
          }
        } else if (hDiff > curTel.humidityTolerance) {
          if (curAct.humidifier) {
            nextActuators.humidifier = false;
            addLog('INFO', `ESP32 Auto: Umidade alta (${Math.round(nextHum)}%). Desligando Humidificador.`);
          }
        }
      }

      setActuators(nextActuators);
      setTelemetry((prev) => ({
        ...prev,
        temperature: nextTemp,
        humidity: nextHum,
        timestamp: new Date(),
      }));

      // Append historical telemetry point
      const timeStr = new Date().toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setHistory((prev) => [
        ...prev.slice(-39),
        {
          time: timeStr,
          timestampMs: Date.now(),
          temperature: Number(nextTemp.toFixed(1)),
          humidity: Math.round(nextHum),
          targetTemperature: curTel.targetTemperature,
          targetHumidity: curTel.targetHumidity,
          peltier: nextActuators.peltier ? 1 : 0,
          resistance: nextActuators.resistance ? 1 : 0,
          humidifier: nextActuators.humidifier ? 1 : 0,
        },
      ]);

      // Update metrics uptime
      setMetrics((prev) => ({
        ...prev,
        uptimeSeconds: prev.uptimeSeconds + 1,
      }));
    }, 1500);

    return () => clearInterval(interval);
  }, [addLog]);

  // Relative timestamp "Atualização: Agora" logic
  useEffect(() => {
    const updateTimer = setInterval(() => {
      const diffSec = Math.floor(
        (Date.now() - telemetry.timestamp.getTime()) / 1000
      );
      if (diffSec < 3) {
        setLastUpdateText('Agora');
      } else if (diffSec < 60) {
        setLastUpdateText(`há ${diffSec}s`);
      } else {
        setLastUpdateText(
          telemetry.timestamp.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        );
      }
    }, 1000);
    return () => clearInterval(updateTimer);
  }, [telemetry.timestamp]);

  // Handle toggling manual actuators
  const handleToggleActuator = (actuator: keyof ActuatorState) => {
    if (mode === 'AUTOMATICO' || emergencyStopped) return;
    setActuators((prev) => {
      const nextState = !prev[actuator];
      addLog(
        'ACTION',
        `Comando Manual: ${actuator.toUpperCase()} ${nextState ? 'LIGADO' : 'DESLIGADO'}`
      );
      return {
        ...prev,
        [actuator]: nextState,
      };
    });
  };

  // Handle Operation Mode selection
  const handleSelectMode = (newMode: OperationMode) => {
    setMode(newMode);
    addLog('INFO', `Modo alterado para ${newMode}.`);
  };

  // Handle Emergency Stop
  const handleEmergencyStop = () => {
    setEmergencyStopped(true);
    setActuators({
      peltier: false,
      resistance: false,
      humidifier: false,
    });
    setMode('MANUAL');
    setEmergencyModalOpen(true);
    addLog(
      'ERROR',
      'PARADA DE EMERGÊNCIA DISPARADA: Todos os relés foram desligados!'
    );
  };

  // Reset Emergency state
  const handleResetEmergency = () => {
    setEmergencyStopped(false);
    setEmergencyModalOpen(false);
    addLog('INFO', 'Sistema desarmado da parada de emergência.');
  };

  // Toggle Hardware / Wi-Fi connection simulation
  const handleToggleConnection = () => {
    setConnected((prev) => {
      const next = !prev;
      addLog(
        next ? 'INFO' : 'WARN',
        next ? 'Conexão Wi-Fi ESP32 restabelecida.' : 'Conexão com ESP32 perdida.'
      );
      setMetrics((m) => ({ ...m, connected: next }));
      return next;
    });
  };

  // Environmental disturbance injector
  const handleInjectDisturbance = (type: 'HEAT' | 'COLD' | 'HUMID' | 'DRY') => {
    setTelemetry((prev) => {
      let t = prev.temperature;
      let h = prev.humidity;
      if (type === 'HEAT') t += 3.0;
      if (type === 'COLD') t -= 3.0;
      if (type === 'HUMID') h += 15;
      if (type === 'DRY') h -= 15;
      return {
        ...prev,
        temperature: Number(t.toFixed(1)),
        humidity: Math.max(10, Math.min(95, Math.round(h))),
        timestamp: new Date(),
      };
    });
    addLog(
      'WARN',
      `Perturbação ambiental injetada: ${type}`
    );
  };

  // Save new targets
  const handleSaveTargets = (targets: {
    targetTemperature: number;
    targetHumidity: number;
    tempTolerance: number;
    humidityTolerance: number;
  }) => {
    setTelemetry((prev) => ({
      ...prev,
      ...targets,
    }));
    addLog(
      'INFO',
      `Novos alvos configurados: Temp ${targets.targetTemperature.toFixed(1)}°C, Umid ${targets.targetHumidity}%`
    );
  };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col font-sans selection:bg-[#d8e2ff] selection:text-[#001a42]">
      {/* Top App Bar / Header */}
      <Header
        connected={connected}
        onToggleConnection={handleToggleConnection}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenDiagnostics={() => setDiagnosticsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-grow px-4 md:px-8 pt-4 pb-36 max-w-4xl mx-auto w-full">
        <div className="space-y-6">
          {/* Last Update Info Tag (Aligned Right as in Screenshot) */}
          <div className="flex justify-end items-center">
            <span
              id="lbl-update-time"
              className="text-sm font-normal text-[#45464d]"
            >
              Atualização: {lastUpdateText}
            </span>
          </div>

          {/* Environmental Telemetry Cards (Temperature & Humidity) */}
          <TelemetryCards
            telemetry={telemetry}
            onEditTargets={() => setSettingsOpen(true)}
          />

          {/* Operation Mode (Automatic / Manual) */}
          <OperationModeCard
            mode={mode}
            onSelectMode={handleSelectMode}
            disabled={!connected || emergencyStopped}
          />

          {/* Actuators Control Grid (Peltier, Resistance, Humidifier) */}
          <ActuatorsGrid
            actuators={actuators}
            mode={mode}
            onToggleActuator={handleToggleActuator}
            disabled={!connected || emergencyStopped}
          />
        </div>
      </main>

      {/* Fixed Emergency Shutdown Footer Bar */}
      <EmergencyFooter
        onEmergencyStop={handleEmergencyStop}
        disabled={!connected}
      />

      {/* Modal Dialogs */}
      <TelemetryHistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        targetTemp={telemetry.targetTemperature}
        targetHum={telemetry.targetHumidity}
        onClearHistory={() => setHistory([])}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        targetTemp={telemetry.targetTemperature}
        targetHum={telemetry.targetHumidity}
        tempTolerance={telemetry.tempTolerance}
        humTolerance={telemetry.humidityTolerance}
        onSave={handleSaveTargets}
        onInjectDisturbance={handleInjectDisturbance}
      />

      <Esp32DiagnosticsModal
        isOpen={diagnosticsOpen}
        onClose={() => setDiagnosticsOpen(false)}
        metrics={metrics}
        logs={logs}
      />

      <EmergencyAlertModal
        isOpen={emergencyModalOpen}
        onReset={handleResetEmergency}
      />
    </div>
  );
}
