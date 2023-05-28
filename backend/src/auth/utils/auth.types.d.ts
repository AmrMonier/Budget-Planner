import { type } from 'os';

export type createUser = {
  email: string;
  name: string;
  password: string;
};

export type tokenType = 'reset' | 'verify';

export type login = {
  email: string;
  password: string;
};

export type forgetPassword = {
  email: string;
};

export type resetPassword = {
  email: string;
  password: string;
  code: string;
};

export type verifyAccount = {
  user_id: number;
  token: string;
};
