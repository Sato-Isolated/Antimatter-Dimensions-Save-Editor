import { describe, expect, it, vi } from 'vitest';
import { copyTextToClipboard } from './clipboard';

describe('copyTextToClipboard', () => {
  it('passes the generated save to the clipboard writer', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);

    await copyTextToClipboard('encoded-save', writeText);

    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText).toHaveBeenCalledWith('encoded-save');
  });
});
