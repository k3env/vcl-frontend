import {
  ActionIcon,
  Card,
  ColorSwatch,
  Group,
  Text,
} from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconPencil, IconX } from "@tabler/icons";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { Vacation } from "../models/Vacation";
import { VacationAPI } from "../services/VacationAPI";
import { DeleteResponse } from "../services/_ResponseTypes";

type VacationProps = {
  vacation: Vacation;
  onDelete: (vacationId?: string) => void;
  showHeader?: boolean
};

export function VacationCard(props: VacationProps) {
  const deleteModal = () => {
    openConfirmModal({
      title: `Delete vacation #${props.vacation._id}?`,
      children: (
        <Text size="sm">
          Are you sure you want to delete your profile? This action is destructive and you will have
          to contact support to restore your data.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onCancel: () => { },
      onConfirm: () => handleEmployeeDelete(),
    })
  }
  const handleEmployeeDelete = () => {
    if (props.vacation._id !== undefined) {
      VacationAPI.delete(props.vacation._id).then(handleEmployeeDeleteSuccess, handleEmployeeDeleteError);
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
    props.onDelete(props.vacation._id)
  };
  const handleEmployeeDeleteError = (reason?: AxiosError) => {
    showNotification({
      message: reason ? (`Something terrible happened: ${JSON.stringify(reason?.response?.data)}`) : ('Unknown error'),
      color: "red",
      title: 'Something went wrong'
    })
  }
  const header = () => {
    const actionButtons = (
      <Group position="right">
        <ActionIcon
          component={Link}
          to={`/employees/${props.vacation.employee._id}/vacation/${props.vacation._id}/edit`}
        >
          <IconPencil />
        </ActionIcon>
        <ActionIcon onClick={() => deleteModal()}>
          <IconX />
        </ActionIcon>
      </Group>)
    if (props.showHeader) {

      return (
        <Group position="apart">
          <Group position="left">
            <ColorSwatch color={props.vacation.employee.color} size={18} /><Text size="xl">{props.vacation.employee.name}</Text>
          </Group>
          {actionButtons}
        </Group>
      )
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
