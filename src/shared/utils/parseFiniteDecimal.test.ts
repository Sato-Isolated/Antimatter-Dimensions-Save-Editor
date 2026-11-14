import { describe, expect, it } from 'vitest';
import { parseFiniteDecimal } from './parseFiniteDecimal';

describe('parseFiniteDecimal', () => {
  it.each(['9.5', '12.1', '-0.01', '1e3', '8.790842659264444e248', '.5', '+1.20', '0e9999', '-0'])
    ('accepts representable decimal input %s', (input) => {
      expect(Object.is(parseFiniteDecimal(input), Number(input))).toBe(true);
    });
  it.each(['', ' ', '.', '1e', '1.2junk', '0x10', 'Infinity', 'NaN', '1e309', '1e-9999',
    '9007199254740993', '9.007199254740993e15', '0.10000000000000000001'])
    ('rejects invalid or lossy numeric conversion %s', (input) => {
      expect(Number.isNaN(parseFiniteDecimal(input))).toBe(true);
    });
});
