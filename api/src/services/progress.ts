export interface Progress { totalRecorded: number; percent: number; }

// Integer scaling avoids binary floating-point ties (for example 50.05%).
export const calculateProgress = (target: number, quantities: number[]): Progress => {
  const totalRecorded = quantities.reduce((total, quantity) => total + quantity, 0);
  if (target <= 0) return { totalRecorded, percent: 0 };
  const raw = Math.min(100, (totalRecorded / target) * 100);
  const percent = Math.floor((raw + Number.EPSILON) * 10 + 0.5) / 10;
  return { totalRecorded, percent };
};
