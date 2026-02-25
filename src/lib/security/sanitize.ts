export function sanitizeText(input: string) {
  return input
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function sanitizeMultiline(input: string) {
  return input
    .replace(/[<>]/g, '')
    .replace(/\r/g, '')
    .trim();
}
