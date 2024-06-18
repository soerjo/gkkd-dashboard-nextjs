export type UserPayload = {
  id?: number;
  email?: string;
  region?: Record<string, any>;
  role?: string;
  username?: string;
  token?: string;
  tempPassword?: boolean;
};

export type LoginResponse = {
  jwt: string;
  payload: UserPayload;
};
