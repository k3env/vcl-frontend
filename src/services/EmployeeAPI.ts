import { Employee, IEmployee } from "../models/Employee";
import { BaseAPI } from "./BaseAPI";
import { DeleteResponse, ManyResponse, SingleResponse } from "./_ResponseTypes";

export class EmployeeAPI extends BaseAPI {
  public static async list(): Promise<ManyResponse<Employee>> {
    const res = (await this.client.get<ManyResponse<IEmployee>>("/employee"))
      .data;
    return {
      status: res.status,
      message: res.message,
      data: res.data.map((i) => Employee.fromJSON(i)),
    };
  }
  public static async get(id: string): Promise<SingleResponse<Employee>> {
    const res = (
      await this.client.get<SingleResponse<IEmployee>>(`/employee/${id}`)
    ).data;
    return {
      status: res.status,
      message: res.message,
      data: Employee.fromJSON(res.data),
    };
  }
  public static async patch(
    id: string,
    payload: Employee
  ): Promise<SingleResponse<Employee>> {
    const res = (
      await this.client.patch<SingleResponse<IEmployee>>(
        `/employee/${id}`,
        payload
      )
    ).data;

    return {
      message: res.message,
      status: res.status,
      data: Employee.fromJSON(res.data),
    };
  }
  public static async post(
    payload: Employee
  ): Promise<SingleResponse<Employee>> {
    const res = (
      await this.client.post<SingleResponse<IEmployee>>(`/employee`, payload)
    ).data;

    return {
      message: res.message,
      status: res.status,
      data: Employee.fromJSON(res.data),
    };
  }
  public static async delete(id: string): Promise<DeleteResponse> {
    return (await this.client.delete<DeleteResponse>(`/employee/${id}`)).data;
  }
}
