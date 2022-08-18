import axios, { AxiosInstance } from "axios";
export class BaseAPI {
  private static BASE_URL = "https://vcl-be.herokuapp.com/api";
  // private static BASE_URL = "http://localhost:3333/api";
  protected static client: AxiosInstance = axios.create({
    baseURL: this.BASE_URL,
  });
}
