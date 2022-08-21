import { AxiosError } from "axios";
import { DateTime } from "luxon";
import { EmployeeAPI } from "../services/EmployeeAPI";
import {
  SingleResponse,
  DeleteResponse,
  ErrorResponse,
} from "../services/_ResponseTypes";
import { BaseModel } from "./BaseModel";

export class Employee implements BaseModel<Employee, IEmployee, FEmployee> {
  id: number | undefined;
  name: string;
  color: string;
  created_at?: DateTime;
  updated_at?: DateTime;

  constructor(
    id: number | undefined,
    name: string,
    color: string,
    created_at?: string,
    updated_at?: string
  ) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.created_at =
      created_at === undefined ? undefined : DateTime.fromISO(created_at);
    this.updated_at =
      updated_at === undefined ? undefined : DateTime.fromISO(updated_at);
  }

  static fromFormData(data: FEmployee): Employee {
    return new Employee(
      data.id,
      data.name,
      data.color,
      data.created_at === undefined
        ? undefined
        : DateTime.fromJSDate(data.created_at).toISO(),
      data.updated_at === undefined
        ? undefined
        : DateTime.fromJSDate(data.updated_at).toISO()
    );
  }
  static formDataToInterface(data: FEmployee): IEmployee {
    return Employee.fromFormData(data).toJSON();
  }
  static interfaceToFormData(data: IEmployee): FEmployee {
    return Employee.fromJSON(data).toFormData();
  }
  toFormData(): FEmployee {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      created_at: this.created_at?.toJSDate(),
      updated_at: this.updated_at?.toJSDate(),
    };
  }
  public toJSON(): IEmployee {
    return {
      name: this.name,
      color: this.color,
      created_at: this.created_at?.toISO(),
      updated_at: this.updated_at?.toISO(),
      id: this.id,
    };
  }
  save(
    onSuccess: (data: SingleResponse<Employee>) => void,
    onFail: (error: AxiosError<ErrorResponse>) => void
  ): void {
    this.id
      ? EmployeeAPI.patch(this.id, this).then((d) => {
          onSuccess({ data: d, message: "OK", status: 200 });
        }, onFail)
      : EmployeeAPI.post(this).then((d) => {
          onSuccess({ data: d, message: "OK", status: 200 });
        }, onFail);
  }
  delete(
    onSuccess: (data: DeleteResponse) => void,
    onFail: (error: AxiosError<ErrorResponse>) => void
  ): void {
    if (this.id) {
      EmployeeAPI.delete(this.id).then(onSuccess, onFail);
    }
  }

  public static fromJSON(data: IEmployee) {
    return new Employee(
      data.id,
      data.name,
      data.color,
      data.created_at,
      data.updated_at
    );
  }
  public static empty(): Employee {
    return new Employee(undefined, "", "");
  }
}

export interface IEmployee {
  id?: number;
  name: string;
  color: string;
  created_at?: string;
  updated_at?: string;
}

export interface FEmployee {
  id?: number;
  name: string;
  color: string;
  created_at?: Date;
  updated_at?: Date;
}
