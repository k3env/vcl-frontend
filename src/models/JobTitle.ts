import { AxiosError } from "axios";
import { DateTime } from "luxon";
import { JobTitleAPI } from "../services/JobTitleAPI";
import {
  SingleResponse,
  DeleteResponse,
  ErrorResponse,
} from "../services/_ResponseTypes";
import { BaseModel } from "./BaseModel";

export class JobTitle implements BaseModel<JobTitle, IJobTitle, FJobTitle> {
  created_at?: DateTime;
  updated_at?: DateTime;

  constructor(
    public _id: string | undefined,
    public title: string,
    created_at: string | undefined,
    updated_at: string | undefined
  ) {
    this.created_at =
      created_at === undefined ? undefined : DateTime.fromISO(created_at);
    this.updated_at =
      updated_at === undefined ? undefined : DateTime.fromISO(updated_at);
  }
  save(
    onSuccess: (data: SingleResponse<JobTitle>) => void,
    onFail: (error: AxiosError<unknown, any>) => void
  ): void {
    this._id
      ? JobTitleAPI.patch(this._id, this).then(onSuccess, onFail)
      : JobTitleAPI.post(this).then(onSuccess, onFail);
  }
  delete(
    onSuccess: (data: DeleteResponse) => void,
    onFail: (error: AxiosError<ErrorResponse, any>) => void
  ): void {
    if (this._id) {
      JobTitleAPI.delete(this._id).then(onSuccess, onFail);
    }
  }
  toJSON(): IJobTitle {
    return {
      title: this.title,
      _id: this._id,
      created_at: this.created_at?.toISO(),
      updated_at: this.updated_at?.toISO(),
    };
  }
  toFormData(): FJobTitle {
    return {
      title: this.title,
      _id: this._id,
      created_at: this.created_at?.toJSDate(),
      updated_at: this.updated_at?.toJSDate(),
    };
  }
  static fromJSON(data: IJobTitle): JobTitle {
    return new JobTitle(data._id, data.title, data.created_at, data.updated_at);
  }
  static fromFormData(data: FJobTitle): JobTitle {
    return new JobTitle(
      data._id,
      data.title,
      data.created_at === undefined
        ? undefined
        : DateTime.fromJSDate(data.created_at).toISO(),
      data.updated_at === undefined
        ? undefined
        : DateTime.fromJSDate(data.updated_at).toISO()
    );
  }
  static formDataToInterface(data: FJobTitle): IJobTitle {
    return JobTitle.fromFormData(data).toJSON();
  }
  static interfaceToFormData(data: IJobTitle): FJobTitle {
    return JobTitle.fromJSON(data).toFormData();
  }
}

export interface IJobTitle {
  _id?: string;
  title: string;
  created_at?: string;
  updated_at?: string;
}

export interface FJobTitle {
  _id?: string;
  title: string;
  created_at?: Date;
  updated_at?: Date;
}
