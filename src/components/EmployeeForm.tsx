import {
  Box,
  Button,
  Center,
  ColorInput,
  Group,
  Loader,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Employee, TEmployeeSingle } from "../models/Employee";
import { EmployeeAPI } from "../services/EmployeeAPI";

export default function EmployeeForm() {
  const [state, setState] = useState<TEmployeeSingle>({ employee: null });
  const form = useForm({
    initialValues: {
      name: state.employee?.name ?? "",
      color: state.employee?.color ?? "",
    },
  });

  let params = useParams();
  useEffect(() => {
    const handleEmployeeLoad = (e: Employee) => {
      setState({ employee: e });
      form.setValues({
        name: e.name,
        color: e.color,
      });
    };
    const employeeId = Number.parseInt(params.employee_id ?? "0", 10);
    EmployeeAPI.get(employeeId).then(handleEmployeeLoad);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.employee_id]);

  function formOnSubmit(e: Employee) {
    if (params.employee_id) {
      const employeeId = Number.parseInt(params.employee_id ?? "0", 10);
      EmployeeAPI.patch(employeeId, e).then((e) => {
        window.location.assign(`/employees/${e.id}`);
      });
    } else {
      EmployeeAPI.post(e).then((e) => {
        window.location.assign(`/employees/${e.id}`);
      });
    }
  }

  if (state.employee === null) {
    return (
      <Center>
        <Loader color="red" size="xl" variant="bars" />
      </Center>
    );
  }
  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={form.onSubmit((v) => formOnSubmit(v))}>
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
