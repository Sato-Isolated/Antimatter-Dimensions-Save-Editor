export interface ChallengeBitDefinition {
  readonly id: number;
  readonly bitIndex: number;
  readonly label: string;
  readonly description: string;
  readonly reward?: string;
  readonly goal?: string;
}

const createChallengeBits = (
  count: number,
  labelFor: (id: number) => string,
  descriptionFor: (id: number) => string,
  rewardFor?: (id: number) => string | undefined,
  goalFor?: (id: number) => string | undefined,
): readonly ChallengeBitDefinition[] => Array.from({ length: count }, (_, index) => {
  const id = index + 1;

  return {
    id,
    // Upstream deliberately uses 1-based challenge ids as bit indexes; bit 0 is unused.
    bitIndex: id,
    label: labelFor(id),
    description: descriptionFor(id),
    reward: rewardFor?.(id),
    goal: goalFor?.(id),
  };
});

export const normalChallengeBits: readonly ChallengeBitDefinition[] = createChallengeBits(12, (id) => {
  const names = [
    '1st Antimatter Dimension Autobuyer',
    '2nd Antimatter Dimension Autobuyer',
    '3rd Antimatter Dimension',
    '4th Antimatter Dimension Autobuyer',
    '5th Antimatter Dimension Autobuyer',
    '6th Antimatter Dimension Autobuyer',
    '7th Antimatter Dimension Autobuyer',
    '8th Antimatter Dimension Autobuyer',
    'Tickspeed Autobuyer',
    'Automated Dimension Boosts',
    'Automated Antimatter Galaxies',
    'Automated Big Crunches',
  ];

  return names[id - 1] ?? `Normal Challenge ${id}`;
}, (id) => {
  const descriptions = [
    'Reach Infinity for the first time.',
    'Buying Antimatter Dimensions or Tickspeed upgrades halts production temporarily.',
    'The 1st Antimatter Dimension is weakened but gains an uncapped exponential multiplier.',
    'Buying an Antimatter Dimension erases all lower-tier Antimatter Dimensions.',
    'The Tickspeed purchase multiplier starts lower than normal.',
    'Antimatter Dimension upgrades cost dimensions two tiers below instead of antimatter.',
    'The multiplier from buying 10 Antimatter Dimensions is reduced and scales with Dimension Boosts.',
    'Dimension Boosts provide no multiplier and Antimatter Galaxies cannot be bought.',
    'Buying Tickspeed upgrades or 10 dimensions advances the next cost step for equal-cost items.',
    'Only six Antimatter Dimensions are available; Dimension Boost and Galaxy costs change.',
    'Normal matter rises and can trigger Dimension Boosts without granting their bonus.',
    'Each Antimatter Dimension produces the dimension two tiers below it; several dimensions are adjusted.',
  ];

  return descriptions[id - 1] ?? `Normal Challenge ${id} rules.`;
}, (id) => [
  'Upgradeable 1st Antimatter Dimension Autobuyer',
  'Upgradeable 2nd Antimatter Dimension Autobuyer',
  'Upgradeable 3rd Antimatter Dimension Autobuyer',
  'Upgradeable 4th Antimatter Dimension Autobuyer',
  'Upgradeable 5th Antimatter Dimension Autobuyer',
  'Upgradeable 6th Antimatter Dimension Autobuyer',
  'Upgradeable 7th Antimatter Dimension Autobuyer',
  'Upgradeable 8th Antimatter Dimension Autobuyer',
  'Upgradeable Tickspeed Autobuyer',
  'Dimension Boosts Autobuyer',
  'Antimatter Galaxies Autobuyer',
  'Big Crunches Autobuyer',
][id - 1]);

export const infinityChallengeBits: readonly ChallengeBitDefinition[] = createChallengeBits(
  8,
  (id) => `Infinity Challenge ${id}`,
  (id) => {
    const descriptions = [
      'All Normal Challenge restrictions are active except Tickspeed (C9) and Big Crunch (C12).',
      'Dimensional Sacrifice happens automatically every 400 ms once the 8th Antimatter Dimension exists.',
      'Tickspeed upgrades are always 1x; purchases instead grant a multiplier based on Tickspeed and Galaxies.',
      "Only the latest bought Antimatter Dimension produces normally; all others produce less.",
      'Buying Antimatter Dimensions increases costs in the opposite half of the dimension tiers.',
      'Rising matter divides all Antimatter Dimension multipliers once the 2nd Antimatter Dimension exists.',
      'Antimatter Galaxies cannot be bought; the base Dimension Boost multiplier is increased up to 10x.',
      'Antimatter Dimension production continually drops; buying a dimension or Tickspeed resets the drop.',
    ];

    return descriptions[id - 1] ?? `Infinity Challenge ${id} rules.`;
  },
  (id) => [
    '1.3x on all Infinity Dimensions for each completed Infinity Challenge.',
    'Dimensional Sacrifice autobuyer and a stronger Dimensional Sacrifice.',
    'Antimatter Dimension multiplier based on Antimatter Galaxies and Tickspeed purchases.',
    'All Antimatter Dimension multipliers become 1.05x.',
    'Galaxies are 10% stronger and reduce Galaxy/Dimension Boost requirements by 1.',
    'Infinity Dimension multiplier based on Tickspeed.',
    'Dimension Boost multiplier has a minimum of 4x.',
    'Multiplier to Antimatter Dimensions 2–7 based on 1st and 8th Dimension multipliers.',
  ][id - 1],
  (id) => [
    '1e650 Antimatter',
    '1e10500 Antimatter',
    '1e5000 Antimatter',
    '1e13000 Antimatter',
    '1e16500 Antimatter',
    '2e22222 Antimatter',
    '1e10000 Antimatter',
    '1e27000 Antimatter',
  ][id - 1],
);

export const getChallengeDefinition = (
  definitions: readonly ChallengeBitDefinition[],
  id: number,
): ChallengeBitDefinition | undefined => definitions.find((definition) => definition.id === id);

const isValidBitfield = (value: unknown): value is number => {
  return typeof value === 'number' && Number.isSafeInteger(value) && value >= 0;
};

export const normalizeChallengeBitfield = (value: unknown): number => {
  return isValidBitfield(value) ? value : 0;
};

const bitWeight = (definition: ChallengeBitDefinition): number => 2 ** definition.bitIndex;

export const challengeBitMask = (definitions: readonly ChallengeBitDefinition[]): number => {
  return definitions.reduce((mask, definition) => mask + bitWeight(definition), 0);
};

export const isChallengeBitSet = (
  value: unknown,
  definition: ChallengeBitDefinition,
): boolean => {
  const bit = bitWeight(definition);
  return Math.floor(normalizeChallengeBitfield(value) / bit) % 2 === 1;
};

export const setChallengeBit = (
  value: unknown,
  definition: ChallengeBitDefinition,
  completed: boolean,
): number => {
  const normalized = normalizeChallengeBitfield(value);
  const current = isChallengeBitSet(normalized, definition);

  if (current === completed) {
    return normalized;
  }

  return completed ? normalized + bitWeight(definition) : normalized - bitWeight(definition);
};

export const completeKnownChallenges = (
  value: unknown,
  definitions: readonly ChallengeBitDefinition[],
): number => definitions.reduce(
  (bitfield, definition) => setChallengeBit(bitfield, definition, true),
  normalizeChallengeBitfield(value),
);

export const clearKnownChallenges = (
  value: unknown,
  definitions: readonly ChallengeBitDefinition[],
): number => definitions.reduce(
  (bitfield, definition) => setChallengeBit(bitfield, definition, false),
  normalizeChallengeBitfield(value),
);
