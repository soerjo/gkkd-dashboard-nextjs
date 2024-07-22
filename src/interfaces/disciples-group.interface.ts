export interface IGroup {
  id: number;
  name: string;
  pembimbing_nim: string;
  pembimbing_id: number;
  region_id: number;
}

export interface CreateGroup {
  name: string;
  pembimbing_nim: string;
  region_id: number;
}

export interface GroupFilter {
  take?: number;
  page?: number;
  search?: string;
  region_id?: number;
}
