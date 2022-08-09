import { Employee, IEmployee } from "../models/Employee";
import { BaseAPI } from "./BaseAPI";

type EmployeeResponseSingle = {
  status?: number;
  employee: IEmployee;
};

export class EmployeeAPI extends BaseAPI {
  public static async list(): Promise<Employee[]> {
    return (await this.client.get<IEmployee[]>("/employee")).data.map(
      Employee.fromJSON
    );
  }
  public static async get(id: number): Promise<Employee> {
    return Employee.fromJSON(
      (await this.client.get<EmployeeResponseSingle>(`/employee/${id}`)).data
        .employee
    );
  }
  public static async patch(id: number, payload: Employee): Promise<Employee> {
    return Employee.fromJSON(
      (
        await this.client.patch<EmployeeResponseSingle>(
          `/employee/${id}`,
          payload
        )
      ).data.employee
    );
  }
  public static async post(payload: Employee): Promise<Employee> {
    return Employee.fromJSON(
      (await this.client.post<EmployeeResponseSingle>(`/employee`, payload))
        .data.employee
    );
  }
  public static async delete(id: number): Promise<{ id: number }> {
    return (await this.client.delete<{ id: number }>(`/employee/${id}`)).data;
  }
}
