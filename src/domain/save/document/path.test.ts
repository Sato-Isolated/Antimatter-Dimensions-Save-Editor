import { describe, expect, it } from 'vitest';
import { appendDocumentPath, getValueAtPath, hasPath, setValueAtPath, tokenizeDocumentPath } from './path';

describe('literal object keys in document paths', () => {
  it('creates a literal __proto__ property without changing object prototypes', () => {
    const source = { future: {} };
    const updated = setValueAtPath(source, 'future.__proto__.value', 2);
    expect(Object.getPrototypeOf(updated.future)).toBe(Object.prototype);
    expect(Object.prototype.hasOwnProperty.call(updated.future, '__proto__')).toBe(true);
    expect(JSON.stringify(updated)).toBe('{"future":{"__proto__":{"value":2}}}');
    expect(hasPath(source, 'future.__proto__')).toBe(false);
    expect(getValueAtPath(source, 'future.__proto__')).toBeUndefined();
  });

  it('does not read inherited properties as save data', () => {
    expect(hasPath({}, 'toString')).toBe(false);
    expect(getValueAtPath({}, 'constructor')).toBeUndefined();
  });
  it.each(['a.b', 'a[0]', 'a"b', 'a\\b', '', '0', '__proto__', 'é'])('reads and updates the exact key %j', (key) => {
    const source = { future: Object.fromEntries([[key, 1]]), untouched: { value: 4 } };
    const path = appendDocumentPath('future', key);
    expect(tokenizeDocumentPath(path)).toEqual(['future', key]);
    expect(getValueAtPath(source, path)).toBe(1);
    expect(hasPath(source, path)).toBe(true);
    const updated = setValueAtPath(source, path, 2);
    expect(updated.future[key]).toBe(2);
    expect(Object.keys(updated.future)).toHaveLength(1);
    expect(source.future[key]).toBe(1);
    expect(updated.untouched).toBe(source.untouched);
  });
});
