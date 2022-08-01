import { Center, Loader } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Employee, TEmployeeSingle } from "../models/Employee";
import { EmployeeAPI } from "../services/EmployeeAPI";
import { EmployeeCard } from "./EmployeeCard";

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
    EmployeeAPI.get(employeeId).then(handleEmployeeLoad);
  }, [params.employee_id]);

  if (state.employee === null) {
    return (
      <Center>
        <Loader color="red" size="xl" variant="bars" />
      </Center>
    );
  }
  return <EmployeeCard employee={state.employee} />;
}
