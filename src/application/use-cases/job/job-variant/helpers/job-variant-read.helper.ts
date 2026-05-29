import { toDbWhere } from '@application/use-cases/helpers';
import { JobVariantFilterExtractor, type IJobVariantFiltersPreset } from '@shared/presets';

export function extractJobVariantDbWhere(
  filter: IJobVariantFiltersPreset | undefined | null,
): Record<string, unknown> | undefined {
  return toDbWhere(JobVariantFilterExtractor.extract(filter ?? undefined));
}
