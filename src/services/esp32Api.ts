import { Esp32Status, Esp32Settings } from '../types';

const ESP32_BASE_URL =
  import.meta.env.VITE_ESP32_BASE_URL || 'http://192.168.1.104';

const REQUEST_TIMEOUT_MS = 2500;

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();

  const timeout = window.setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${ESP32_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!response.ok) {
      throw new Error(
        `ESP32 HTTP ${response.status} ${response.statusText}`,
      );
    }

    return (await response.json()) as T;
  } finally {
    window.clearTimeout(timeout);
  }
}

async function postJson<TResponse = unknown>(
  path: string,
  body: unknown,
): Promise<TResponse> {
  return request<TResponse>(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function getEsp32Status(): Promise<Esp32Status> {
  return request<Esp32Status>('/api/status');
}

export async function setAutomaticMode(
  automatic: boolean,
): Promise<Esp32Status> {
  const response = await postJson<{ status?: Esp32Status }>(
    '/api/mode',
    { automatic },
  );

  return response.status || getEsp32Status();
}

export async function setPeltier(
  on: boolean,
): Promise<Esp32Status> {
  const response = await postJson<{ status?: Esp32Status }>(
    '/api/peltier',
    { on },
  );

  return response.status || getEsp32Status();
}

export async function setHumidifier(
  on: boolean,
): Promise<Esp32Status> {
  const response = await postJson<{ status?: Esp32Status }>(
    '/api/humidifier',
    { on },
  );

  return response.status || getEsp32Status();
}

export async function setHeater(
  on: boolean,
): Promise<Esp32Status> {
  const response = await postJson<{ status?: Esp32Status }>(
    '/api/heater',
    { on },
  );

  return response.status || getEsp32Status();
}

export async function updateEsp32Settings(
  settings: Esp32Settings,
): Promise<Esp32Status> {
  const response = await postJson<{ status?: Esp32Status }>(
    '/api/settings',
    settings,
  );

  return response.status || getEsp32Status();
}

export function getEsp32BaseUrl(): string {
  return ESP32_BASE_URL;
}
