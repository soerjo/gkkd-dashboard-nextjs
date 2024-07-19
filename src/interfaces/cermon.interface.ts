export interface ICermon {
  id: number;
  name: string;
  time: string;
  day: string;
  segment: string;
  description: string;
  region_id: number;
  region_name: string;
}

export interface CreateCermon {
  name: string;
  time: string;
  day: string;
  segment: string;
  description: string;
  region_id?: number;
}

export interface CermonFilter {
  take?: number;
  page?: number;
  search?: string;
  region_id?: number;
}

export const weekDays = [
  {
    name: "Minggu",
    value: 0,
  },
  {
    name: "Senin",
    value: 1,
  },
  {
    name: "Selasa",
    value: 2,
  },
  {
    name: "Rabu",
    value: 3,
  },
  {
    name: "Kamis",
    value: 4,
  },
  {
    name: "Jumat",
    value: 5,
  },
  {
    name: "Sabtu",
    value: 6,
  },
];
