import { GetChurchResponse } from "./churchResponse";
import { Member } from "./memberResponse";

export interface IBaptism {
  id: number;
  uniq_code: string;
  full_name: string;
  date_baptism: Date;
  name: string;
  jemaat_id: number;
  region_id: number;
  pastor: string;
  witness_1: string;
  witness_2: string;
  photo_url: string;
  document_url: string;
  photo_documentation_url: string;
  jemaat: Member;
  region: GetChurchResponse;
}

export interface CreateBaptism {
  full_name: string;
  date_baptism: Date;
  nij: string;
  pastor: string;
  witness_1: string;
  witness_2: string;
  photo_url?: string;
  document_url?: string;
  photo_documentation_url?: string;
  region_id: number;
}

export type FilterBaptism = {
  take?: number;
  page?: number;
  search?: string;
  region_id?: number;
};
