export interface Serializer<T, U> {
  serialize: (item: T) => U;
  deserialize: (data: U) => T;
}
