export interface ICreateSegment {
  name: string;
  alias: string;
  description?: string;
}

export interface IFilterSegment {
  name?: string;
}

export interface IResponseSegment {
  id: number;
  name: string;
  alias: string;
  description: string;
}


export interface IMappingSegment {
  id: number;
  name: string;
  alias: string;
  description: string;
  key: string;
  label: string;
}