import {
  FindOptions,
  QueryInclude,
  QueryResult,
  QuerySelect,
} from '@domain/repositories/query.types';
import { FindManyWithRequiredIdsHelper } from '../helpers/find-many-with-required-ids.helper';
import { BaseRepository } from './base.repository';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PrismaDelegate = {
  findUnique(args?: any): Promise<unknown>;
  findFirst(args?: any): Promise<unknown>;
  findMany(args?: any): Promise<unknown[]>;
  create(args: any): Promise<unknown>;
  update(args: any): Promise<unknown>;
  delete(args: any): Promise<unknown>;
  count(args?: any): Promise<number>;
};

export abstract class PrismaCrudRepository<
  TEntity extends { id: string },
  TCreateInput,
  TUpdateInput,
  TRelations,
  TPrismaDelegate extends PrismaDelegate,
  TPrismaService,
> extends BaseRepository<TEntity, TRelations, TPrismaDelegate, TPrismaService> {
  protected toPrismaCreateData(data: TCreateInput): Record<string, unknown> {
    return data as Record<string, unknown>;
  }

  protected toPrismaUpdateData(data: TUpdateInput): Record<string, unknown> {
    return data as Record<string, unknown>;
  }

  protected toDomainEntity(row: unknown): TEntity | null {
    if (row == null) {
      return null;
    }

    return this.mapResult(row) as TEntity;
  }

  async findOne<
    S extends QuerySelect<TEntity> = undefined,
    I extends QueryInclude<TEntity, TRelations> = undefined,
  >(
    id: string,
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
    },
  ): Promise<QueryResult<TEntity, S, I, TRelations> | null> {
    const args = this.prepareFindArgs({ id }, options);
    const row = await this.getDelegate().findUnique(args);
    return this.mapResult(row);
  }

  async findMany<
    S extends QuerySelect<TEntity> = undefined,
    I extends QueryInclude<TEntity, TRelations> = undefined,
  >(
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
      where?: Record<string, unknown>;
      orderBy?: Record<string, 'asc' | 'desc'>;
      take?: number;
      skip?: number;
    },
  ): Promise<QueryResult<TEntity, S, I, TRelations>[]> {
    const { where, take, skip, orderBy, ...findOptions } = options ?? {};
    const args = this.prepareFindManyArgs(where, {
      ...findOptions,
      take,
      skip,
      orderBy,
    });
    const rows = await this.getDelegate().findMany(args);
    return this.mapResults(rows);
  }

  async findManyWithRequiredIds<
    S extends QuerySelect<TEntity> = undefined,
    I extends QueryInclude<TEntity, TRelations> = undefined,
  >(
    params: {
      where: Record<string, unknown>;
      requiredIds: string[];
      limit: number;
      offset: number;
    },
    findOptions?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
      orderBy?: Record<string, 'asc' | 'desc'>;
    },
  ): Promise<QueryResult<TEntity, S, I, TRelations>[]> {
    const rows = await FindManyWithRequiredIdsHelper.findManyWithRequiredIds(
      async (opts) => {
        const args = this.prepareFindManyArgs(opts.where, {
          select: opts.select as QuerySelect<TEntity> | undefined,
          include: opts.include as
            | QueryInclude<TEntity, TRelations>
            | undefined,
          take: opts.take,
          skip: opts.skip,
          orderBy: opts.orderBy,
        });
        const result = await this.getDelegate().findMany(args);
        return result
          .map((row) => this.toDomainEntity(row))
          .filter((row): row is TEntity => row != null);
      },
      params,
      findOptions ?? {},
    );

    return rows as QueryResult<TEntity, S, I, TRelations>[];
  }

  async create<
    S extends QuerySelect<TEntity> = undefined,
    I extends QueryInclude<TEntity, TRelations> = undefined,
  >(
    data: TCreateInput,
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
    },
  ): Promise<QueryResult<TEntity, S, I, TRelations>> {
    const args = this.prepareCreateArgs(this.toPrismaCreateData(data), options);
    const row = await this.getDelegate().create(args);
    return this.mapResult(row) as QueryResult<TEntity, S, I, TRelations>;
  }

  async update<
    S extends QuerySelect<TEntity> = undefined,
    I extends QueryInclude<TEntity, TRelations> = undefined,
  >(
    id: string,
    data: TUpdateInput,
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
    },
  ): Promise<QueryResult<TEntity, S, I, TRelations>> {
    const args = this.prepareUpdateArgs(
      { id },
      this.toPrismaUpdateData(data),
      options,
    );
    const row = await this.getDelegate().update(args);
    return this.mapResult(row) as QueryResult<TEntity, S, I, TRelations>;
  }

  async delete<
    S extends QuerySelect<TEntity> = undefined,
    I extends QueryInclude<TEntity, TRelations> = undefined,
  >(
    id: string,
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
    },
  ): Promise<QueryResult<TEntity, S, I, TRelations> | null> {
    const args = this.prepareDeleteArgs({ id }, options);
    const row = await this.getDelegate().delete(args);
    return this.mapResult(row);
  }

  async softDelete<
    S extends QuerySelect<TEntity> = undefined,
    I extends QueryInclude<TEntity, TRelations> = undefined,
  >(
    id: string,
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
    },
  ): Promise<QueryResult<TEntity, S, I, TRelations> | null> {
    throw new Error(`softDelete is not supported for ${this.constructor.name}`);
  }

  async count(where?: Record<string, unknown>): Promise<number> {
    return this.getDelegate().count(where ? { where } : {});
  }
}
