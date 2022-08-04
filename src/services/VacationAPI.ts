import { IVacation, IVacationPayload, Vacation } from "./../models/Vacation";
import { BaseAPI } from "./BaseAPI";

type VacationsResponse = {
  status?: number;
  vacations: IVacation[];
};
type VacationResponse = {
  vacation: IVacation;
};

export class VacationAPI extends BaseAPI {
  public static async list(employee_id?: number): Promise<Vacation[]> {
    return (
      await this.client.get<VacationsResponse>(
        employee_id !== undefined
          ? `/employee/${employee_id}/vacation`
          : "/vacation"
      )
    ).data.vacations.map((d) => Vacation.fromJSON(d));
  }
  public static async get(id: number): Promise<Vacation> {
    if (id !== 0) {
      return Vacation.fromJSON(
        (await this.client.get<VacationResponse>(`/vacation/${id}`)).data
          .vacation
      );
    } else {
      return Vacation.empty();
    }
  }
  public static async post(
    employeeId: number,
    payload: IVacationPayload
  ): Promise<Vacation> {
    return Vacation.fromJSON(
      (
        await this.client.post<VacationResponse>(
          `/employee/${employeeId}/vacation`,
          payload
        )
      ).data.vacation
    );
  }
  public static async patch(
    id: number,
    payload: IVacationPayload
  ): Promise<Vacation> {
    return Vacation.fromJSON(
      (await this.client.patch<VacationResponse>(`/vacation/${id}`, payload))
        .data.vacation
    );
  }
}
