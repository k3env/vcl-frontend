import { Box, Button, Group, Text, NumberInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DatePicker } from "@mantine/dates";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Employee } from "../models/Employee";
import { FVacation, Vacation } from "../models/Vacation";
import { VacationAPI } from "../services/VacationAPI";
import { EmployeeAPI } from "../services/EmployeeAPI";
import { LoadingScreen } from "./LoadingScreen";
import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import { AxiosError } from "axios";
import { ManyResponse } from "../services/_ResponseTypes";

type VacationFormState = {
  vacation?: Vacation;
  employees?: EmployeeSelectData[];
  loading: boolean;
};

type EmployeeSelectData = {
  value: string;
  label: string;
};

export function VacationForm(props: {}) {
  const [state, setState] = useState<VacationFormState>({
    loading: true,
    vacation: undefined,
    employees: undefined
  });
  const nav = useNavigate();
  let params = useParams();
  const form = useForm<FVacation>({
    initialValues: {
      start: DateTime.now().toJSDate(),
      length: 3,
      employee_id: params.employee_id ?? '0',
    },
  });


  useEffect(() => {
    const handleVacationLoad = (v: Vacation) => {
      setState((os) => { return { ...os, ...{ vacation: v, loading: false } } })
      form.setValues(v.toFormData());
    };

    const handleError = () => {
      setState((os) => { return { ...os, ...{ loading: false } } });
      form.setValues({
        start: new Date(),
        length: 3,
        employee_id: (params.employee_id ?? 0).toString(),
      });
    }
    const handleEmployeesLoad = (es: ManyResponse<Employee>) => {
      const ems = es.data.map<EmployeeSelectData>((e) => {
        return { value: (e.id ?? 0).toString(), label: e.name };
      })
      setState((os) => { return { ...os, ...{ employees: ems, loading: true } } });

      const vID = Number.parseInt(params.vID ?? "0", 10);
      if (vID !== 0) {
        VacationAPI.get(vID).then(handleVacationLoad, handleError);
      } else {
        handleError()
      }
    };
    EmployeeAPI.list().then(handleEmployeesLoad)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.vID]);
  if (state.loading) {
    return <LoadingScreen />;
  }
  const formOnSubmit = async (v: FVacation) => {
    const handleSuccessRequest = () => nav(`/employees/${v.employee_id}`);
    const handleError = (reason: AxiosError) => {
      showNotification({
        title: `Error: ${reason.code}`,
        message: `${reason.response?.statusText
          }: ${reason.response?.config.method?.toUpperCase()} ${reason.request.responseURL
          }`,
        color: "red",
        icon: <IconX />,
      });
    };
    // let vacation = Vacation.formDataToPayload(v);
    if (params.vID === undefined) {
      VacationAPI.post(Number.parseInt(v.employee_id ?? ''), v).then(
        handleSuccessRequest,
        handleError
      );
    } else {
      VacationAPI.patch(Number.parseInt(params.vID, 10), v).then(
        handleSuccessRequest,
        handleError
      );
    }
  };

  // Markup here
  return (
    <Box sx={{ maxWidth: 500 }} mx="auto">
      <form onSubmit={form.onSubmit((v) => formOnSubmit(v))}>
        <Text size="xl">
          {state.vacation
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
          placeholder="Vacation length"
          label="Vacation length"
          required
          {...form.getInputProps("length")}
        />
        <Select
          data={state.employees}
          label="Select employee"
          required
          {...form.getInputProps('employee_id')}
        />
        <Group position="right" mt="md">
          <Button type="submit" color="green">
            Submit
          </Button>
          <Button
            color="yellow"
            component={Link}
            to={`/employees/${params.employee_id}`}
          >
            Go back
          </Button>
        </Group>
      </form>
    </Box>
  );
}
