import { describe, expect, it } from 'vitest';
import newsaveFixture from '../../../newsave.json';
import pcFixture from '../../../pc.json';
import { parseNumericInput, resolveExistingPath, resolveRecentRecordsPath } from './fieldHelpers';

describe('fieldHelpers', () => {
  it('parses scientific notation numeric input without truncating it', () => {
    expect(parseNumericInput('8.790842659264444e+248')).toBe(8.790842659264444e+248);
    expect(parseNumericInput('3.5')).toBe(3.5);
  });

  it('resolves recent record paths for newer PC saves', () => {
    expect(resolveRecentRecordsPath(newsaveFixture, 'Infinities')).toBe('records.recentInfinities');
    expect(resolveRecentRecordsPath(newsaveFixture, 'Eternities')).toBe('records.recentEternities');
    expect(resolveRecentRecordsPath(newsaveFixture, 'Realities')).toBe('records.recentRealities');
  });

  it('falls back to legacy lastTen record paths for older PC saves', () => {
    expect(resolveRecentRecordsPath(pcFixture, 'Infinities')).toBe('records.lastTenInfinities');
    expect(resolveRecentRecordsPath(pcFixture, 'Eternities')).toBe('records.lastTenEternities');
    expect(resolveRecentRecordsPath(pcFixture, 'Realities')).toBe('records.lastTenRealities');
  });

  it('resolves preferred paths when the newer schema key exists', () => {
    expect(resolveExistingPath(newsaveFixture, 'options.confirmations.resetReality', 'options.confirmations.reality')).toBe('options.confirmations.resetReality');
  });

  it('falls back when the preferred path does not exist', () => {
    expect(resolveExistingPath(pcFixture, 'records.recentInfinities', 'records.lastTenInfinities')).toBe('records.lastTenInfinities');
  });
});