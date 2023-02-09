import { Button, Card, Group, Space, Text } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Employee } from "../models/Employee";
import { JobTitle } from "../models/JobTitle";
import { EmployeeAPI } from "../services/EmployeeAPI";
import { JobTitleAPI } from "../services/JobTitleAPI";
import { DeleteResponse } from "../services/_ResponseTypes";

interface EmployeeCardProps {
  canPress?: boolean;
  link?: string;
  employee: Employee;
  onDelete: (data: Employee) => void
}

export function EmployeeCard(props: EmployeeCardProps) {

  const deleteModal = () => {
    openConfirmModal({
      title: `Delete ${props.employee.name}?`,
      children: (
        <Text size="sm">
          Are you sure you want to delete your profile? This action is destructive and you will have
          to contact support to restore your data.
        </Text>
      ),
      labels: { confirm: 'Delete employee', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onCancel: () => { },
      onConfirm: () => handleEmployeeDelete(),
    })
  }

  const handleEmployeeDelete = () => {
    if (props.employee._id !== undefined) {
      EmployeeAPI.delete(props.employee._id).then(handleEmployeeDeleteSuccess, handleEmployeeDeleteError);
    } else {
      handleEmployeeDeleteError()
    }
  };
  const handleEmployeeDeleteSuccess = (r: DeleteResponse) => {
    showNotification({
      message: r.message,
      color: "green",
      title: 'Deleted'
    })
    props.onDelete(props.employee)
  };
  const handleEmployeeDeleteError = (reason?: AxiosError) => {
    showNotification({
      message: reason ? (`Something terrible happened: ${JSON.stringify(reason?.response?.data)}`) : ('Unknown error'),
      color: "red",
      title: 'Something went wrong'
    })
  }

  const [title, setTitle] = useState<JobTitle | null>(null)
  const footer = () => {
    return (
      <Card.Section p="xs">
        <Group spacing="xs">
          {!props.canPress ? (
            <Button color="blue" component={Link} to="/">
              Show all
            </Button>
          ) : (
            <Button
              color="green"
              component={Link}
              to={`/employees/${props.employee._id}`}
            >
              View
            </Button>
          )}
          <Button
            color="yellow"
            component={Link}
            to={`/employees/${props.employee._id}/edit`}
          >
            Edit
          </Button>
          <Button color="red" onClick={() => deleteModal()}>
            Delete
          </Button>
          {!props.canPress && (
            <Button
              color="green"
              component={Link}
              to={`/employees/${props.employee._id}/vacation/new`}
            >
              Add vacation
            </Button>
          )}
        </Group>
      </Card.Section>
    );
  };
  useEffect(() => {
    JobTitleAPI.get(props.employee.title).then((v) => {
      setTitle(v.data)
    })
  }, [])
  return (
    <Card withBorder shadow="sm" radius="md" p="xs" mb="xs">
      <Card.Section p="xs">
        <Text size="xl">{props.employee.name}</Text>
      </Card.Section>
      <Card.Section p="xs">
        <Text>{`Job title: ${title?.title}`}</Text>
        <Text>
          Current color:{" "}
          <Text component="span" style={{ color: props.employee.color }}>
            {props.employee.color}
          </Text>
        </Text>
        <Text>{`Vacation days: ${props.employee.maxDays} / ${props.employee.onVacation}`}</Text>
      </Card.Section>
      {footer()}
    </Card>
  );
}
