export interface ICermonReport {
  id: number;
  date: Date;
  total_male: number;
  total_female: number;
  total_new_male: number;
  total_new_female: number;
  total: number;
  new: number;
  cermon_id: number;
  cermon_name: string;
  is_sync: boolean;
}

export interface CreateCermonReport {
  date: Date;
  total_male?: number;
  total_female?: number;
  total_new_male?: number;
  total_new_female?: number;
  cermon_id: number;
}

export interface CermonReportFilter {
  take?: number;
  page?: number;
  search?: string;
  region_id?: number;
  date_from?: Date | string;
  date_to?: Date | string;
}
