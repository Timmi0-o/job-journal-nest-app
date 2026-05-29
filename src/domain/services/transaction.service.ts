import type { IBaseRepository } from '@domain/repositories/base.repository.interface';

export const TRANSACTION_SERVICE_TOKEN = Symbol('TRANSACTION_SERVICE_TOKEN');

/** Участник транзакции: тот же контракт, что и у репозиториев на BaseRepository (`IBaseRepository`). */
export type ITransactionParticipant = IBaseRepository;

/**
 * Интерфейс для управления транзакциями БД
 * ORM-agnostic абстракция для выполнения операций в транзакции
 */
export interface ITransactionService {
  /**
   * Выполнить операции внутри транзакции
   * Если callback выбрасывает ошибку, транзакция откатывается
   *
   * @param callback - Функция, которая будет выполнена в транзакции
   * @param repositories - Массив репозиториев, которые должны использовать транзакцию
   * @returns Результат выполнения callback
   */
  execute<
    T,
    const R extends readonly ITransactionParticipant[] =
      ITransactionParticipant[],
  >(
    callback: () => Promise<T>,
    repositories: R,
  ): Promise<T>;
}
