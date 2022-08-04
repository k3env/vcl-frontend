import { DateTime } from "luxon";

export class Employee {
  id?: number;
  name: string;
  color: string;
  created_at?: DateTime;
  updated_at?: DateTime;

  constructor(
    id = 0,
    name: string,
    color: string,
    created_at?: string,
    updated_at?: string
  ) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.created_at =
      created_at === undefined ? DateTime.now() : DateTime.fromISO(created_at);
    this.updated_at =
      updated_at === undefined ? DateTime.now() : DateTime.fromISO(updated_at);
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

export type TEmployeeSingle = {
  employee: Employee | null;
};

export type TEmployeeList = {
  employees: Employee[] | null;
};
