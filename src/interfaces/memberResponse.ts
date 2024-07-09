import { GetChurchResponse } from "./churchResponse";

export type Member = {
  id: number;
  nij: string;
  full_name: string;
  name: string;
  email: string;
  gender: string;
  place_birthday: string;
  date_birthday: Date;
  phone_number?: string;
  address?: string;
  father_name?: string;
  mother_name?: string;
  birth_order?: number;
  total_brother_sister?: number;
  marital_status?: boolean;
  husband_wife_name?: string;
  wedding_date?: Date;
  region_id?: number;
  // region?: GetChurchResponse;
};

export type MemberDetail = {
  id: number;
  nij: string;
  full_name: string;
  name: string;
  email: string;
  gender: string;
  place_birthday: string;
  date_birthday: Date;
  phone_number?: string;
  address?: string;
  father_name?: string;
  mother_name?: string;
  birth_order?: number;
  total_brother_sister?: number;
  marital_status?: boolean;
  husband_wife_name?: string;
  wedding_date?: Date;
  region_id?: number;
  region?: GetChurchResponse;
};

export type CreateMember = {
  nij: string;
  full_name: string;
  name: string;
  email: string;
  gender: string;
  place_birthday: string;
  date_birthday: Date;
  phone_number: string;
  address?: string;
  father_name?: string;
  mother_name?: string;
  birth_order?: number;
  total_brother_sister?: number;
  marital_status?: boolean;
  husband_wife_name?: string;
  wedding_date?: Date;
  region_id?: number;
  total_son_daughter: number;
  son_daughter_name: number;
  // region?: GetChurchResponse;
};

export type MemberResponse = Member & { id: number };

export type GetMemberFilter = {
  take?: number;
  page?: number;
  search?: string;
  region_id?: number;
};
