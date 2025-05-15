export interface ICreateHospitalityReport {
  hospitality_data_id: number;
  date: string;
  sunday_service_id: number;
}

export interface IHospitalRegenerateReport {
  date: string;
  cermon_id: number;
}

export interface IFilterHospitalityReport {
  take?: number;
  page?: number;
  segement_id?: number;
  blesscomn_id?: number;
  sunday_service_id?: number;
  date?: string;
  name?: string;
}

export interface IHospitalityReportSundayService {
  id: number;
  name: string;
  alias: string;
  count: number;
}

export interface IResponseHospitalityReport {
  id: number;
  report_id: number;
  name: string;
  alias: string;
  gender: string;
  region_id: number;
  region_name: string;
  segment_id: number;
  segment_name: string;
  blesscomn_id: number;
  blesscomn_name: string;
  is_present?: boolean;
  isLoading?: boolean;
}

export interface IReponseSundayServiceReport {
  sum: IHospitalityReportSundayService[]
  count: IHospitalityReportSumSundayService
}


export interface IHospitalityReportSumSundayService {
  total_female: number
  total_new_female: number
  total_new_male: number
  total_male: number
  total: number
}
