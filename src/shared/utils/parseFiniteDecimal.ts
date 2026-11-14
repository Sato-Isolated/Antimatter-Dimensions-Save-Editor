const decimalPattern = /^([+-]?)(\d*)(?:\.(\d*))?(?:e([+-]?\d+))?$/iu;

const canonicalDecimal = (value: string): string | undefined => {
  const match = decimalPattern.exec(value.trim());
  if (!match || !(match[2] || match[3])) return undefined;
  const digits = (match[2] + (match[3] ?? '')).replace(/^0+/u, '');
  if (!digits) return '0';
  const significant = digits.replace(/0+$/u, '');
  const exponent = BigInt(match[4] ?? '0') - BigInt(match[3]?.length ?? 0)
    + BigInt(digits.length - significant.length);
  return `${match[1] === '-' ? '-' : ''}${significant}e${exponent}`;
};

/** Reject rounding, underflow and overflow instead of silently changing input. */
export const parseFiniteDecimal = (input: string): number => {
  const parsed = Number(input);
  const canonical = canonicalDecimal(input);
  return canonical !== undefined && Number.isFinite(parsed) && canonical === canonicalDecimal(String(parsed))
    ? parsed : Number.NaN;
};
