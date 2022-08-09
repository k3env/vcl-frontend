import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Employee, TEmployeeSingle } from "../models/Employee";
import { EmployeeAPI } from "../services/EmployeeAPI";
import { EmployeeCard } from "./EmployeeCard";
import { LoadingScreen } from "./LoadingScreen";
import { VacationCardList } from "./VacationCardList";

export function EmployeeCardDetails() {
  const [state, setState] = useState<TEmployeeSingle>(() => {
    return {
      employee: null,
    };
  });

  let params = useParams();
  useEffect(() => {
    const handleEmployeeLoad = (e: Employee) => setState({ employee: e });
    const employeeId = Number.parseInt(params.employee_id ?? "0", 10);
    EmployeeAPI.get(employeeId)
      .then(handleEmployeeLoad)
      .catch((reason) => {
        showNotification({
          title: "Employee loading failed",
          message: reason.response.statusText,
          color: "red",
        });
      });
  }, [params.employee_id]);

  if (state.employee === null) {
    return <LoadingScreen />;
  }
  return (
    <>
      <EmployeeCard employee={state.employee} />
      <VacationCardList employee={state.employee} />
    </>
  );
}
