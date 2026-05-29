import { toDbWhere } from '@application/use-cases/helpers';
import { JournalFilterExtractor, type IJournalFiltersPreset } from '@shared/presets';

export function extractJournalDbWhere(
  filter: IJournalFiltersPreset | undefined | null,
): Record<string, unknown> | undefined {
  return toDbWhere(JournalFilterExtractor.extract(filter ?? undefined));
}
