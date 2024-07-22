export interface IDisciplesReport {
  id: number;
  name: string;
  pembimbing_nim: string;
  pembimbing_id: number;
  region_id: number;
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
}
