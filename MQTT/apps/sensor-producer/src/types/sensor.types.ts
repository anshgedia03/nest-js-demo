export type TemperaturePayload = {
  sensorId: string;
  celsius: number;
  unit?: 'C';
  recordedAt?: string;
};

export type SmokePayload = {
  sensorId: string;
  ppm: number;
  severity: 'medium' | 'high';
  reportedAt?: string;
};

export type FireAlertPayload = {
  sensorId: string;
  zone: string;
  level: 'critical' | 'evacuate';
  triggeredAt?: string;
};

export type SensorStatusPayload = {
  state: 'online' | 'offline' | 'maintenance';
  battery?: number;
  updatedAt?: string;
};
