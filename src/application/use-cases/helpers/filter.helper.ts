export function toDbWhere(
  where: Record<string, unknown>,
): Record<string, unknown> | undefined {
  return Object.keys(where).length > 0 ? where : undefined;
}
