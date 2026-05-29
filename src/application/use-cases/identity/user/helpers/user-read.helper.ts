import { toDbWhere } from '@application/use-cases/helpers';
import { UserFilterExtractor, type IUserFiltersPreset } from '@shared/presets';

export function extractUserDbWhere(
  filter: IUserFiltersPreset | undefined | null,
): Record<string, unknown> | undefined {
  return toDbWhere(UserFilterExtractor.extract(filter ?? undefined));
}
