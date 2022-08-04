import { Button, Card, Group, Modal, Space, Text } from "@mantine/core";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Employee } from "../models/Employee";
import { EmployeeAPI } from "../services/EmployeeAPI";

interface EmployeeCardProps {
  canPress?: boolean;
  link?: string;
  employee: Employee;
}

export function EmployeeCard(props: EmployeeCardProps) {
  const [modalOpened, setModalOpened] = useState(false);
  const footer = () => {
    return (
      <Card.Section p="xs">
        <Group spacing="xs">
          {!props.canPress && (
            <Button color="blue" component={Link} to="/">
              Show all
            </Button>
          )}
          {props.canPress && (
            <Button
              color="green"
              component={Link}
              to={`/employees/${props.employee.id}`}
            >
              View
            </Button>
          )}
          <Button
            color="yellow"
            component={Link}
            to={`/employees/${props.employee.id}/edit`}
          >
            Edit
          </Button>
          <Button color="red" onClick={() => setModalOpened(true)}>
            Delete
          </Button>
          {!props.canPress && (
            <Button
              color="green"
              component={Link}
              to={`/employees/${props.employee.id}/vacation/new`}
            >
              Add vacation
            </Button>
          )}
        </Group>
      </Card.Section>
    );
  };
  const handleEmployeeDelete = () => {
    EmployeeAPI.delete(props.employee.id!).then(() => {
      window.location.assign("/");
    });
  };
  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Text size="xl">Are you sure?</Text>}
        centered
      >
        <Text>Are you sure want delete {props.employee.name}?</Text>
        <Text>This action is irreversible</Text>
        <Space h="xl" />
        <Group grow spacing="xs">
          <Button color="red" onClick={handleEmployeeDelete}>
            Yes
          </Button>
          <Button color="gray" onClick={() => setModalOpened(false)}>
            No
          </Button>
        </Group>
      </Modal>
      <Card withBorder shadow="sm" radius="md" p="xs" mb="xs">
        <Card.Section p="xs">
          <Text size="xl">{props.employee.name}</Text>
        </Card.Section>
        <Card.Section p="xs">
          <Text>{`Created: ${props.employee.created_at?.toLocaleString()}`}</Text>
          <Space h="xs" />
          <Text>{`Updated: ${props.employee.updated_at?.toLocaleString()}`}</Text>
          <Space h="xs" />
          <Text>
            Current color:{" "}
            <Text component="span" style={{ color: props.employee.color }}>
              {props.employee.color}
            </Text>
          </Text>
        </Card.Section>
        {footer()}
      </Card>
    </>
  );
}
