/**
 * JSON codec used by the editor-facing JSON surfaces.
 *
 * The upstream save format reserves the exact string "Infinity" for positive
 * infinity. That makes a literal string with this value ambiguous when it is
 * parsed with the shared reviver, so editor serialization rejects it instead
 * of silently changing its type on a round trip.
 */

export const EDITOR_INFINITY_MARKER = 'Infinity' as const;

export type EditorJsonReplacer = (key: string, value: unknown) => unknown;
export type EditorJsonReviver = (key: string, value: unknown) => unknown;
export type EditorJsonSpace = number | string;

const reservedInfinityStringError = (): TypeError => {
  return new TypeError(
    `The string value "${EDITOR_INFINITY_MARKER}" is reserved for positive infinity and cannot be serialized as a literal string.`,
  );
};

/** Shared JSON replacer for Infinity and Set values at the JSON boundary. */
export const editorJsonReplacer: EditorJsonReplacer = (_key, value) => {
  if (value === EDITOR_INFINITY_MARKER) {
    throw reservedInfinityStringError();
  }

  if (value === Number.POSITIVE_INFINITY) {
    return EDITOR_INFINITY_MARKER;
  }

  if (value instanceof Set) {
    return Array.from(value.keys());
  }

  return value;
};

/** Shared reviver matching the upstream Infinity marker convention. */
export const editorJsonReviver: EditorJsonReviver = (_key, value) => {
  return value === EDITOR_INFINITY_MARKER ? Number.POSITIVE_INFINITY : value;
};

/**
 * Serialize an editor value using upstream-compatible special values.
 *
 * `space` is passed directly to JSON.stringify so callers can choose compact
 * or formatted editor text. Values which JSON cannot represent are rejected
 * with a TypeError instead of returning an unexpected undefined result.
 */
export const stringifyEditorJson = (value: unknown, space?: EditorJsonSpace): string => {
  const serialized = JSON.stringify(value, editorJsonReplacer, space);

  if (serialized === undefined) {
    throw new TypeError('The value cannot be represented as JSON.');
  }

  return serialized;
};

/** Parse editor JSON and revive upstream's reserved Infinity marker. */
export const parseEditorJson = <T = unknown>(text: string): T => {
  return JSON.parse(text, editorJsonReviver) as T;
};
