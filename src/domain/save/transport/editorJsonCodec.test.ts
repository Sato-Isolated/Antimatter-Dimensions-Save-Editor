import { describe, expect, it } from 'vitest';
import {
  EDITOR_INFINITY_MARKER,
  parseEditorJson,
  stringifyEditorJson,
} from './editorJsonCodec';

describe('editor JSON codec', () => {
  it('serializes and revives positive Infinity with the upstream marker', () => {
    const source = {
      current: Number.POSITIVE_INFINITY,
      nested: { values: [1, Number.POSITIVE_INFINITY] },
    };

    const serialized = stringifyEditorJson(source);
    const parsed = parseEditorJson<typeof source>(serialized);

    expect(serialized).toBe('{"current":"Infinity","nested":{"values":[1,"Infinity"]}}');
    expect(serialized).not.toContain('null');
    expect(parsed.current).toBe(Number.POSITIVE_INFINITY);
    expect(parsed.nested.values[1]).toBe(Number.POSITIVE_INFINITY);
  });

  it('serializes Sets as arrays and leaves arrays at the JSON boundary', () => {
    const source = {
      upgrades: new Set(['a', 'b']),
      nested: { ids: new Set([1, 2, 3]) },
    };

    const serialized = stringifyEditorJson(source);
    const parsed = parseEditorJson<{ upgrades: string[]; nested: { ids: number[] } }>(serialized);

    expect(serialized).toBe('{"upgrades":["a","b"],"nested":{"ids":[1,2,3]}}');
    expect(parsed).toEqual({ upgrades: ['a', 'b'], nested: { ids: [1, 2, 3] } });
    expect(parsed.upgrades).not.toBeInstanceOf(Set);
  });

  it('preserves ordinary strings and rejects the reserved Infinity string', () => {
    expect(parseEditorJson<string>('"ordinary text"')).toBe('ordinary text');
    expect(() => stringifyEditorJson({ label: EDITOR_INFINITY_MARKER })).toThrow(
      'reserved for positive infinity',
    );
    expect(() => stringifyEditorJson(['safe', EDITOR_INFINITY_MARKER])).toThrow(
      'cannot be serialized as a literal string',
    );
  });

  it('handles nested objects, Sets, and Infinity values together', () => {
    const source = {
      outer: {
        entries: [
          { amount: Number.POSITIVE_INFINITY },
          { values: new Set([Number.POSITIVE_INFINITY, 'finite']) },
        ],
      },
    };

    const parsed = parseEditorJson<{
      outer: { entries: Array<{ amount?: number; values?: Array<number | string> }> };
    }>(stringifyEditorJson(source, 2));

    expect(parsed.outer.entries[0].amount).toBe(Number.POSITIVE_INFINITY);
    expect(parsed.outer.entries[1].values).toEqual([Number.POSITIVE_INFINITY, 'finite']);
  });

  it('propagates invalid JSON errors to callers', () => {
    expect(() => parseEditorJson('{"missing":')).toThrow(SyntaxError);
  });
});
