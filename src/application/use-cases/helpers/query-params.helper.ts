import type { IGetManyQueryDto } from '@application/dtos/common';
import type { TPresetType } from '@shared/presets';

const RESERVED_KEYS = new Set([
  'preset',
  'limit',
  'page',
  'orderBy',
  'filter',
  'requiredIds',
]);

const DEFAULT_PRESET: TPresetType = 'BASE';

function deepParseJson(value: unknown): unknown {
  if (value === undefined || value === null) return value;

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === 'true') return true;
    if (trimmed === 'false') return false;

    const looksLikeJson =
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'));

    if (looksLikeJson) {
      try {
        return deepParseJson(JSON.parse(trimmed));
      } catch {
        return value;
      }
    }
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(deepParseJson);
  }

  if (typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value)) {
      result[key] = deepParseJson(item);
    }
    return result;
  }

  return value;
}

function parseJsonObject(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== 'string' || value.trim() === '') return undefined;
  try {
    const parsed: unknown = JSON.parse(value);
    return parsed !== null &&
      typeof parsed === 'object' &&
      !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : undefined;
  } catch {
    return undefined;
  }
}

function parseOrderBy(
  value: unknown,
): Record<string, 'asc' | 'desc'> | undefined {
  const parsed = parseJsonObject(value);
  if (!parsed) return undefined;

  const result: Record<string, 'asc' | 'desc'> = {};
  for (const [key, direction] of Object.entries(parsed)) {
    if (direction === 'asc' || direction === 'desc') {
      result[key] = direction;
    }
  }
  return Object.keys(result).length > 0 ? result : undefined;
}

function parseStringArray(value: unknown): string[] | undefined {
  let source: unknown = value;

  if (typeof value === 'string' && value.trim() !== '') {
    try {
      source = JSON.parse(value) as unknown;
    } catch {
      return undefined;
    }
  }

  if (!Array.isArray(source)) return undefined;

  const result = source.filter(
    (item): item is string => typeof item === 'string',
  );
  return result.length > 0 ? result : undefined;
}

function toOptionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return Number.isNaN(value) ? undefined : value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

/**
 * Нормализует «плоский» HTTP query GET-запроса в DTO списка.
 *
 * Формат wire-протокола:
 * - служебные ключи: preset, limit, page, orderBy, requiredIds;
 * - значения сложных полей (orderBy, requiredIds, фильтры) передаются как JSON
 *   в одном ключе, напр. `?id={"value":["a","b"],"mode":"OR"}&orderBy={"name":"asc"}`;
 * - все остальные ключи трактуются как поля фильтра и собираются в `filter`.
 *
 * Дефолты limit/page намеренно не проставляются здесь — единый источник правды
 * остаётся в GetManyHelper.
 */
export function splitArrayQueryParams<TFilter = Record<string, unknown>>(
  query: Record<string, unknown>,
): IGetManyQueryDto<TFilter> {
  const explicitFilterRaw = parseJsonObject(query.filter);
  const explicitFilter =
    explicitFilterRaw && Object.keys(explicitFilterRaw).length > 0
      ? (deepParseJson(explicitFilterRaw) as Record<string, unknown>)
      : undefined;

  const inlineFilter: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(query)) {
    if (RESERVED_KEYS.has(key) || value === undefined || value === null) {
      continue;
    }
    const raw: unknown =
      Array.isArray(value) && value.length === 1 ? value[0] : value;
    inlineFilter[key] = deepParseJson(raw);
  }

  const mergedFilter = { ...explicitFilter, ...inlineFilter };
  const filter =
    Object.keys(mergedFilter).length > 0
      ? (mergedFilter as TFilter)
      : undefined;

  const presetRaw = query.preset;
  const preset =
    typeof presetRaw === 'string' && presetRaw.length > 0
      ? (presetRaw as TPresetType)
      : DEFAULT_PRESET;

  return {
    preset,
    limit: toOptionalNumber(query.limit),
    page: toOptionalNumber(query.page),
    orderBy: parseOrderBy(query.orderBy),
    requiredIds: parseStringArray(query.requiredIds),
    filter,
  };
}
