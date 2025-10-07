export abstract class BaseAssembler<T, R> {
  abstract toEntity(response: R): T;
  abstract toResponse(entity: T): R;

  toEntityList(responses: R[]): T[] {
    return responses.map(response => this.toEntity(response));
  }

  toResponseList(entities: T[]): R[] {
    return entities.map(entity => this.toResponse(entity));
  }
}
