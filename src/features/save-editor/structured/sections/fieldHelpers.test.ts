import { describe, expect, it } from 'vitest';
import newsaveFixture from '../../../../../tests/fixtures/save/newsave.json';
import pcFixture from '../../../../../tests/fixtures/save/pc.json';
import { parseNumericInput, resolveExistingPath } from './fieldHelpers';

describe('fieldHelpers', () => {
  it('parses scientific notation numeric input without truncating it', () => {
    expect(parseNumericInput('8.790842659264444e+248')).toBe(8.790842659264444e+248);
    expect(parseNumericInput('3.5')).toBe(3.5);
  });

  it('keeps the current value when a number input is temporarily incomplete', () => {
    expect(parseNumericInput('1e', 3.5)).toBe(3.5);
    expect(parseNumericInput('', 3.5)).toBe(3.5);
  });

  it('never replaces empty, invalid, or overflowing input with zero', () => {
    for (const value of ['', ' ', '1e', '1.5junk', '1e309', 'Infinity', '-Infinity']) {
      expect(Number.isNaN(parseNumericInput(value))).toBe(true);
    }
    expect(parseNumericInput('0')).toBe(0);
    expect(parseNumericInput('9.5')).toBe(9.5);
    expect(parseNumericInput('1e3')).toBe(1000);
  });

  it('resolves preferred paths when the newer schema key exists', () => {
    expect(resolveExistingPath(newsaveFixture, 'options.confirmations.resetReality', 'options.confirmations.reality')).toBe('options.confirmations.resetReality');
  });

  it('falls back when the preferred path does not exist', () => {
    expect(resolveExistingPath(pcFixture, 'records.recentInfinities', 'records.lastTenInfinities')).toBe('records.lastTenInfinities');
  });
});
