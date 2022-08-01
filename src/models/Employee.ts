import { DateTime } from "luxon";

export interface Employee {
  id?: number;
  name: string;
  color: string;
  created_at?: DateTime;
  updated_at?: DateTime;
}

export type TEmployeeSingle = {
  employee: Employee | null;
};

export type TEmployeeList = {
  employees: Employee[] | null;
};
