const FILE_SIZE_UNITS = ['KB', 'MB', 'GB', 'TB'] as const;

export function formatFileSize(bytes: number): string {
  let size = bytes / 1024;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < FILE_SIZE_UNITS.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${FILE_SIZE_UNITS[unitIndex]}`;
}