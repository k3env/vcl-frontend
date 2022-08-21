import { Box, Button, ColorInput, Group, NumberInput, Text, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Employee, FEmployee } from "../models/Employee";
import { EmployeeAPI } from "../services/EmployeeAPI";
import { LoadingScreen } from "./LoadingScreen";

export function EmployeeForm() {
  const [state, setState] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true)
  const form = useForm<FEmployee>({
    initialValues: {
      name: "",
      color: "",
    },
  });
  const nav = useNavigate();

  let params = useParams();
  useEffect(() => {
    const handleEmployeeLoad = (e: Employee) => {
      setState(e);
      form.setValues(e.toFormData());
      setLoading(false)
    };
    const employeeId = Number.parseInt(params.employee_id ?? "0", 10);
    EmployeeAPI.get(employeeId).then(handleEmployeeLoad, () => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.employee_id]);

  function formOnSubmit(e: FEmployee) {
    Employee.fromFormData(e).save((d) => { onRequestFulfilled(d.data) }, (e) => {
      showNotification({
        message: JSON.stringify(e.response?.data)
      })
    })
    // if (params.employee_id) {
    //   const employeeId = Number.parseInt(params.employee_id ?? "0", 10);
    //   // setState(Employee.fromJSON(e))
    //   // EmployeeAPI.patch(employeeId, state).then(onRequestFulfilled);
    // } else {
    //   // EmployeeAPI.post(e).then(onRequestFulfilled);
    // }
  }

  function onRequestFulfilled(e: Employee) {
    nav(`/employees/${e.id}`)
  }

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={form.onSubmit((v) => formOnSubmit(v))}>
        <Text size="xl">
          {state !== null
            ? `Editing ${state.name}`
            : "Create new employee"}
        </Text>
        <NumberInput label="ID" disabled {...form.getInputProps('id')} />
        <TextInput
          required
          label="Name"
          placeholder="ex. Ivanov Ivan"
          {...form.getInputProps("name")}
        />
        <ColorInput
          required
          label="Color"
          placeholder="#abcdef"
          {...form.getInputProps("color")}
        />
        <DatePicker label="Created at" disabled {...form.getInputProps('created_at')} />
        <DatePicker label="Updated at" disabled {...form.getInputProps('updated_at')} />
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
