import { AxiosError } from "axios";

export type AxiosAPIError = AxiosError<ErrorResponse>;

export type DeleteResponse = SingleResponse<{ id: number }>;
export type ErrorResponse = SingleResponse<null>;

export class SingleResponse<T> {
  status: number;
  message: string;
  data: T;
  constructor(status: number, message: string, data: T) {
    this.status = status;
    this.data = data;
    this.message = message;
  }
}

export class ManyResponse<T> {
  status: number;
  message: string;
  data: T[];
  constructor(status: number, message: string, data: T[]) {
    this.status = status;
    this.data = data;
    this.message = message;
  }
}
