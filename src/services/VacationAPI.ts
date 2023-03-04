import { FVacation, IVacation, Vacation } from "./../models/Vacation";
import { BaseAPI } from "./BaseAPI";
import { DeleteResponse, ManyResponse, SingleResponse } from "./_ResponseTypes";

export class VacationAPI extends BaseAPI {
  public static async list(employee_id?: string): Promise<Vacation[]> {
    const reqURI =
      employee_id !== undefined
        ? `/employee/${employee_id}/vacation?expand`
        : "/vacation?expand";
    console.log(reqURI);
    return (
      await this.client.get<ManyResponse<IVacation>>(reqURI)
    ).data.data.map((d) => Vacation.fromJSON(d));
  }
  public static async get(id: string): Promise<Vacation> {
    console.log(id);
    return Vacation.fromJSON(
      (await this.client.get<SingleResponse<IVacation>>(`/vacation/${id}`)).data
        .data
    );
  }
  public static async post(payload: FVacation): Promise<Vacation> {
    return Vacation.fromJSON(
      (await this.client.post<SingleResponse<IVacation>>(`/vacation`, payload))
        .data.data
    );
  }
  public static async patch(id: string, payload: FVacation): Promise<Vacation> {
    return Vacation.fromJSON(
      (
        await this.client.patch<SingleResponse<IVacation>>(
          `/vacation/${id}`,
          payload
        )
      ).data.data
    );
  }

  public static async delete(id: string): Promise<DeleteResponse> {
    return (await this.client.delete<DeleteResponse>(`/vacation/${id}`)).data;
  }
}
