import { DateTime } from "luxon";
import axios from "axios";
import { Employee } from "../models/Employee";
import { BaseAPI } from "./BaseAPI";

type EmployeeResponseSingle = {
  status?: number;
  employee: Employee;
};

export class EmployeeAPI extends BaseAPI {
  public static async list(): Promise<Employee[]> {
    return (await axios.get<Employee[]>(`${this.BASE_URL}/employee`)).data.map(
      (e) => {
        e.created_at = DateTime.fromISO(e.created_at as unknown as string);
        e.updated_at = DateTime.fromISO(e.updated_at as unknown as string);
        return e;
      }
    );
  }
  public static async get(id: number): Promise<Employee> {
    if (id !== 0) {
      let e = (
        await axios.get<EmployeeResponseSingle>(
          `${this.BASE_URL}/employee/${id}`
        )
      ).data.employee;
      e.created_at = DateTime.fromISO(e.created_at as unknown as string);
      e.updated_at = DateTime.fromISO(e.updated_at as unknown as string);
      return e;
    } else {
      return {
        id: 0,
        name: "",
        color: "",
      };
    }
  }
  public static async patch(id: number, payload: Employee): Promise<Employee> {
    let e = (
      await axios.patch<EmployeeResponseSingle>(
        `${this.BASE_URL}/employee/${id}`,
        payload,
        {}
      )
    ).data.employee;
    e.created_at = DateTime.fromISO(e.created_at as unknown as string);
    e.updated_at = DateTime.fromISO(e.updated_at as unknown as string);
    return e;
  }
  public static async post(payload: Employee) {
    let e = (
      await axios.post<EmployeeResponseSingle>(
        `${this.BASE_URL}/employee`,
        payload
      )
    ).data.employee;
    e.created_at = DateTime.fromISO(e.created_at as unknown as string);
    e.updated_at = DateTime.fromISO(e.updated_at as unknown as string);
    return e;
  }
}
