import { Button, Card, Space, Text } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";
import { Employee } from "../models/Employee";

interface EmployeeCardProps {
  canPress?: boolean;
  link?: string;
  employee: Employee;
}

export class EmployeeCard extends React.Component<EmployeeCardProps> {
  private footer() {
    if (!this.props.canPress) {
      return (
        <Card.Section p="xs">
          <Button color="blue" component={Link} to="/">
            Go back
          </Button>
          <Button
            color="yellow"
            component={Link}
            to={`/employees/${this.props.employee.id}/edit`}
            ml="xs"
          >
            Edit
          </Button>
        </Card.Section>
      );
    } else {
      return (
        <Card.Section p="xs">
          <Button
            color="green"
            component={Link}
            to={`/employees/${this.props.employee.id}`}
          >
            View
          </Button>
          <Button
            color="yellow"
            component={Link}
            to={`/employees/${this.props.employee.id}/edit`}
            ml="xs"
          >
            Edit
          </Button>
        </Card.Section>
      );
    }
  }
  render() {
    return (
      <Card withBorder shadow="sm" radius="md" p="xs" mb="xs">
        <Card.Section p="xs">
          <Text size="xl">{this.props.employee.name}</Text>
        </Card.Section>
        <Card.Section p="xs">
          <Text>{`Created: ${this.props.employee.created_at?.toLocaleString()}`}</Text>
          <Space h="xs" />
          <Text>{`Updated: ${this.props.employee.updated_at?.toLocaleString()}`}</Text>
          <Space h="xs" />
          <Text>
            Current color:{" "}
            <Text component="span" style={{ color: this.props.employee.color }}>
              {this.props.employee.color}
            </Text>
          </Text>
        </Card.Section>
        {this.footer()}
      </Card>
    );
  }
}
