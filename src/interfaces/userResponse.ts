import { GetChurchResponse } from "./churchResponse";

export type GetUserResponse = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: boolean;
  region: GetChurchResponse;
};

export type GetUserFilter = {
  take?: number;
  page?: number;
  search?: string;
  region_id?: number;
};

export type CreateUser = {
  name: string;
  email: string;
  phone: string;
  role: string;
  regions_id?: number;
};

export type CreateUserForm = {
  name: string;
  email: string;
  phone: string;
  role: {
    label: string;
    value: any;
  };
  region?: {
    label: string;
    value: any;
  };
};
