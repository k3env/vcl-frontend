import { AxiosError } from "axios"; 
import { DeleteResponse, SingleResponse } from "./../services/_ResponseTypes";
export interface BaseModel<T> {
  save(
    onSuccess: (data: SingleResponse<T>) => void,
    onFail: (error: AxiosError) => void
  ): void;
  delete(
    onSuccess: (data: DeleteResponse) => void,
    onFail: (error: AxiosError) => void
  ): void;
}
