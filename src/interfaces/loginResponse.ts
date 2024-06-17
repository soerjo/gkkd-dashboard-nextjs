export type UserPayload = {
  id?: number;
  email?: string;
  region?: Record<string, any>;
  role?: string;
  username?: string;
};

export type LoginResponse = {
  jwt: string;
  payload: UserPayload;
};
