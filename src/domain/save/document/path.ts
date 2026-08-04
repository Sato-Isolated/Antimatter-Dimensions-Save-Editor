import { DocumentPath } from '../model';

type PathToken = string | number;

const PATH_TOKEN_PATTERN = /([^.[\]]+)|\[(\d+)\]/g;

const isObjectRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const createContainerForToken = (token: PathToken): unknown => {
  return typeof token === 'number' ? [] : {};
};

const cloneContainer = (value: unknown, nextToken?: PathToken): unknown => {
  if (Array.isArray(value)) {
    return [...value];
  }

  if (isObjectRecord(value)) {
    return { ...value };
  }

  if (nextToken === undefined) {
    return {};
  }

  return createContainerForToken(nextToken);
};

export const tokenizeDocumentPath = (path: DocumentPath): PathToken[] => {
  if (!path) {
    return [];
  }

  const tokens: PathToken[] = [];
  let match: RegExpExecArray | null;

  while ((match = PATH_TOKEN_PATTERN.exec(path)) !== null) {
    if (match[1]) {
      tokens.push(match[1]);
      continue;
    }

    if (match[2]) {
      tokens.push(Number.parseInt(match[2], 10));
    }
  }

  return tokens;
};

export const getValueAtPath = <T = unknown>(source: unknown, path: DocumentPath): T | undefined => {
  if (!path) {
    return source as T;
  }

  const tokens = tokenizeDocumentPath(path);
  let current: unknown = source;

  for (const token of tokens) {
    if (current === null || current === undefined) {
      return undefined;
    }

    current = (current as Record<string, unknown>)[token as keyof typeof current];
  }

  return current as T;
};

export const hasPath = (source: unknown, path: DocumentPath): boolean => {
  if (!path) {
    return source !== undefined;
  }

  const tokens = tokenizeDocumentPath(path);
  let current: unknown = source;

  for (const token of tokens) {
    if (current === null || current === undefined) {
      return false;
    }

    if (typeof token === 'number') {
      if (!Array.isArray(current) || token >= current.length) {
        return false;
      }
      current = current[token];
      continue;
    }

    if (!isObjectRecord(current) || !(token in current)) {
      return false;
    }

    current = current[token];
  }

  return true;
};

export const setValueAtPath = <T>(source: T, path: DocumentPath, value: unknown): T => {
  if (!path) {
    return value as T;
  }

  const tokens = tokenizeDocumentPath(path);
  if (tokens.length === 0) {
    return value as T;
  }

  const update = (currentValue: unknown, depth: number): unknown => {
    const token = tokens[depth];
    const nextToken = tokens[depth + 1];
    const container = cloneContainer(currentValue, token) as Record<string | number, unknown> | unknown[];

    if (depth === tokens.length - 1) {
      (container as Record<string | number, unknown>)[token] = value;
      return container;
    }

    const existingChild = currentValue !== null && currentValue !== undefined
      ? (currentValue as Record<string | number, unknown>)[token]
      : undefined;

    const baseChild = existingChild === undefined
      ? createContainerForToken(nextToken)
      : existingChild;

    (container as Record<string | number, unknown>)[token] = update(baseChild, depth + 1);
    return container;
  };

  return update(source, 0) as T;
};
