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
  constructor(
    public _id: string | undefined,
    public name: string,
    public color: string,
    public title: string,
    public maxDays: number,
    public onVacation: number
  ) {}

  static fromFormData(data: FEmployee): Employee {
    return new Employee(
      data._id,
      data.name,
      data.color,
      data.title,
      data.maxDays,
      data.onVacation
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
      _id: this._id,
      name: this.name,
      color: this.color,
      title: this.title,
      maxDays: this.maxDays,
      onVacation: this.onVacation,
    };
  }
  public toJSON(): IEmployee {
    return {
      name: this.name,
      color: this.color,
      title: this.title,
      _id: this._id,
      maxDays: this.maxDays,
      onVacation: this.onVacation,
    };
  }

  public static fromJSON(data: IEmployee) {
    return new Employee(
      data._id,
      data.name,
      data.color,
      data.title,
      data.maxDays,
      data.onVacation
    );
  }
  public static empty(): Employee {
    return new Employee(undefined, "", "", "", 0, 0);
  }
}

export interface IEmployee {
  _id?: string;
  name: string;
  color: string;
  title: string;
  maxDays: number;
  onVacation: number;
}

export interface FEmployee {
  _id?: string;
  name: string;
  color: string;
  title: string;
  maxDays: number;
  onVacation: number;
}
