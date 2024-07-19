export interface ICermonReport {
  id: number;
  date: Date;
  total_male: number;
  total_female: number;
  total_new_male: number;
  total_new_female: number;
  cermon_id: number;
  cermon_name: string;
}

export interface CreateCermonReport {
  date: Date;
  total_male: number;
  total_female: number;
  total_new_male: number;
  total_new_female: number;
  cermon_id: number;
}

export interface CermonReportFilter {
  take?: number;
  page?: number;
  search?: string;
  region_id?: number;
}
