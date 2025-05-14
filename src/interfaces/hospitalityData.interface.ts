export interface ICreateHospitalityData {
  name: string
  alias?: string
  gender: string
  blesscomn_id?: number
  segment_id: number
}

export interface IFilterHospitalityData {
  take?: number;
  page?: number;
  segement_id?: number;
  blesscomn_id?: number;
  name?: string;
  date?: string;
  sunday_service_id?: string;
}

export interface IResponseHospitalityData {
  id: number;
  name: string;
  alias: string;
  gender: string;
  region_id: number;
  region_name: string;
  segment_id: number;
  segment_name: string;
  blesscomn_id: number;
  blesscomn_name: string;
}

export interface IMappingHospitalityData {
  //   id: number;
  //   name: string;
  //   alias: string;
  //   description: string;
  //   key: string;
  //   label: string;
}
