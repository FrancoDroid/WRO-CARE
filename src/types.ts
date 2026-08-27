export type OperationMode = 'AUTOMATICO' | 'MANUAL';

export interface ActuatorState {
  peltier: boolean;
  resistance: boolean;
  humidifier: boolean;
}

export interface TelemetryData {
  temperature: number;
  humidity: number;
  targetTemperature: number;
  targetHumidity: number;
  tempTolerance: number;
  humidityTolerance: number;
  timestamp: Date;
}

export interface HistoryRecord {
  time: string;
  timestampMs: number;
  temperature: number;
  humidity: number;
  targetTemperature: number;
  targetHumidity: number;
  peltier: number; // 1 or 0 for chart
  resistance: number;
  humidifier: number;
}

export interface Esp32Metrics {
  connected: boolean;
  ip: string;
  rssi: number;
  freeHeap: number;
  uptimeSeconds: number;
  voltage: number;
  firmwareVersion: string;
  gpioPins: {
    peltier: number;
    resistance: number;
    humidifier: number;
    tempSensor: string;
    humiditySensor: string;
  };
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'ACTION';
  message: string;
}
