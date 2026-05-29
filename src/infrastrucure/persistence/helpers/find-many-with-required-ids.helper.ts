export type FindManyOptions = {
  where?: Record<string, unknown>;
  take?: number;
  skip?: number;
  orderBy?: Record<string, 'asc' | 'desc'>;
  select?: unknown;
  include?: unknown;
};

export type FindManyWithRequiredIdsParams = {
  where: Record<string, unknown>;
  requiredIds: string[];
  limit: number;
  offset: number;
};

export type FindManyWithRequiredCompositeKeysParams<
  K extends Record<string, string>,
> = {
  where: Record<string, unknown>;
  requiredKeys: K[];
  limit: number;
  offset: number;
};

export class FindManyWithRequiredIdsHelper {
  static async findManyWithRequiredIds<T extends { id: string }>(
    findMany: (
      options: FindManyOptions,
    ) => Promise<(T & { id: string })[] | null>,
    params: FindManyWithRequiredIdsParams,
    findOptions: Omit<FindManyOptions, 'where' | 'take' | 'skip'>,
  ): Promise<(T & { id: string })[]> {
    const { where, requiredIds, limit, offset } = params;
    const hasNestedFilter = Object.keys(where).length > 0;

    const requiredWhere = hasNestedFilter
      ? ({
          AND: [where, { id: { in: requiredIds } }] as [
            Record<string, unknown>,
            { id: { in: string[] } },
          ],
        } as Record<string, unknown>)
      : { id: { in: requiredIds } };

    const restWhere = hasNestedFilter
      ? ({
          AND: [where, { id: { notIn: requiredIds } }] as [
            Record<string, unknown>,
            { id: { notIn: string[] } },
          ],
        } as Record<string, unknown>)
      : { id: { notIn: requiredIds } };

    const takeRest = Math.max(0, limit - requiredIds.length);

    const [requiredItems, restItems] = await Promise.all([
      findMany({
        ...findOptions,
        where: requiredWhere,
        take: requiredIds.length,
      }),
      takeRest > 0
        ? findMany({
            ...findOptions,
            where: restWhere,
            take: takeRest,
            skip: offset,
          })
        : Promise.resolve(null),
    ]);

    const requiredList = requiredItems ?? [];
    const restList = restItems ?? [];

    const byRequiredOrder = requiredList
      .slice()
      .sort((a, b) => requiredIds.indexOf(a.id) - requiredIds.indexOf(b.id));

    return [...byRequiredOrder, ...restList];
  }

  static async findManyWithRequiredCompositeKeys<
    T extends Record<string, unknown>,
    K extends Record<string, string>,
  >(
    findMany: (options: FindManyOptions) => Promise<T[] | null>,
    params: FindManyWithRequiredCompositeKeysParams<K>,
    findOptions: Omit<FindManyOptions, 'where' | 'take' | 'skip'>,
    keyFields: (keyof K)[],
  ): Promise<T[]> {
    const { where, requiredKeys, limit, offset } = params;
    const hasNestedFilter = Object.keys(where).length > 0;

    const requiredCompositeOr = requiredKeys.map((k) =>
      Object.fromEntries(keyFields.map((f) => [f, k[f]])),
    );

    const requiredWhere = hasNestedFilter
      ? ({ AND: [where, { OR: requiredCompositeOr }] } as Record<
          string,
          unknown
        >)
      : ({ OR: requiredCompositeOr } as Record<string, unknown>);

    const restWhere = hasNestedFilter
      ? ({
          AND: [
            where,
            { NOT: { OR: requiredCompositeOr } as Record<string, unknown> },
          ],
        } as Record<string, unknown>)
      : ({ NOT: { OR: requiredCompositeOr } } as Record<string, unknown>);

    const takeRest = Math.max(0, limit - requiredKeys.length);

    const [requiredItems, restItems] = await Promise.all([
      findMany({
        ...findOptions,
        where: requiredWhere,
        take: requiredKeys.length,
      }),
      takeRest > 0
        ? findMany({
            ...findOptions,
            where: restWhere,
            take: takeRest,
            skip: offset,
          })
        : Promise.resolve(null),
    ]);

    const requiredList = requiredItems ?? [];
    const restList = restItems ?? [];

    const byRequiredOrder = requiredList.slice().sort((a, b) => {
      const aIndex = requiredKeys.findIndex((k) =>
        keyFields.every(
          (f) => (a as Record<string, unknown>)[f as string] === k[f],
        ),
      );
      const bIndex = requiredKeys.findIndex((k) =>
        keyFields.every(
          (f) => (b as Record<string, unknown>)[f as string] === k[f],
        ),
      );
      return aIndex - bIndex;
    });

    return [...byRequiredOrder, ...restList];
  }
}
