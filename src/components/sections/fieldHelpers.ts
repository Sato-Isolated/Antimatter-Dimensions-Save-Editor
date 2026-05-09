import { hasPath } from '../../core/document/path';

export const parseNumericInput = (value: string, fallback = 0): number => {
  if (!value.trim()) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const resolveRecentRecordsPath = (
  saveData: unknown,
  series: 'Infinities' | 'Eternities' | 'Realities'
): string => {
  const recentPath = `records.recent${series}`;
  return hasPath(saveData, recentPath) ? recentPath : `records.lastTen${series}`;
};

export const resolveExistingPath = (
  saveData: unknown,
  preferredPath: string,
  fallbackPath: string
): string => {
  return hasPath(saveData, preferredPath) ? preferredPath : fallbackPath;
};