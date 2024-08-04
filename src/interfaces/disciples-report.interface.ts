import { GetChurchResponse } from "./churchResponse";
import { IGroup } from "./disciples-group.interface";
import { IDisciples } from "./disciples.interface";

export interface IDisciplesReport {
  id: number;
  disciple_group_id: number;
  date: Date;
  material: string;
  pembimbing_nim: string;
  region_id: number;
  disciple_group: IGroup;
  region: GetChurchResponse;
}

export interface CreateDisciplesReport {
  date: Date;
  material: string;
  disciple_group_id: number;
}

export interface DisciplesReportFilter {
  take?: number;
  page?: number;
  search?: string;
  region_id?: number;
  pembimbing_nim?: string;
  disciple_group_id?: number;
  date_from?: string;
  date_to?: string;
}
