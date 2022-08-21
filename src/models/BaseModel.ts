import { AxiosError } from "axios";
import {
  DeleteResponse,
  ErrorResponse,
  SingleResponse,
} from "./../services/_ResponseTypes";
export abstract class BaseModel<T, I, F> {
  abstract save(
    onSuccess: (data: SingleResponse<T>) => void,
    onFail: (error: AxiosError) => void
  ): void;
  abstract delete(
    onSuccess: (data: DeleteResponse) => void,
    onFail: (error: AxiosError<ErrorResponse>) => void
  ): void;
  abstract toJSON(): I;
  abstract toFormData(): F;

  // Static methods
  // abstract fromJSON(data: I): T;
  // abstract fromFormData(data: F): T;
  // abstract formDataToInterface(data: F): I;
  // abstract interfaceToFormData(data: I): F;
}
