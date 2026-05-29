export const SEED_PASSWORD_HASH =
  '$2b$10$0wOMlqe02H1UCVKsMrH7wOBrTq58RRLuPu/s1NoLKmuI3i4yIz4pK';

export function seedUuid(prefix: number, sequence: number): string {
  return `${String(prefix).padStart(8, '0')}-0000-4000-8000-${String(sequence).padStart(12, '0')}`;
}
