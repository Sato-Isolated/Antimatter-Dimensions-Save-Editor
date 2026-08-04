export type ClipboardWriter = (text: string) => Promise<void>;

export const copyTextToClipboard = async (
  text: string,
  writeText: ClipboardWriter = (value) => navigator.clipboard.writeText(value),
): Promise<void> => {
  await writeText(text);
};
