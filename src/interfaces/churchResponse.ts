export type GetChurchResponse = {
  id: number;
  name: string;
  alt_name: string;
  status: boolean;
  location?: string;
  parent_id?: number;
  parent?: string;
};

export type GetChurchFilter = {
  take: number;
  page: number;
  search: string;
};

export type CreateChurch = {
  id?: number;
  name: string;
  alt_name: string;
  location?: string;
  parent_id?: number;
  parent?: {
    name: string;
    id: number;
  };
};
