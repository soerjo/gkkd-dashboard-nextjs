export interface IChildDedication {
  id: number;
  unique_code: string;
  full_name: string;
  name: string;
  father_name: string;
  father_nij: string;
  mother_name: string;
  mother_nij: null;
  pastor: string;
  witness_1: string;
  witness_2: string;
  photo_url: string;
  document_url: string;
  region_id: number;
  date_child_dedication: Date;
  date_birthday: Date;
}

export interface CreateChildDedication {
  nijFather?: string;
  nijMother?: string;
  full_name: string;
  name: string;
  father_name: string;
  mother_name: string;
  pastor: string;
  witness_1: string;
  witness_2: string;
  region_id?: number;
  date_child_dedication: Date;
  date_birthday: Date;
}

export type FilterChildDedication = {
  take?: number;
  page?: number;
  search?: string;
  region_id?: number;
};
