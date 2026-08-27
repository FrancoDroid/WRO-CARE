const ESP32_BASE_URL = 'http://192.168.4.1';

export interface Esp32Status {
  temperature: number | null;
  humidity: number | null;
  sensor_ok: boolean;

  automatic: boolean;

  peltier: boolean;
  humidifier: boolean;
  heater: boolean;

  target_temp_min: number;
  target_temp_max: number;
  max_temp: number;

  target_humidity_min: number;
  target_humidity_max: number;

  peltier_pwm: number;
  humidifier_pwm: number;
}

async function request<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const controller = new AbortController();

  const timeout = window.setTimeout(() => {
    controller.abort();
  }, 3000);

  try {
    const response = await fetch(
      `${ESP32_BASE_URL}${endpoint}`,
      {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `ESP32 HTTP ${response.status}`,
      );
    }

    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function getStatus(): Promise<Esp32Status> {
  return request<Esp32Status>('/api/status');
}

export async function setMode(
  automatic: boolean,
) {
  return request('/api/mode', {
    method: 'POST',
    body: JSON.stringify({
      automatic,
    }),
  });
}

export async function setPeltier(
  on: boolean,
) {
  return request('/api/peltier', {
    method: 'POST',
    body: JSON.stringify({
      on,
    }),
  });
}

export async function setHumidifier(
  on: boolean,
) {
  return request('/api/humidifier', {
    method: 'POST',
    body: JSON.stringify({
      on,
    }),
  });
}

export async function setHeater(
  on: boolean,
) {
  return request('/api/heater', {
    method: 'POST',
    body: JSON.stringify({
      on,
    }),
  });
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

export async function setSettings(
  settings: Esp32Settings,
) {
  return request('/api/settings', {
    method: 'POST',
    body: JSON.stringify(settings),
  });
}
