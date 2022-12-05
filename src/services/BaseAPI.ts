import axios, { AxiosInstance } from "axios";
export class BaseAPI {
  private static BASE_URL = "https://vcl-backend-production.up.railway.app/api";
  // private static BASE_URL = "http://localhost:3333/api";
  protected static client: AxiosInstance = axios.create({
    baseURL: this.BASE_URL,
  });
}
