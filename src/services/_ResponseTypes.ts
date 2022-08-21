import { AxiosError } from "axios";

export type AxiosAPIError = AxiosError<ErrorResponse>;

export type DeleteResponse = SingleResponse<{ id: number }>;
export type ErrorResponse = SingleResponse<null>;

export type SingleResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export type ManyResponse<T> = {
  status: number;
  message: string;
  data: T[];
};
