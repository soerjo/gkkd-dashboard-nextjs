export interface IFellowshipReport {
  id: number;
  date: Date;
  total_male: number;
  total_female: number;
  new: number;
  total: number;
  blesscomn_id: number;
  blesscomn_name: string;
}

export interface IFellowshipReportById {
  id: number;
  date: Date;
  total_male: number;
  total_female: number;
  new_male: number;
  new_female: number;
  new: number;
  total: number;
  blesscomn_id: number;
  blesscomn_name: string;
}

export interface CreateFellowshipReport {
  date: Date;
  total_male: number;
  total_female: number;
  new_male: number;
  new_female: number;
  blesscomn_id: number;
}

export interface FellowshipReportFilter {
  take?: number;
  page?: number;
  search?: string;
  region_id?: number;
  date_from?: Date;
  date_to?: Date;
}
