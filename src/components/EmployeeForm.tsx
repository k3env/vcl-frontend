import { Box, Button, ColorInput, Group, NumberInput, Select, Text, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Employee, FEmployee } from "../models/Employee";
import { JobTitle } from "../models/JobTitle";
import { EmployeeAPI } from "../services/EmployeeAPI";
import { JobTitleAPI } from "../services/JobTitleAPI";
import { SingleResponse } from "../services/_ResponseTypes";
import { LoadingScreen } from "./LoadingScreen";

type JobTitleSelect = {
  value: string;
  label: string;
}

export function EmployeeForm() {
  const [state, setState] = useState<Employee | null>(null);
  const [titles, setTitles] = useState<JobTitleSelect[] | null>(null);
  const [loading, setLoading] = useState(true)
  const form = useForm<FEmployee>({
    validate: {
    },
    initialValues: {
      name: "",
      color: "",
      title: "",
      maxDays: 0,
      onVacation: 0
    },
  });
  const nav = useNavigate();

  let { employee_id } = useParams();
  useEffect(() => {
    console.log(employee_id)
    JobTitleAPI.list().then((r) => {
      setTitles(r.data.map((t) => { return { value: (t._id ?? 0).toString(), label: t.title } }))
      const handleEmployeeLoad = (e: SingleResponse<Employee>) => {
        console.log(e)
        setState(e.data);
        form.setValues(e.data.toFormData());
        setLoading(false)
      };
      if (employee_id) {
        EmployeeAPI.get(employee_id).then(handleEmployeeLoad, () => setLoading(false));
      } else {
        setLoading(false)
      }
    }, (e) => { })
  }, []);

  function formOnSubmit(e: FEmployee) {
    console.log(e)
    if (employee_id) {
      EmployeeAPI.patch(employee_id, Employee.fromFormData(e)).then((d) => { onRequestFulfilled(d) }, (e) => {
        showNotification({
          message: JSON.stringify(e.response?.data)
        })
      })
    } else {
      EmployeeAPI.post(Employee.fromFormData(e)).then((d) => { onRequestFulfilled(d) }, (e) => {
        showNotification({
          message: JSON.stringify(e.response?.data)
        })
      })
    }
  }

  function onRequestFulfilled(d: SingleResponse<Employee>) {
    showNotification({
      message: d.message
    })
    nav(`/employees/${d.data._id}`)
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
        <TextInput label="ID" disabled {...form.getInputProps('_id')} />
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
        <Select
          data={titles}
          label="Select job title"
          required
          {...form.getInputProps('title')}
        />
        <NumberInput label="Max vacation days" {...form.getInputProps('maxDays')} />
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
