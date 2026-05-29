import { toDbWhere } from '@application/use-cases/helpers';
import { UnitFilterExtractor, type IUnitFiltersPreset } from '@shared/presets';

export function extractUnitDbWhere(
  filter: IUnitFiltersPreset | undefined | null,
): Record<string, unknown> | undefined {
  return toDbWhere(UnitFilterExtractor.extract(filter ?? undefined));
}
