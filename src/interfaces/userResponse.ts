import { GetChurchResponse } from "./churchResponse";
import { IFellowshipById } from "./fellowship.interface";

export type GetUserResponse = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: boolean;
  region: GetChurchResponse;
  blesscomn: AdminBlessComn[];
};

export type AdminBlessComn = {
  id: number;
  admin_id: number;
  blesscomn_id: number;
  blesscomn: IFellowshipById;
};

export type GetUserFilter = {
  take?: number;
  page?: number;
  search?: string;
  role?: string;
  region_id?: number;
};

export type CreateUser = {
  name: string;
  email: string;
  phone: string;
  role: string;
  region_id?: number;
  blesscomn_ids?: number[];
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
