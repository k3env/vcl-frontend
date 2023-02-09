import { JobTitle, IJobTitle } from "../models/JobTitle";
import { BaseAPI } from "./BaseAPI";
import { ManyResponse, SingleResponse, DeleteResponse } from "./_ResponseTypes";

export class JobTitleAPI extends BaseAPI {
  public static async list(): Promise<ManyResponse<JobTitle>> {
    const res = (await this.client.get<ManyResponse<IJobTitle>>("/job_title"))
      .data;
    return {
      status: res.status,
      message: res.message,
      data: res.data.map((i) => JobTitle.fromJSON(i)),
    };
  }
  public static async get(id: string): Promise<SingleResponse<JobTitle>> {
    const res = (
      await this.client.get<SingleResponse<IJobTitle>>(`/job_title/${id}`)
    ).data;
    return {
      status: res.status,
      message: res.message,
      data: JobTitle.fromJSON(res.data),
    };
  }
  public static async patch(
    id: string,
    payload: JobTitle
  ): Promise<SingleResponse<JobTitle>> {
    const res = (
      await this.client.patch<SingleResponse<IJobTitle>>(
        `/job_title/${id}`,
        payload
      )
    ).data;

    return {
      message: res.message,
      status: res.status,
      data: JobTitle.fromJSON(res.data),
    };
  }
  public static async post(
    payload: JobTitle
  ): Promise<SingleResponse<JobTitle>> {
    const res = (
      await this.client.post<SingleResponse<IJobTitle>>(`/job_title`, payload)
    ).data;

    return {
      message: res.message,
      status: res.status,
      data: JobTitle.fromJSON(res.data),
    };
  }
  public static async delete(id: string): Promise<DeleteResponse> {
    return (await this.client.delete<DeleteResponse>(`/job_title/${id}`)).data;
  }
}
