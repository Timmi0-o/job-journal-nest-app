import {
  FindOptions,
  mapQueryResult,
  QueryInclude,
  QueryResult,
  QuerySelect,
} from '../../../domain/repositories/query.types';

/**
 * Базовый абстрактный класс для всех репозиториев
 * Инкапсулирует общую логику работы с Prisma
 *
 * @template TEntity - Тип сущности в domain слое
 * @template TRelations - Тип relations для сущности
 * @template TPrismaDelegate - Тип Prisma delegate (например, PrismaService['role'])
 * @template TPrismaService - Тип Prisma сервиса
 */
export abstract class BaseRepository<
  TEntity,
  TRelations = Record<string, boolean>,
  TPrismaDelegate = unknown,
  TPrismaService = unknown,
> {
  /**
   * Транзакционный клиент (если операция выполняется в транзакции)
   * Устанавливается через setTransactionClient
   */
  private transactionClient: TPrismaService | null = null;

  constructor(protected readonly prisma: TPrismaService) {}

  /**
   * Установить транзакционный клиент для выполнения операций в транзакции
   * @param txClient - Транзакционный Prisma клиент
   */
  setTransactionClient(txClient: TPrismaService | null): void {
    this.transactionClient = txClient;
  }

  /**
   * Получить текущий Prisma клиент (транзакционный или обычный)
   */
  protected getPrismaClient(): TPrismaService {
    return this.transactionClient ?? this.prisma;
  }

  /**
   * Получить Prisma delegate для конкретной модели
   * Должен быть реализован в наследнике
   * Использует getPrismaClient() для получения правильного клиента (транзакционного или обычного)
   */
  protected abstract getDelegate(): TPrismaDelegate;

  /**
   * Подготовить аргументы для Prisma findUnique/findFirst
   * Преобразует наши domain типы в формат Prisma
   *
   * ВАЖНО: Prisma не позволяет использовать select и include одновременно.
   * Если переданы оба - объединяем их в единый select.
   */
  protected prepareFindArgs<
    S extends QuerySelect<TEntity>,
    I extends QueryInclude<TEntity, TRelations>,
  >(
    where: Record<string, unknown>,
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
    },
  ): {
    where: Record<string, unknown>;
    select?: Record<string, boolean | object>;
    include?: QueryInclude<TEntity, TRelations>;
  } {
    // Если есть и select, и include - объединяем в единый select (Prisma requirement)
    if (options?.select && options?.include) {
      return {
        where,
        select: this.mergeSelectAndInclude(options.select, options.include),
      };
    }

    return {
      where,
      ...(options?.select && {
        select: this.prepareSelect(options.select),
      }),
      ...(options?.include && {
        include: this.prepareInclude(options.include) as QueryInclude<
          TEntity,
          TRelations
        >,
      }),
    };
  }

  /**
   * Подготовить аргументы для Prisma findMany
   * Преобразует наши domain типы в формат Prisma
   */
  protected prepareFindManyArgs<
    S extends QuerySelect<TEntity>,
    I extends QueryInclude<TEntity, TRelations>,
  >(
    where?: Record<string, unknown>,
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
      take?: number;
      skip?: number;
      orderBy?: Record<string, 'asc' | 'desc'>;
    },
  ): {
    where?: Record<string, unknown>;
    select?: Record<string, boolean | object>;
    include?: QueryInclude<TEntity, TRelations>;
    take?: number;
    skip?: number;
    orderBy?: Record<string, 'asc' | 'desc'>;
  } {
    // Если есть и select, и include - объединяем в единый select
    if (options?.select && options?.include) {
      return {
        ...(where && { where }),
        select: this.mergeSelectAndInclude(options.select, options.include),
        ...(options?.take && { take: options.take }),
        ...(options?.skip && { skip: options.skip }),
        ...(options?.orderBy && { orderBy: options.orderBy }),
      };
    }

    return {
      ...(where && { where }),
      ...(options?.select && {
        select: this.prepareSelect(options.select),
      }),
      ...(options?.include && {
        include: this.prepareInclude(options.include) as QueryInclude<
          TEntity,
          TRelations
        >,
      }),
      ...(options?.take && { take: options.take }),
      ...(options?.skip && { skip: options.skip }),
      ...(options?.orderBy && { orderBy: options.orderBy }),
    };
  }

  /**
   * Подготовить аргументы для Prisma create
   * Преобразует наши domain типы в формат Prisma
   */
  protected prepareCreateArgs<
    S extends QuerySelect<TEntity>,
    I extends QueryInclude<TEntity, TRelations>,
  >(
    data: Record<string, unknown>,
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
    },
  ): {
    data: Record<string, unknown>;
    select?: Record<string, boolean | object>;
    include?: QueryInclude<TEntity, TRelations>;
  } {
    // Если есть и select, и include - объединяем в единый select
    if (options?.select && options?.include) {
      return {
        data,
        select: this.mergeSelectAndInclude(options.select, options.include),
      };
    }

    return {
      data,
      ...(options?.select && {
        select: this.prepareSelect(options.select),
      }),
      ...(options?.include && {
        include: this.prepareInclude(options.include) as QueryInclude<
          TEntity,
          TRelations
        >,
      }),
    };
  }

  /**
   * Подготовить аргументы для Prisma createMany
   * Преобразует наши domain типы в формат Prisma
   */
  protected prepareCreateManyArgs<
    S extends QuerySelect<TEntity>,
    I extends QueryInclude<TEntity, TRelations>,
  >(
    data: Record<string, unknown>[],
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
    },
  ): {
    data: Record<string, unknown>[];
    select?: Record<string, boolean | object>;
    include?: QueryInclude<TEntity, TRelations>;
  } {
    // Если есть и select, и include - объединяем в единый select
    if (options?.select && options?.include) {
      return {
        data,
        select: this.mergeSelectAndInclude(options.select, options.include),
      };
    }

    return {
      data,
      ...(options?.select && {
        select: this.prepareSelect(options.select),
      }),
      ...(options?.include && {
        include: this.prepareInclude(options.include) as QueryInclude<
          TEntity,
          TRelations
        >,
      }),
    };
  }

  /**
   * Подготовить аргументы для Prisma update
   * Преобразует наши domain типы в формат Prisma
   */
  protected prepareUpdateArgs<
    S extends QuerySelect<TEntity>,
    I extends QueryInclude<TEntity, TRelations>,
  >(
    where: Record<string, unknown>,
    data: Record<string, unknown>,
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
    },
  ): {
    where: Record<string, unknown>;
    data: Record<string, unknown>;
    select?: Record<string, boolean | object>;
    include?: QueryInclude<TEntity, TRelations>;
  } {
    // Если есть и select, и include - объединяем в единый select
    if (options?.select && options?.include) {
      return {
        where,
        data,
        select: this.mergeSelectAndInclude(options.select, options.include),
      };
    }

    return {
      where,
      data,
      ...(options?.select && {
        select: this.prepareSelect(options.select),
      }),
      ...(options?.include && {
        include: this.prepareInclude(options.include) as QueryInclude<
          TEntity,
          TRelations
        >,
      }),
    };
  }

  /**
   * Подготовить аргументы для Prisma delete
   * Преобразует наши domain типы в формат Prisma
   */
  protected prepareDeleteArgs<
    S extends QuerySelect<TEntity>,
    I extends QueryInclude<TEntity, TRelations>,
  >(
    where: Record<string, unknown>,
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
    },
  ): {
    where: Record<string, unknown>;
    select?: Record<string, boolean | object>;
    include?: QueryInclude<TEntity, TRelations>;
  } {
    // Если есть и select, и include - объединяем в единый select
    if (options?.select && options?.include) {
      return {
        where,
        select: this.mergeSelectAndInclude(options.select, options.include),
      };
    }

    return {
      where,
      ...(options?.select && {
        select: this.prepareSelect(options.select),
      }),
      ...(options?.include && {
        include: this.prepareInclude(options.include) as QueryInclude<
          TEntity,
          TRelations
        >,
      }),
    };
  }

  /**
   * Преобразовать массив ключей в объект Prisma select формата
   * ['id', 'name'] -> { id: true, name: true }
   */
  protected prepareSelect<S extends QuerySelect<TEntity>>(
    select: S,
  ): Record<string, boolean> | undefined {
    if (!select) return undefined;
    return Object.fromEntries(select.map((key) => [key, true]));
  }

  /**
   * Подготовить include для Prisma
   * Преобразует вложенные select массивы в объекты { field: true }
   * Обратно-совместим: если select уже объект - оставляет как есть
   *
   * @example
   * { user: true } -> { user: true }
   * { user: { select: ['id', 'name'] } } -> { user: { select: { id: true, name: true } } }
   * { user: { select: { id: true } } } -> { user: { select: { id: true } } } (без изменений)
   */
  protected prepareInclude<I extends QueryInclude<TEntity, TRelations>>(
    include: I,
  ): Record<string, unknown> | undefined {
    if (!include) return undefined;

    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(include)) {
      if (value === true) {
        // Простой include: { user: true }
        result[key] = true;
      } else if (typeof value === 'object' && value !== null) {
        // Вложенный include с опциями: { user: { select: [...], include: {...} } }
        result[key] = this.convertNestedInclude(
          value as Record<string, unknown>,
        );
      } else {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Объединить select и include в единый select объект
   * Prisma не позволяет использовать select и include одновременно,
   * поэтому relations добавляются в select
   *
   * @example
   * select: ['id', 'name'], include: { roles: true }
   * -> { id: true, name: true, roles: true }
   *
   * @example nested select
   * select: ['id'], include: { roles: { select: ['id', 'name'] } }
   * -> { id: true, roles: { select: { id: true, name: true } } }
   */
  protected mergeSelectAndInclude<
    S extends QuerySelect<TEntity>,
    I extends QueryInclude<TEntity, TRelations>,
  >(select: S, include: I): Record<string, boolean | object> {
    const result: Record<string, boolean | object> = {};

    // Добавляем поля из select
    if (select) {
      for (const key of select) {
        result[key as string] = true;
      }
    }

    // Добавляем relations из include
    if (include) {
      for (const [key, value] of Object.entries(include)) {
        if (value === true) {
          result[key] = true;
        } else if (typeof value === 'object' && value !== null) {
          // Поддержка вложенного select для relations
          result[key] = this.convertNestedInclude(
            value as Record<string, unknown>,
          );
        }
      }
    }

    return result;
  }

  /**
   * Конвертирует вложенный include в формат Prisma
   * Преобразует:
   * - select: ['id', 'name'] → { id: true, name: true }
   * - filter → where
   * - limit → take
   * - offset → skip
   *
   * ВАЖНО: Prisma не позволяет использовать select и include одновременно,
   * поэтому если оба присутствуют - relations из include объединяются в select.
   *
   * Обратно-совместим: если select уже объект - оставляет как есть
   */
  protected convertNestedInclude(
    includeOption: Record<string, unknown>,
  ): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    let selectObj: Record<string, unknown> | null = null;
    let includeObj: Record<string, unknown> | null = null;

    for (const [key, value] of Object.entries(includeOption)) {
      if (key === 'select') {
        if (Array.isArray(value)) {
          // Конвертируем ['id', 'name'] -> { id: true, name: true }
          selectObj = Object.fromEntries(
            value.map((field: string) => [field, true]),
          );
        } else if (typeof value === 'object' && value !== null) {
          // Уже объект - оставляем как есть (обратная совместимость)
          selectObj = value as Record<string, unknown>;
        }
      } else if (key === 'filter') {
        // filter → where (Prisma формат)
        // Пропускаем пустой объект фильтра
        if (
          value &&
          typeof value === 'object' &&
          Object.keys(value).length > 0
        ) {
          result['where'] = value;
        }
      } else if (key === 'limit') {
        // limit → take (Prisma формат)
        if (typeof value === 'number' && value > 0) {
          result['take'] = value;
        }
      } else if (key === 'offset') {
        // offset → skip (Prisma формат)
        if (typeof value === 'number' && value >= 0) {
          result['skip'] = value;
        }
      } else if (
        key === 'include' &&
        typeof value === 'object' &&
        value !== null
      ) {
        // Рекурсивно обрабатываем вложенные include
        includeObj = {};
        for (const [nestedKey, nestedValue] of Object.entries(
          value as Record<string, unknown>,
        )) {
          if (nestedValue === true) {
            includeObj[nestedKey] = true;
          } else if (typeof nestedValue === 'object' && nestedValue !== null) {
            includeObj[nestedKey] = this.convertNestedInclude(
              nestedValue as Record<string, unknown>,
            );
          }
        }
      } else {
        // orderBy и другие Prisma-совместимые поля - оставляем как есть
        result[key] = value;
      }
    }

    // Prisma не позволяет select и include одновременно
    // Если есть оба — объединяем relations в select
    if (selectObj && includeObj) {
      result['select'] = { ...selectObj, ...includeObj };
    } else if (selectObj) {
      result['select'] = selectObj;
    } else if (includeObj) {
      result['include'] = includeObj;
    }

    return result;
  }

  /**
   * Мапить результат Prisma в domain тип
   * Использует helper для type-safe преобразования
   */
  protected mapResult<S extends QuerySelect<TEntity>, I>(
    result: unknown,
  ): QueryResult<TEntity, S, I, TRelations> | null {
    return mapQueryResult<TEntity, S, I, TRelations>(result);
  }

  /**
   * Мапить массив результатов Prisma в domain типы
   */
  protected mapResults<S extends QuerySelect<TEntity>, I>(
    results: unknown,
  ): QueryResult<TEntity, S, I, TRelations>[] {
    if (!Array.isArray(results)) {
      return [];
    }
    return results.map((result) =>
      mapQueryResult<TEntity, S, I, TRelations>(result),
    ) as QueryResult<TEntity, S, I, TRelations>[];
  }
}
