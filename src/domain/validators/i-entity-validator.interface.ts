export interface IEntityValidator<TGetOne, TGetMany, TCreate, TUpdate, TDelete> {
  validateGetOne(data: TGetOne): TGetOne;
  validateGetMany(data: TGetMany): TGetMany;
  validateCreate(data: TCreate): TCreate;
  validateUpdate(data: TUpdate): TUpdate;
  validateDelete(data: TDelete): TDelete;
}
