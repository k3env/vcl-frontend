import axios, { AxiosInstance } from "axios";
export class BaseAPI {
  protected static client: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });
}
