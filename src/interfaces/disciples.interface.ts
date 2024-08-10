import { GetChurchResponse } from "./churchResponse";
import { IGroup } from "./disciples-group.interface";

export interface IDisciples {
  id: number;
  nim: string;
  name: string;
  book_level: string;
  jemaat_nij: string;
  pembimbing_id: number;
  admin_id: number;
  disciple_group_id: null;
  parent: IDisciples;
  region_id: number;
  region: GetChurchResponse;
  group: IGroup;
  disciple_group: IGroup;
  childs: IDisciples[];
}

export interface CreateDisciples {
  name: string;
  book_level: string;
  jemaat_nij: string;
  pembimbing_id: number;
  region_id: number;
  group_id: number;
}

export interface DisciplesFilter {
  take?: number;
  page?: number;
  search?: string;
  region_id?: number;
  group_id?: number;
  pembimbing_nim?: string;
  pembimbing_id?: number;
}
