import { getValueAtPath } from '../document/path';
import { isJsonObject, JsonValue, SaveArray, SaveObject, SaveType } from '../model';
import { resolveRegisteredFieldPath } from './fields';

export type RecentRecordsFieldId = 'recordsRecentInfinities' | 'recordsRecentEternities' | 'recordsRecentRealities';

const resetDecimal = (value: JsonValue | undefined, amount: number): JsonValue => (
  isJsonObject(value) ? { ...value, mantissa: amount, exponent: 0 }
    : typeof value === 'number' ? amount : String(amount)
);

/** Defaults follow the pinned player's record layouts; future trailing data stays untouched. */
export const getClearedRecentRecords = (
  data: SaveObject,
  fieldId: RecentRecordsFieldId,
  saveType: SaveType,
): SaveArray => {
  const path = resolveRegisteredFieldPath(data, fieldId, saveType);
  const records = getValueAtPath(data, path);
  if (!Array.isArray(records)) throw new Error('Recent records must be an existing array.');
  const isReality = fieldId === 'recordsRecentRealities';
  const isEternity = fieldId === 'recordsRecentEternities';
  const modern = path.startsWith('records.recent');
  const defaults: SaveArray = modern
    ? [Number.MAX_VALUE, Number.MAX_VALUE, '1', isReality ? 1 : '1', '', ...(isEternity ? ['0'] : isReality ? [0, 0] : [])]
    : [Number.MAX_VALUE, '1', isReality ? 1 : '1', Number.MAX_VALUE];

  return records.map((record: JsonValue, index: number) => {
    if (index >= 10) return record;
    if (Array.isArray(record)) {
      const next = [...record];
      defaults.forEach((value, column) => {
        next[column] = typeof value === 'string' && value !== ''
          ? resetDecimal(record[column], Number(value)) : value;
      });
      return next;
    }
    if (isJsonObject(record)) {
      return {
        ...record,
        time: Number.MAX_VALUE,
        realTime: Number.MAX_VALUE,
        currencyGain: resetDecimal(record.currencyGain, 1),
        prestigeCountGain: resetDecimal(record.prestigeCountGain, 1),
        challenge: '',
        ...(isEternity ? { gainedTP: resetDecimal(record.gainedTP, 0) } : {}),
        ...(isReality ? { glyphLevel: 0, shards: 0 } : {}),
      };
    }
    throw new Error('Each recent record must be an array or an object.');
  });
};
