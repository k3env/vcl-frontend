import { Employee, IEmployee } from "./Employee";
import { DateTime } from "luxon";

export class Vacation {
  id?: number;
  start: DateTime;
  length: number;
  employee: Employee;
  created_at?: DateTime;
  updated_at?: DateTime;

  constructor(
    id = 0,
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
      created_at === undefined ? DateTime.now() : DateTime.fromISO(created_at);
    this.updated_at =
      updated_at === undefined ? DateTime.now() : DateTime.fromISO(updated_at);
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
  public toPayload(): IVacationPayload {
    const pl: IVacationPayload = {
      start: this.start.toISO(),
      length: this.length,
      employee_id: this.employee.id!,
    };
    return pl;
  }

  public static formDataToPayload(
    formData: IVacationFormData
  ): IVacationPayload {
    return {
      start: DateTime.fromJSDate(formData.start).toISO(),
      employee_id: Number.parseInt(formData.employee, 10),
      length: formData.length,
    };
  }
}

export interface IVacation {
  id?: number;
  start: string;
  length: number;
  employee?: IEmployee;
  created_at?: string;
  updated_at?: string;
}

export interface IVacationPayload {
  start: string;
  length: number;
  employee_id: number;
}

export interface IVacationFormData {
  start: Date;
  length: number;
  employee: string;
}
