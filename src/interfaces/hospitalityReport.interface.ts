export interface ICreateHospitalityReport {
  hospitality_data_id: number;
  date: string;
  sunday_service_id: number;
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
}

export interface IMappingHospitalityReport {
  //   id: number;
  //   name: string;
  //   alias: string;
  //   description: string;
  //   key: string;
  //   label: string;
}
