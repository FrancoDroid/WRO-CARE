```ts
const ESP32_BASE_URL = "http://192.168.4.1";

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

export interface Esp32Settings {
  target_temp_min: number;
  target_temp_max: number;
  max_temp: number;

  target_humidity_min: number;
  target_humidity_max: number;

  peltier_pwm: number;
  humidifier_pwm: number;
}


// ======================================================
// URL DO ESP32
// ======================================================

export function getEsp32BaseUrl(): string {
  return ESP32_BASE_URL;
}


// ======================================================
// CLIENTE HTTP
// ======================================================

async function request<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(
    `${ESP32_BASE_URL}${endpoint}`,
    {
      ...options,

      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    },
  );

  if (!response.ok) {
    let message = `Erro HTTP ${response.status}`;

    try {
      const data = await response.json();

      if (data?.error) {
        message = data.error;
      }
    } catch {
      // Resposta não era JSON.
    }

    throw new Error(message);
  }

  return response.json();
}


// ======================================================
// GET /api/status
// ======================================================

export async function getEsp32Status(): Promise<Esp32Status> {
  return request<Esp32Status>("/api/status");
}


// ======================================================
// POST /api/mode
// ======================================================

export async function setAutomaticMode(
  automatic: boolean,
): Promise<Esp32Status> {
  const response = await request<{
    ok: boolean;
    status: Esp32Status;
  }>("/api/mode", {
    method: "POST",

    body: JSON.stringify({
      automatic,
    }),
  });

  return response.status;
}


// ======================================================
// POST /api/peltier
// ======================================================

export async function setPeltier(
  on: boolean,
): Promise<Esp32Status> {
  const response = await request<{
    ok: boolean;
    status: Esp32Status;
  }>("/api/peltier", {
    method: "POST",

    body: JSON.stringify({
      on,
    }),
  });

  return response.status;
}


// ======================================================
// POST /api/humidifier
// ======================================================

export async function setHumidifier(
  on: boolean,
): Promise<Esp32Status> {
  const response = await request<{
    ok: boolean;
    status: Esp32Status;
  }>("/api/humidifier", {
    method: "POST",

    body: JSON.stringify({
      on,
    }),
  });

  return response.status;
}


// ======================================================
// POST /api/heater
// ======================================================

export async function setHeater(
  on: boolean,
): Promise<Esp32Status> {
  const response = await request<{
    ok: boolean;
    status: Esp32Status;
  }>("/api/heater", {
    method: "POST",

    body: JSON.stringify({
      on,
    }),
  });

  return response.status;
}


// ======================================================
// POST /api/settings
// ======================================================

export async function updateEsp32Settings(
  settings: Esp32Settings,
): Promise<Esp32Status> {
  const response = await request<{
    ok: boolean;
    status: Esp32Status;
  }>("/api/settings", {
    method: "POST",

    body: JSON.stringify(settings),
  });

  return response.status;
}


// ======================================================
// TESTE DE CONEXÃO
// ======================================================

export async function checkEsp32Connection(): Promise<boolean> {
  try {
    await getEsp32Status();

    return true;
  } catch {
    return false;
  }
}
```
