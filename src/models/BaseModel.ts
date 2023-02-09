export abstract class BaseModel<T, I, F> {
  abstract toJSON(): I;
  abstract toFormData(): F;

  // Static methods
  // abstract fromJSON(data: I): T;
  // abstract fromFormData(data: F): T;
  // abstract formDataToInterface(data: F): I;
  // abstract interfaceToFormData(data: I): F;
}
