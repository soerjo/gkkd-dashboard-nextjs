export interface IFellowship {
  id: number;
  name: string;
  location: string;
  segment: string;
  day: string;
  time: string;
  lead_id: number;
  lead_name: string;
  region_id: number;
  region_name: string;
}

export interface IFellowshipById {
  id: number;
  name: string;
  location: string;
  segment: string;
  day: string;
  time: string;
  lead_id: number;
  lead_name: string;
  region_id: number;
  region_name: string;
  members: string[];
}

export interface CreateFellowship {
  name: string;
  location: string;
  segment: string;
  day: string;
  time: string;
  lead_id?: number;
  region_id?: number;
  members?: string[];
}

export interface FellowshipFilter {
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
