/**
 * Базовые типы для конфигурации presets и nested includes
 */

export type NestedIncludeBase = {
  select?: string[];
};

export type NestedIncludeWithRelations<T> = NestedIncludeBase & {
  include?: T;
};

export type PresetConfig<TEntity, TInclude = undefined> = {
  select?: (keyof TEntity)[];
} & (TInclude extends undefined ? object : { include?: TInclude });
