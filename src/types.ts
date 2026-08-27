export type OperationMode = 'AUTOMATICO' | 'MANUAL';

export interface ActuatorState {
  peltier: boolean;
  resistance: boolean;
  humidifier: boolean;
}

export interface Esp32Settings {
  target_temp_min: number;
  target_temp_max: number;
  max_temp: number;
  target_humidity_min: number;
  target_humidity_max: number;
  peltier_pwm: number;
  humidifier_pwm: number;
}

export interface Esp32Status extends Esp32Settings {
  temperature: number;
  humidity: number;
  automatic: boolean;
  peltier: boolean;
  humidifier: boolean;
  heater: boolean;
  sensor_ok?: boolean;
}

export interface TelemetryData {
  temperature: number;
  humidity: number;
  targetTemperature: number;
  targetHumidity: number;
  targetTemperatureMin: number;
  targetTemperatureMax: number;
  maxTemperature: number;
  targetHumidityMin: number;
  targetHumidityMax: number;
  peltierPwm: number;
  humidifierPwm: number;
  timestamp: Date;
}

export interface HistoryRecord {
  time: string;
  timestampMs: number;
  temperature: number;
  humidity: number;
  targetTemperature: number;
  targetHumidity: number;
  peltier: number;
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
