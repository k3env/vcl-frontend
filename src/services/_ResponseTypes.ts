import { IEmployee } from "../models/Employee";
import { IVacation } from "../models/Vacation";

export type EmployeeResponseSingle = {
  status?: number;
  employee: IEmployee;
};
export type VacationsResponse = {
  status?: number;
  vacations: IVacation[];
};
export type VacationResponse = {
  vacation: IVacation;
};

export type DeleteResponse = {
  status: string;
  id: number;
};
