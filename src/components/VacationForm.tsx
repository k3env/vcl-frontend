import { Box, Button, Group, Text, NumberInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Employee } from "../models/Employee";
import { Vacation } from "../models/Vacation";
import { VacationAPI } from "../services/VacationAPI";
import { EmployeeAPI } from "../services/EmployeeAPI";
import { LoadingScreen } from "./LoadingScreen";

type VacationFormState = {
  vacation: Vacation | null;
  employees: EmployeeSelectData[] | null;
};

type EmployeeSelectData = {
  value: string;
  label: string;
};

export function VacationForm(props: {}) {
  const [state, setState] = useState<VacationFormState>({
    vacation: null,
    employees: null,
  });
  const form = useForm({
    initialValues: {
      start: state.vacation?.start.toJSDate() ?? DateTime.now().toJSDate(),
      length: state.vacation?.length ?? 3,
      employee: (state.vacation?.employee.id ?? 0).toString(),
    },
  });
  let params = useParams();
  useEffect(() => {
    const handleVacationLoad = (v: Vacation) => {
      const vObj = { vacation: v };
      setState((ov) => {
        return { ...ov, ...vObj };
      });
      form.setValues({
        start: v.start.toJSDate(),
        length: v.length,
        employee: (v.employee.id ?? 0).toString(),
      });
    };
    const handleEmployeesLoad = (es: Employee[]) => {
      const eObj = {
        employees: es.map<EmployeeSelectData>((e) => {
          return { value: (e.id ?? 0).toString(), label: e.name };
        }),
      };
      setState((ov) => {
        return { ...ov, ...eObj };
      });
    };
    const vID = Number.parseInt(params.vID ?? "0", 10);
    VacationAPI.get(vID).then(handleVacationLoad);
    EmployeeAPI.list().then(handleEmployeesLoad);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.vID]);
  if (state.vacation === null || state.employees === null) {
    return <LoadingScreen />;
  }
  const formOnSubmit = async (v: {
    start: Date;
    length: number;
    employee: string;
  }) => {
    // TODO: Добавить обработчик добавления нового отпуска сотруднику.
    let vacation = state.vacation;
    if (vacation !== null && (vacation.id !== 0 || vacation.id !== undefined)) {
      vacation.start = DateTime.fromJSDate(v.start);
      vacation.length = v.length;
      vacation.employee = await EmployeeAPI.get(
        Number.parseInt(v.employee, 10)
      );
    } else {
      vacation = new Vacation(
        undefined,
        DateTime.fromJSDate(v.start).toISO(),
        v.length,
        await EmployeeAPI.get(Number.parseInt(v.employee, 10))
      );
    }

    const vpl = vacation.toPayload();
    console.log(vpl);
    if (params.vID === undefined) {
      VacationAPI.post(vacation.employee.id!, vpl).then((v) =>
        window.location.assign(`/employees/${params.employee_id}`)
      );
    } else {
      VacationAPI.patch(vacation.id!, vpl).then((v) =>
        window.location.assign(`/employees/${params.employee_id}`)
      );
    }
  };
  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={form.onSubmit((v) => formOnSubmit(v))}>
        <Text size="xl">
          {params.vID
            ? `Editing vacation #${state.vacation.id}`
            : "Add vacation"}
        </Text>
        <DatePicker
          placeholder="Pick date"
          label="Start date"
          required
          {...form.getInputProps("start")}
        />
        <NumberInput
          placeholder="Your age"
          label="Vacation length"
          required
          {...form.getInputProps("length")}
        />
        <Select
          data={state.employees}
          label="Select employee"
          {...form.getInputProps("employee")}
        />
        <Group position="right" mt="md">
          <Button type="submit" color="green">
            Submit
          </Button>
          <Button color="yellow" component={Link} to="/">
            Go back
          </Button>
        </Group>
      </form>
    </Box>
  );
}
