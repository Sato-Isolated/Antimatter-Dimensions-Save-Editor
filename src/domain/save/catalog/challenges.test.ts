import { describe, expect, it } from 'vitest';
import {
  challengeBitMask,
  clearKnownChallenges,
  completeKnownChallenges,
  infinityChallengeBits,
  isChallengeBitSet,
  normalChallengeBits,
  setChallengeBit,
} from './challenges';

describe('upstream challenge bitfields', () => {
  it('uses the upstream one-based bit indexes and known masks', () => {
    expect(normalChallengeBits[0]).toMatchObject({ id: 1, bitIndex: 1 });
    expect(infinityChallengeBits[0]).toMatchObject({ id: 1, bitIndex: 1 });
    expect(challengeBitMask(normalChallengeBits)).toBe(8190);
    expect(challengeBitMask(infinityChallengeBits)).toBe(510);
  });

  it('exposes the in-game meaning, rewards, and Infinity goals for each bit', () => {
    expect(normalChallengeBits).toHaveLength(12);
    expect(normalChallengeBits.every((definition) => definition.description && definition.reward)).toBe(true);
    expect(infinityChallengeBits).toHaveLength(8);
    expect(infinityChallengeBits.every((definition) => definition.description && definition.reward && definition.goal)).toBe(true);
    expect(infinityChallengeBits[1]).toMatchObject({
      label: 'Infinity Challenge 2',
      goal: '1e10500 Antimatter',
    });
  });

  it('toggles individual challenges without changing other bits', () => {
    const source = 2 ** 1 + 2 ** 7;
    const challengeThree = normalChallengeBits[2];

    expect(isChallengeBitSet(source, normalChallengeBits[0])).toBe(true);
    expect(isChallengeBitSet(source, normalChallengeBits[2])).toBe(false);
    expect(setChallengeBit(source, challengeThree, true)).toBe(source + 2 ** 3);
    expect(setChallengeBit(source, normalChallengeBits[0], false)).toBe(2 ** 7);
  });

  it('completes only known challenges and preserves unknown bits', () => {
    const unknownBit = 2 ** 20;
    const completed = completeKnownChallenges(unknownBit, infinityChallengeBits);

    expect(completed).toBe(unknownBit + 510);
    expect(clearKnownChallenges(completed, infinityChallengeBits)).toBe(unknownBit);
  });
});
