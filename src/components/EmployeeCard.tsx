import { Button, Card, Group, Space, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { Employee } from "../models/Employee";

interface EmployeeCardProps {
  canPress?: boolean;
  link?: string;
  employee: Employee;
  onDelete: (data: Employee) => void
}

export function EmployeeCard(props: EmployeeCardProps) {
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
          <Button color="red" onClick={() => props.onDelete(props.employee)}>
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
  return (
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
  );
}
