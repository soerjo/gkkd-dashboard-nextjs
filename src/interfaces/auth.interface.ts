import { GetChurchResponse } from "./churchResponse";

export type UserPayload = {
  id: number;
  email: string;
  role: string;
  tempPassword: boolean;
  username: string;
  region: GetChurchResponse;
  isPhoneValidated: boolean;
};

export enum UserRole {
  SYSTEMADMIN = "SYSTEMADMIN",
  SUPERADMIN = "SUPERADMIN",
  ADMIN = "ADMIN",
  LEADER = "LEADER",
  DISCIPLE = "DISCIPLES",
}
