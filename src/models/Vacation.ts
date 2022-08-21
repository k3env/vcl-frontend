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
  id?: number;
  start: DateTime;
  length: number;
  employee: Employee;
  created_at?: DateTime;
  updated_at?: DateTime;

  get employee_id(): number {
    return this.employee.id ?? 0;
  }

  constructor(
    id: number | undefined,
    start: string,
    length: number,
    employee: Employee,
    created_at?: string,
    updated_at?: string
  ) {
    this.id = id;
    this.start = DateTime.fromISO(start);
    this.length = length;
    this.employee = employee;
    this.created_at =
      created_at === undefined ? undefined : DateTime.fromISO(created_at);
    this.updated_at =
      updated_at === undefined ? undefined : DateTime.fromISO(updated_at);
  }
  /**
   * @deprecated Reason: async requirement in object generation
   */
  static fromFormData(data: FVacation): Vacation {
    throw new Error("DO NOT USE IT!");
  }
  static formDataToInterface(data: FVacation): IVacation {
    return {
      id: data.id,
      start: dc.jsToISO(data.start),
      length: data.length,
      employee_id:
        data.employee_id === undefined
          ? undefined
          : Number.parseInt(data.employee_id),
      created_at:
        data.created_at === undefined ? undefined : dc.jsToISO(data.created_at),
      updated_at:
        data.updated_at === undefined ? undefined : dc.jsToISO(data.updated_at),
    };
  }
  static interfaceToFormData(data: IVacation): FVacation {
    return {
      id: data.id,
      start: dc.isoToJS(data.start),
      length: data.length,
      employee_id:
        data.employee_id === undefined ? undefined : String(data.employee_id),
      created_at:
        data.created_at === undefined ? undefined : dc.isoToJS(data.created_at),
      updated_at:
        data.updated_at === undefined ? undefined : dc.isoToJS(data.updated_at),
    };
  }
  save(
    onSuccess: (data: SingleResponse<Vacation>) => void,
    onFail: (error: AxiosError<unknown, any>) => void
  ): void {
    this.id
      ? VacationAPI.patch(this.id, this.toFormData()).then((d) => {
          onSuccess({ data: d, message: "OK", status: 200 });
        }, onFail)
      : VacationAPI.post(this.employee_id, this.toFormData()).then((d) => {
          onSuccess({ data: d, message: "OK", status: 200 });
        }, onFail);
  }
  delete(
    onSuccess: (data: DeleteResponse) => void,
    onFail: (error: AxiosError<ErrorResponse, any>) => void
  ): void {
    if (this.id) {
      VacationAPI.delete(this.id).then(onSuccess, onFail);
    }
  }
  toJSON(): IVacation {
    return {
      id: this.id,
      start: this.start.toISO(),
      length: this.length,
      employee: this.employee.toJSON(),
      employee_id: this.employee_id,
      created_at:
        this.created_at === undefined ? undefined : this.created_at.toISO(),
      updated_at:
        this.updated_at === undefined ? undefined : this.updated_at.toISO(),
    };
  }
  toFormData(): FVacation {
    return {
      id: this.id,
      start: this.start.toJSDate(),
      length: this.length,
      employee_id: String(this.employee_id),
      created_at:
        this.created_at === undefined ? undefined : this.created_at.toJSDate(),
      updated_at:
        this.updated_at === undefined ? undefined : this.updated_at.toJSDate(),
    };
  }

  public static fromJSON(data: IVacation) {
    return new Vacation(
      data.id,
      data.start,
      data.length,
      data.employee ? Employee.fromJSON(data.employee) : Employee.empty(),
      data.created_at,
      data.updated_at
    );
  }
  public static empty(): Vacation {
    return new Vacation(undefined, DateTime.now().toISO(), 3, Employee.empty());
  }
}

export interface IVacation {
  id?: number;
  start: string;
  length: number;
  employee?: IEmployee;
  employee_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface FVacation {
  id?: number;
  start: Date;
  length: number;
  employee_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

// export interface IVacationPayload {
//   start: string;
//   length: number;
//   employee_id: number;
// }

// export interface IVacationFormData {
//   start: Date;
//   length: number;
//   employee: string;
// }
