```tsx
import { useCallback, useEffect, useState } from 'react';

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
  Esp32Status,
  Esp32Settings,
} from './types';

import {
  getEsp32Status,
  setAutomaticMode,
  setPeltier,
  setHumidifier,
  setHeater,
  updateEsp32Settings,
  getEsp32BaseUrl,
} from './services/esp32Api';

function statusToTelemetry(status: Esp32Status): TelemetryData {
  return {
    temperature: status.temperature ?? 0,
    humidity: status.humidity ?? 0,

    targetTemperature:
      (status.target_temp_min + status.target_temp_max) / 2,

    targetHumidity:
      (status.target_humidity_min + status.target_humidity_max) / 2,

    targetTemperatureMin: status.target_temp_min,
    targetTemperatureMax: status.target_temp_max,
    maxTemperature: status.max_temp,

    targetHumidityMin: status.target_humidity_min,
    targetHumidityMax: status.target_humidity_max,

    peltierPwm: status.peltier_pwm,
    humidifierPwm: status.humidifier_pwm,

    timestamp: new Date(),
  };
}

function statusToActuators(status: Esp32Status): ActuatorState {
  return {
    peltier: status.peltier,
    resistance: status.heater,
    humidifier: status.humidifier,
  };
}

export default function App() {
  const [telemetry, setTelemetry] = useState<TelemetryData>({
    temperature: 0,
    humidity: 0,
    targetTemperature: 19,
    targetHumidity: 50,
    targetTemperatureMin: 18,
    targetTemperatureMax: 20,
    maxTemperature: 24,
    targetHumidityMin: 40,
    targetHumidityMax: 60,
    peltierPwm: 200,
    humidifierPwm: 180,
    timestamp: new Date(0),
  });

  const [mode, setMode] =
    useState<OperationMode>('AUTOMATICO');

  const [actuators, setActuators] =
    useState<ActuatorState>({
      peltier: false,
      resistance: false,
      humidifier: false,
    });

  const [connected, setConnected] =
    useState(false);

  const [sensorOk, setSensorOk] =
    useState(true);

  const [lastUpdateText, setLastUpdateText] =
    useState('Aguardando ESP32');

  const [history, setHistory] =
    useState<HistoryRecord[]>([]);

  const [metrics, setMetrics] =
    useState<Esp32Metrics>({
      connected: false,

      ip: getEsp32BaseUrl()
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, ''),

      rssi: 0,
      freeHeap: 0,
      uptimeSeconds: 0,
      voltage: 0,
      firmwareVersion: 'N/A',

      gpioPins: {
        peltier: 12,
        resistance: 26,
        humidifier: 13,
        tempSensor: 'SHT31 (0x44)',
        humiditySensor: 'SHT31 (0x44)',
      },
    });

  const [logs, setLogs] =
    useState<SystemLog[]>([]);

  const [historyOpen, setHistoryOpen] =
    useState(false);

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [diagnosticsOpen, setDiagnosticsOpen] =
    useState(false);

  const [emergencyModalOpen, setEmergencyModalOpen] =
    useState(false);

  const addLog = useCallback(
    (
      level: SystemLog['level'],
      message: string,
    ) => {
      const timestamp =
        new Date().toLocaleTimeString(
          'pt-BR',
          {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          },
        );

      setLogs((previous) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          timestamp,
          level,
          message,
        },
        ...previous.slice(0, 49),
      ]);
    },
    [],
  );

  const applyStatus = useCallback(
    (status: Esp32Status) => {
      setConnected(true);

      setSensorOk(
        status.sensor_ok !== false,
      );

      setMode(
        status.automatic
          ? 'AUTOMATICO'
          : 'MANUAL',
      );

      setActuators(
        statusToActuators(status),
      );

      const nextTelemetry =
        statusToTelemetry(status);

      setTelemetry(nextTelemetry);

      const now = Date.now();

      setHistory((previous) => [
        ...previous.slice(-59),

        {
          time:
            new Date(now).toLocaleTimeString(
              'pt-BR',
              {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              },
            ),

          timestampMs: now,

          temperature:
            status.temperature == null
              ? 0
              : Number(
                  status.temperature.toFixed(1),
                ),

          humidity:
            status.humidity == null
              ? 0
              : Number(
                  status.humidity.toFixed(1),
                ),

          targetTemperature:
            (
              status.target_temp_min +
              status.target_temp_max
            ) / 2,

          targetHumidity:
            (
              status.target_humidity_min +
              status.target_humidity_max
            ) / 2,

          peltier:
            status.peltier ? 1 : 0,

          resistance:
            status.heater ? 1 : 0,

          humidifier:
            status.humidifier ? 1 : 0,
        },
      ]);

      setMetrics((previous) => ({
        ...previous,
        connected: true,
      }));
    },
    [],
  );

  const fetchStatus = useCallback(
    async () => {
      try {
        const status =
          await getEsp32Status();

        applyStatus(status);
      } catch {
        setConnected(false);

        setMetrics((previous) => ({
          ...previous,
          connected: false,
        }));

        setLastUpdateText(
          'ESP32 offline',
        );
      }
    },
    [applyStatus],
  );

  useEffect(() => {
    fetchStatus();

    const interval =
      window.setInterval(
        fetchStatus,
        2000,
      );

    return () =>
      window.clearInterval(interval);
  }, [fetchStatus]);

  useEffect(() => {
    const timer =
      window.setInterval(() => {
        if (!connected) {
          setLastUpdateText(
            'ESP32 offline',
          );
          return;
        }

        const diff =
          Math.floor(
            (
              Date.now() -
              telemetry.timestamp.getTime()
            ) / 1000,
          );

        if (diff < 3) {
          setLastUpdateText('Agora');
        } else if (diff < 60) {
          setLastUpdateText(
            `há ${diff}s`,
          );
        } else {
          setLastUpdateText(
            telemetry.timestamp.toLocaleTimeString(
              'pt-BR',
              {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              },
            ),
          );
        }
      }, 1000);

    return () =>
      window.clearInterval(timer);
  }, [
    connected,
    telemetry.timestamp,
  ]);

  const handleSelectMode =
    async (
      newMode: OperationMode,
    ) => {
      if (!connected) {
        return;
      }

      try {
        await setAutomaticMode(
          newMode === 'AUTOMATICO',
        );

        await fetchStatus();

        addLog(
          'ACTION',
          `Modo alterado para ${newMode}.`,
        );
      } catch {
        addLog(
          'ERROR',
          'Não foi possível alterar o modo no ESP32.',
        );

        await fetchStatus();
      }
    };

  const handleToggleActuator =
    async (
      actuator: keyof ActuatorState,
    ) => {
      if (
        mode === 'AUTOMATICO' ||
        !connected ||
        !sensorOk
      ) {
        return;
      }

      const desired =
        !actuators[actuator];

      try {
        if (actuator === 'peltier') {
          await setPeltier(desired);
        }

        if (actuator === 'humidifier') {
          await setHumidifier(desired);
        }

        if (actuator === 'resistance') {
          await setHeater(desired);
        }

        await fetchStatus();
      } catch {
        addLog(
          'ERROR',
          'Falha ao enviar comando ao ESP32.',
        );

        await fetchStatus();
      }
    };

  const handleSaveSettings =
    async (
      settings: Esp32Settings,
    ) => {
      if (!connected) {
        addLog(
          'ERROR',
          'ESP32 offline. Não foi possível salvar.',
        );
        return;
      }

      try {
        await updateEsp32Settings(
          settings,
        );

        await fetchStatus();

        addLog(
          'ACTION',
          'Parâmetros enviados ao ESP32.',
        );
      } catch {
        addLog(
          'ERROR',
          'Falha ao salvar parâmetros no ESP32.',
        );

        await fetchStatus();
      }
    };

  const handleEmergencyStop =
    async () => {
      setEmergencyModalOpen(true);

      if (!connected) {
        addLog(
          'ERROR',
          'ESP32 offline. Não foi possível enviar parada.',
        );
        return;
      }

      try {
        await setPeltier(false);
        await setHumidifier(false);
        await setHeater(false);

        await setAutomaticMode(false);

        await fetchStatus();

        addLog(
          'ERROR',
          'Todos os atuadores foram desligados.',
        );
      } catch {
        addLog(
          'ERROR',
          'Falha ao executar parada de emergência.',
        );
      }
    };

  const handleResetEmergency =
    () => {
      setEmergencyModalOpen(false);
      fetchStatus();
    };

  return (
    <div className="bg-[#f7f9fb] text-[#191c1e] min-h-screen flex flex-col font-sans selection:bg-[#d8e2ff] selection:text-[#001a42]">

      <Header
        connected={connected}
        onRefreshConnection={fetchStatus}
        onOpenHistory={() =>
          setHistoryOpen(true)
        }
        onOpenSettings={() =>
          setSettingsOpen(true)
        }
        onOpenDiagnostics={() =>
          setDiagnosticsOpen(true)
        }
      />

      <main className="flex-grow px-4 md:px-8 pt-4 pb-36 max-w-4xl mx-auto w-full">

        <div className="space-y-6">

          <div className="flex justify-end items-center">
            <span
              id="lbl-update-time"
              className="text-sm font-normal text-[#45464d]"
            >
              Atualização: {lastUpdateText}
            </span>
          </div>

          <TelemetryCards
            telemetry={telemetry}
            onEditTargets={() =>
              setSettingsOpen(true)
            }
          />

          <OperationModeCard
            mode={mode}
            onSelectMode={handleSelectMode}
            disabled={
              !connected ||
              !sensorOk
            }
          />

          <ActuatorsGrid
            actuators={actuators}
            mode={mode}
            onToggleActuator={
              handleToggleActuator
            }
            disabled={
              !connected ||
              !sensorOk
            }
          />

        </div>
      </main>

      <EmergencyFooter
        onEmergencyStop={
          handleEmergencyStop
        }
        disabled={!connected}
      />

      <TelemetryHistoryModal
        isOpen={historyOpen}
        onClose={() =>
          setHistoryOpen(false)
        }
        history={history}
        targetTemp={
          telemetry.targetTemperature
        }
        targetHum={
          telemetry.targetHumidity
        }
        onClearHistory={() =>
          setHistory([])
        }
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() =>
          setSettingsOpen(false)
        }
        settings={{
          target_temp_min:
            telemetry.targetTemperatureMin,

          target_temp_max:
            telemetry.targetTemperatureMax,

          max_temp:
            telemetry.maxTemperature,

          target_humidity_min:
            telemetry.targetHumidityMin,

          target_humidity_max:
            telemetry.targetHumidityMax,

          peltier_pwm:
            telemetry.peltierPwm,

          humidifier_pwm:
            telemetry.humidifierPwm,
        }}
        onSave={handleSaveSettings}
      />

      <Esp32DiagnosticsModal
        isOpen={diagnosticsOpen}
        onClose={() =>
          setDiagnosticsOpen(false)
        }
        metrics={metrics}
        logs={logs}
      />

      <EmergencyAlertModal
        isOpen={emergencyModalOpen}
        onReset={
          handleResetEmergency
        }
      />

    </div>
  );
}
```
