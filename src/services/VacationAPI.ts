import { FVacation, IVacation, Vacation } from "./../models/Vacation";
import { BaseAPI } from "./BaseAPI";
import { DeleteResponse, ManyResponse, SingleResponse } from "./_ResponseTypes";

export class VacationAPI extends BaseAPI {
  public static async list(employee_id?: number): Promise<Vacation[]> {
    return (
      await this.client.get<ManyResponse<IVacation>>(
        employee_id !== undefined
          ? `/employee/${employee_id}/vacation`
          : "/vacation"
      )
    ).data.data.map((d) => Vacation.fromJSON(d));
  }
  public static async get(id: number): Promise<Vacation> {
    console.log(id);
    return Vacation.fromJSON(
      (await this.client.get<SingleResponse<IVacation>>(`/vacation/${id}`)).data
        .data
    );
  }
  public static async post(
    employeeId: number,
    payload: FVacation
  ): Promise<Vacation> {
    return Vacation.fromJSON(
      (
        await this.client.post<SingleResponse<IVacation>>(
          `/employee/${employeeId}/vacation`,
          payload
        )
      ).data.data
    );
  }
  public static async patch(id: number, payload: FVacation): Promise<Vacation> {
    return Vacation.fromJSON(
      (
        await this.client.patch<SingleResponse<IVacation>>(
          `/vacation/${id}`,
          payload
        )
      ).data.data
    );
  }

  public static async delete(id: number): Promise<DeleteResponse> {
    return (await this.client.delete<DeleteResponse>(`/vacation/${id}`)).data;
  }
}
