export interface Progress { totalRecorded: number; percent: number; }

// Normalize the computed decimal before scaling: binary arithmetic can otherwise
// turn an exact decimal tie (for example 0.09 / 0.80 = 11.25%) into 11.249999….
export const calculateProgress = (target: number, quantities: number[]): Progress => {
  const totalRecorded = quantities.reduce((total, quantity) => total + quantity, 0);
  if (target <= 0) return { totalRecorded, percent: 0 };
  const raw = Math.min(100, (totalRecorded / target) * 100);
  const normalizedRaw = Number(raw.toFixed(12));
  const percent = Math.floor(normalizedRaw * 10 + 0.5) / 10;
  return { totalRecorded, percent };
};
