import { hasPath } from '../../../../domain/save/document/path';
import { parseFiniteDecimal } from '../../../../shared/utils/parseFiniteDecimal';

export const parseNumericInput = (value: string, fallback = Number.NaN): number => {
  if (!value.trim()) {
    return fallback;
  }

  const parsed = parseFiniteDecimal(value);
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
