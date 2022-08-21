import { Employee, IEmployee } from "../models/Employee";
import { BaseAPI } from "./BaseAPI";
import { DeleteResponse, ManyResponse, SingleResponse } from "./_ResponseTypes";

export class EmployeeAPI extends BaseAPI {
  public static async list(): Promise<Employee[]> {
    return (
      await this.client.get<ManyResponse<IEmployee>>("/employee")
    ).data.data.map(Employee.fromJSON);
  }
  public static async get(id: number): Promise<Employee> {
    return Employee.fromJSON(
      (await this.client.get<SingleResponse<IEmployee>>(`/employee/${id}`)).data
        .data
    );
  }
  public static async patch(id: number, payload: Employee): Promise<Employee> {
    return Employee.fromJSON(
      (
        await this.client.patch<SingleResponse<IEmployee>>(
          `/employee/${id}`,
          payload
        )
      ).data.data
    );
  }
  public static async post(payload: Employee): Promise<Employee> {
    return Employee.fromJSON(
      (await this.client.post<SingleResponse<IEmployee>>(`/employee`, payload))
        .data.data
    );
  }
  public static async delete(id: number): Promise<DeleteResponse> {
    return (await this.client.delete<DeleteResponse>(`/employee/${id}`)).data;
  }
}
