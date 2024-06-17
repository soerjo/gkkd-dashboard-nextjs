export type IApiResponse<T> = {
  message: string;
  data: T;
};

export type TPaginationResponse<T> = {
  entities: T;
  meta: Meta;
};

export type Meta = {
  page: number;
  offset: number;
  itemCount: number;
  pageCount: number;
};
