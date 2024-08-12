export type UserPayload = {
  id?: number;
  email?: string;
  region?: Record<string, any>;
  role?: string;
  name?: string;
  username?: string;
  token?: string;
  tempPassword?: boolean;
  isPhoneValidate?: boolean;
};

export type LoginResponse = {
  jwt: string;
  payload: UserPayload;
};
