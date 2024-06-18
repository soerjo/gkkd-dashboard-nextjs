import { GetChurchResponse } from "./churchResponse";

export type GetUserResponse = {
  id: number;
  name: string;
  email: string;
  role: string;
  region: GetChurchResponse;
};

export type GetUserFilter = {
  take: number;
  page: number;
  search?: string;
  region_id?: number | undefined;
};

export type CreateUser = {
  name: string;
  email: string;
  role: string;
  regions_id: number;
};
