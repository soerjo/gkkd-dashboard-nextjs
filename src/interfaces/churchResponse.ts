export type GetChurchResponse = {
  id: number;
  name: string;
  alt_name: string;
  location: string;
};

export type GetChurchFilter = {
  take: number;
  page: number;
  search: number;
};

export type CreateChurch = {
  name: string;
  alt_name: string;
  location: string;
};
