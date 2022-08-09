import {
  ActionIcon,
  Card,
  Group,
  Text,
} from "@mantine/core";
import { IconPencil, IconX } from "@tabler/icons";
import { Link } from "react-router-dom";
import { Vacation } from "../models/Vacation";

type VacationProps = {
  vacation: Vacation;
  onDelete: (data?: any) => void;
};

export function VacationCard(props: VacationProps) {
  let endDate = props.vacation.start.plus({ days: props.vacation.length });
  return (
    <Card withBorder shadow="sm" radius="md" p="xs" mb="xs">
      <Card.Section p="xs">
        <Group position="right">
          <ActionIcon
            component={Link}
            to={`/employees/${props.vacation.employee.id}/vacation/${props.vacation.id}/edit`}
          >
            <IconPencil />
          </ActionIcon>
          <ActionIcon onClick={() => props.onDelete(props.vacation.id)}>
            <IconX />
          </ActionIcon>
        </Group>
      </Card.Section>
      <Card.Section p="xs">
        <Text>From: {props.vacation.start.toLocaleString()}</Text>
        <Text>Length: {props.vacation.length} days</Text>
        <Text>Due date: {endDate.toLocaleString()}</Text>
      </Card.Section>
    </Card>
  );
}
