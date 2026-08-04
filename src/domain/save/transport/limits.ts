/**
 * Resource limits applied before Base64 decoding/decompression and after
 * inflation. They protect the browser from accidental or hostile zip-bomb
 * inputs without changing the game's wire format.
 */
export const SAVE_TRANSPORT_LIMITS = {
  maxEncodedCharacters: 4_000_000,
  maxCompressedBytes: 3_000_000,
  maxInflatedBytes: 16_000_000,
} as const;
