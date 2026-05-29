export const SEED_PASSWORD_HASH =
  '$2b$10$SD/OzAHjDbZvykdyFGZqt.WPKx11BUUmKh/NbsPTF5BR111reIlti';

export function seedUuid(prefix: number, sequence: number): string {
  return `${String(prefix).padStart(8, '0')}-0000-4000-8000-${String(sequence).padStart(12, '0')}`;
}
