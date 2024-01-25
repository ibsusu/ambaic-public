export type StoreSubscribeWithSelector<T> = {
  subscribe: {
      (listener: (selectedState: T, previousSelectedState: T) => void): () => void;
      <U>(selector: (state: T) => U, listener: (selectedState: U, previousSelectedState: U) => void, options?: {
          equalityFn?: (a: U, b: U) => boolean;
          fireImmediately?: boolean;
      }): () => void;
  };
};
export type Write<T, U> = Omit<T, keyof U> & U;

export type Interactive = {
  clickHandler: () => void
};