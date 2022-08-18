import {
  ActionIcon,
  Card,
  ColorSwatch,
  Group,
  Text,
} from "@mantine/core";
import { IconPencil, IconX } from "@tabler/icons";
import { Link } from "react-router-dom";
import { Vacation } from "../models/Vacation";

type VacationProps = {
  vacation: Vacation;
  onDelete: (vacationId?: number) => void;
  showHeader?: boolean
};

export function VacationCard(props: VacationProps) {

  const header = () => {
    const actionButtons = (<Group position="right">
      <ActionIcon
        component={Link}
        to={`/employees/${props.vacation.employee.id}/vacation/${props.vacation.id}/edit`}
      >
        <IconPencil />
      </ActionIcon>
      <ActionIcon onClick={() => props.onDelete(props.vacation.id)}>
        <IconX />
      </ActionIcon>
    </Group>)
    if (props.showHeader) {

      return (
        <>
          <Group position="apart">
            <Group position="left">
              <ColorSwatch color={props.vacation.employee.color} size={18} /><Text size="xl">{props.vacation.employee.name}</Text>
            </Group>
            {actionButtons}
          </Group>

        </>)
    }
    return actionButtons
  }

  let endDate = props.vacation.start.plus({ days: (props.vacation.length - 1) });
  return (
    <Card withBorder shadow="sm" radius="md" p="xs" mb="xs">
      <Card.Section p="xs">
        {header()}
      </Card.Section>
      <Card.Section p="xs">
        <Text>From: {props.vacation.start.toLocaleString()}</Text>
        <Text>Length: {props.vacation.length} days</Text>
        <Text>Due date: {endDate.toLocaleString()}</Text>
      </Card.Section>
    </Card>
  );
}
