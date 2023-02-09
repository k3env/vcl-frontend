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
  // const [state, setState] = useState<VacationFormState>({
  //   loading: true,
  //   vacation: undefined,
  //   employees: undefined
  // });
  const nav = useNavigate();
  let { employee_id, vID } = useParams();
  const form = useForm<FVacation>({
    initialValues: {
      start: DateTime.now().toJSDate(),
      length: 3,
    },
  });

  const [loading, setLoading] = useState<boolean>(true)
  const [employees, setEmployees] = useState<EmployeeSelectData[] | null>(null)
  const [isEdit, setIsEdit] = useState<boolean>(false)

  useEffect(() => {
    EmployeeAPI.list().then(r => {
      setEmployees(r.data.map((e) => { return { value: e._id ?? '', label: e.name } }))
      form.setFieldValue('employee', employee_id)
      setLoading(false)
      if (vID) {
        VacationAPI.get(vID).then(r => {
          form.setValues({ ...r.toFormData(), employee: employee_id })
          setIsEdit(true)
        }, e => { })
      }
    }, e => nav(`/employees/${employee_id}`))
  }, [])

  if (loading) {
    return <LoadingScreen />;
  }
  const formOnSubmit = async (v: FVacation) => {
    console.log(v)

    const handleSuccessRequest = () => nav(`/employees/${v.employee}`);
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
    if (vID === undefined) {
      VacationAPI.post(v).then(
        handleSuccessRequest,
        handleError
      );
    } else {
      VacationAPI.patch(vID, v).then(
        handleSuccessRequest,
        handleError
      );
    }
  };

  // Markup here
  return (
    <Box sx={{ maxWidth: 500 }} mx="auto">
      <form onSubmit={form.onSubmit((v) => formOnSubmit(v))} onChange={(e) => { console.log(e) }}>
        <Text size="xl">
          {isEdit
            ? `Edit vacation #${form.values._id}`
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
          data={employees}
          label="Select employee"
          required
          {...form.getInputProps('employee')}
        />
        <Group position="right" mt="md">
          <Button type="submit" color="green">
            Submit
          </Button>
          <Button
            color="yellow"
            component={Link}
            to={`/employees/${employee_id}`}
          >
            Go back
          </Button>
        </Group>
      </form>
    </Box>
  );
}
