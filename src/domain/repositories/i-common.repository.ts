import { BaseRepository } from 'src/infrastructure/persistence/repositories/base.repository';
import {
  FindOptions,
  QueryInclude,
  QueryResult,
  QuerySelect,
} from './query.types';

export interface ICommonRepository<
  TEntity,
  TCreateInput,
  TUpdateInput,
  TRelations = undefined,
> extends BaseRepository<TEntity, TRelations> {
  findOne<
    S extends QuerySelect<TEntity> = undefined,
    I extends QueryInclude<TEntity, TRelations> = undefined,
  >(
    id: string,
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
    },
  ): Promise<QueryResult<TEntity, S, I, TRelations> | null>;

  findMany<
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
  ): Promise<QueryResult<TEntity, S, I, TRelations>[] | null>;

  findManyWithRequiredIds<
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
  ): Promise<QueryResult<TEntity, S, I, TRelations>[] | null>;

  create<
    S extends QuerySelect<TEntity> = undefined,
    I extends QueryInclude<TEntity, TRelations> = undefined,
  >(
    data: TCreateInput,
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
    },
  ): Promise<QueryResult<TEntity, S, I, TRelations>>;

  update<
    S extends QuerySelect<TEntity> = undefined,
    I extends QueryInclude<TEntity, TRelations> = undefined,
  >(
    id: string,
    data: TUpdateInput,
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
    },
  ): Promise<QueryResult<TEntity, S, I, TRelations>>;

  delete<
    S extends QuerySelect<TEntity> = undefined,
    I extends QueryInclude<TEntity, TRelations> = undefined,
  >(
    id: string,
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
    },
  ): Promise<QueryResult<TEntity, S, I, TRelations> | null>;

  softDelete<
    S extends QuerySelect<TEntity> = undefined,
    I extends QueryInclude<TEntity, TRelations> = undefined,
  >(
    id: string,
    options?: FindOptions<TEntity, TRelations> & {
      select?: S;
      include?: I;
    },
  ): Promise<QueryResult<TEntity, S, I, TRelations> | null>;

  count(where?: Record<string, unknown>): Promise<number>;
}
