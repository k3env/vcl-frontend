import { AxiosError } from "axios";

export type AxiosAPIError = AxiosError<ErrorResponse>;

export type DeleteResponse = SingleResponse<{ id: number }>;
export type ErrorResponse = SingleResponse<null>;

export class SingleResponse<T> {
  constructor(public status: number, public message: string, public data: T) {}
}

export class ManyResponse<T> {
  constructor(
    public status: number,
    public message: string,
    public data: T[]
  ) {}
}
