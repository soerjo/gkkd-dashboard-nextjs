export interface IMarital {
  id: number;
  unique_code: string;
  husband_name: string;
  husband_nij: string;
  husband_nik: string;
  wife_name: string;
  wife_nij: string;
  wife_nik: string;
  wedding_date: Date;
  pastor: string;
  witness_1: string;
  witness_2: string;
  photo_url: string;
  document_url: string;
  region_id: number;
}

export interface UpdateMarital {
  husband_name: string;
  husband_nij?: string;
  husband_nik: string;
  wife_name: string;
  wife_nij?: string;
  wife_nik: string;
  wedding_date: Date;
  pastor: string;
  witness_1: string;
  witness_2: string;
  region_id: number;
}

export interface CreateMarital {
  husband_name: string;
  husband_nij?: string;
  husband_nik: string;
  wife_name: string;
  wife_nij?: string;
  wife_nik: string;
  wedding_date: Date;
  pastor: string;
  witness_1: string;
  witness_2: string;
  region_id?: number;
}

export interface MaritalFilter {
  take?: number;
  page?: number;
  search?: string;
  region_id?: number;
}
