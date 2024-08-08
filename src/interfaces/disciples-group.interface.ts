import { GetChurchResponse } from "./churchResponse";
import { IDisciples } from "./disciples.interface";

export interface IGroup {
  unique_id: string;
  id: number;
  name: string;
  pembimbing_nim: string;
  region_id: number;
  pembimbing: IDisciples;
  region: GetChurchResponse;
}

export interface CreateGroup {
  name: string;
  pembimbing_nim: string;
  region_id: number;
}

export interface GroupFilter {
  take?: number;
  page?: number;
  search?: string;
  pembimbing_nim?: string;
  region_id?: number;
}
