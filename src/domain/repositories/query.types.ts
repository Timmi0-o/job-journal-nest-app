/**
 * Конфигурация для включения связанных данных
 */
export type IncludeOption =
  | boolean
  | { select?: string[]; include?: Record<string, IncludeOption> };

/**
 * Базовые опции для запроса (независимо от ORM)
 */
export type QuerySelect<T> = (keyof T)[] | undefined;

/**
 * Опции для вложенного include (рекурсивно)
 * Поддерживает Prisma-like синтаксис: { role: { include: { permissions: true } } }
 */
export type NestedIncludeOption =
  | boolean
  | {
      select?: string[];
      include?: Record<string, NestedIncludeOption>;
    };

/**
 * Include с типизацией отношений
 * R - тип Relations для конкретной сущности (содержит реальные типы relations)
 * Поддерживает вложенные include для глубоких relations
 */
//eslint-disable-next-line @typescript-eslint/no-unused-vars
export type QueryInclude<T, R> =
  | {
      [K in keyof R]?: NestedIncludeOption;
    }
  | undefined;

/**
 * Опции запроса - ORM агностичны
 * T - тип сущности
 * R - тип Relations (содержит реальные типы relations)
 */
export type FindOptions<T, R> = {
  select?: QuerySelect<T>;
  include?: QueryInclude<T, R>;
};

/**
 * Результат prepareLocalRequestData / prepareExternalRequestData
 * Расширяет FindOptions полями filter и orderBy
 */
export interface ILocalQueryResult<T, R> extends FindOptions<T, R> {
  filter?: Record<string, unknown>;
  orderBy?: Record<string, 'asc' | 'desc'>;
}

/**
 * Условный тип для Select:
 * Если передан select -> Pick<T, выбранные_поля>
 * Иначе -> T
 */
export type ApplySelect<T, S extends QuerySelect<T>> = S extends (keyof T)[]
  ? Pick<T, S[number]>
  : T;

/**
 * Условный тип для Include:
 * Берёт реальные типы из R (Relations interface)
 *
 * T - базовый тип сущности
 * I - переданные include опции (например { roles: true })
 * R - Relations interface с реальными типами (например { roles: IRole[] })
 */
export type ApplyInclude<T, I, R> =
  I extends Record<string, unknown>
    ? T & {
        [K in keyof I]: K extends keyof R ? R[K] : never;
      }
    : T;

/**
 * Итоговый тип результата:
 * Комбинирует Select и Include
 * T - тип сущности
 * S - select опции
 * I - include опции
 * R - Relations тип (содержит реальные типы relations)
 */
export type QueryResult<
  T,
  S extends QuerySelect<T> = undefined,
  I = undefined,
  R = Record<string, unknown>,
> = S extends (keyof T)[]
  ? I extends Record<string, unknown>
    ? Pick<T, S[number]> & ApplyInclude<Record<string, never>, I, R> // select + include
    : Pick<T, S[number]> // только select
  : I extends Record<string, unknown>
    ? ApplyInclude<T, I, R> // только include
    : T;

/**
 * Тип для преобразования Select в Prisma формат
 */
export type SelectToPrismaFormat<
  S extends readonly (string | number | symbol)[] | undefined,
> = S extends readonly (infer K extends string | number | symbol)[]
  ? Record<K, true>
  : undefined;

/**
 * Helper для type-safe маппинга результата из ORM в domain тип
 * Используется на границе infrastructure -> domain
 */
export function mapQueryResult<
  T,
  S extends QuerySelect<T> = undefined,
  I = undefined,
  R = Record<string, IncludeOption>,
>(result: unknown): QueryResult<T, S, I, R> | null {
  return result as QueryResult<T, S, I, R> | null;
}
