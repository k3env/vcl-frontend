import { EmployeeAPI } from "./../services/EmployeeAPI";
import { Employee, IEmployee } from "./Employee";
import { DateTime } from "luxon";
import { BaseModel } from "./BaseModel";
import { AxiosError } from "axios";
import {
  SingleResponse,
  DeleteResponse,
  ErrorResponse,
} from "../services/_ResponseTypes";

import * as dc from "../helpers/DateConvert";
import { VacationAPI } from "../services/VacationAPI";

export class Vacation implements BaseModel<Vacation, IVacation, FVacation> {
  start: DateTime;

  get employee_id(): string {
    return this.employee._id ?? "";
  }

  constructor(
    public _id: string | undefined,
    start: string,
    public length: number,
    public employee: Employee
  ) {
    this.start = DateTime.fromISO(start);
  }
  /**
   * @deprecated Reason: async requirement in object generation
   */
  static fromFormData(data: FVacation): Vacation {
    throw new Error("DO NOT USE IT!");
  }
  static formDataToInterface(data: FVacation): IVacation {
    return {
      _id: data._id,
      start: dc.jsToISO(data.start),
      length: data.length,
    };
  }
  static interfaceToFormData(data: IVacation): FVacation {
    return {
      _id: data._id,
      start: dc.isoToJS(data.start),
      length: data.length,
      employee:
        data.employee === undefined ? undefined : String(data.employee._id),
    };
  }
  save(
    onSuccess: (data: SingleResponse<Vacation>) => void,
    onFail: (error: AxiosError<unknown, any>) => void
  ): void {
    this._id
      ? VacationAPI.patch(this._id, this.toFormData()).then((d) => {
          onSuccess({ data: d, message: "OK", status: 200 });
        }, onFail)
      : VacationAPI.post(this.toFormData()).then((d) => {
          onSuccess({ data: d, message: "OK", status: 200 });
        }, onFail);
  }
  delete(
    onSuccess: (data: DeleteResponse) => void,
    onFail: (error: AxiosError<ErrorResponse, any>) => void
  ): void {
    if (this._id) {
      VacationAPI.delete(this._id).then(onSuccess, onFail);
    }
  }
  toJSON(): IVacation {
    return {
      _id: this._id,
      start: this.start.toISO(),
      length: this.length,
      employee: this.employee.toJSON(),
    };
  }
  toFormData(): FVacation {
    return {
      _id: this._id,
      start: this.start.toJSDate(),
      length: this.length,
      employee: String(this.employee._id),
    };
  }

  public static fromJSON(data: IVacation) {
    return new Vacation(
      data._id,
      data.start,
      data.length,
      // Employee.empty()
      data.employee
        ? Employee.fromJSON(data.employee as IEmployee)
        : Employee.empty()
    );
  }
  public static empty(): Vacation {
    return new Vacation(undefined, DateTime.now().toISO(), 3, Employee.empty());
  }
}

export interface IVacation {
  _id?: string;
  start: string;
  length: number;
  employee?: IEmployee;
}

export interface FVacation {
  _id?: string;
  start: Date;
  length: number;
  employee?: string;
}
