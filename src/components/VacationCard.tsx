import {
  ActionIcon,
  Button,
  Card,
  Group,
  Modal,
  Space,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconPencil, IconX } from "@tabler/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Vacation } from "../models/Vacation";

type VacationProps = {
  vacation: Vacation;
  onDelete?: () => void;
};

export function VacationCard(props: VacationProps) {
  let endDate = props.vacation.start.plus({ days: props.vacation.length });
  const [modalOpened, setModalOpened] = useState(false);
  const handleVacationDelete = () => {
    showNotification({
      message: `x clicked on vacation #${JSON.stringify(props.vacation.id)}`,
      color: "red",
      title: "Deleting vacation",
      icon: <IconCheck />,
    });
    setModalOpened(false);
  };
  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Text size="xl">Are you sure?</Text>}
        centered
      >
        <Text>Are you sure want delete vacation #{props.vacation.id}?</Text>
        <Text>This action is irreversible</Text>
        <Space h="xl" />
        <Group grow spacing="xs">
          <Button color="red" onClick={handleVacationDelete}>
            Yes
          </Button>
          <Button color="gray" onClick={() => setModalOpened(false)}>
            No
          </Button>
        </Group>
      </Modal>
      <Card withBorder shadow="sm" radius="md" p="xs" mb="xs">
        <Card.Section p="xs">
          <Group position="right">
            <ActionIcon
              component={Link}
              to={`/employees/${props.vacation.employee.id}/vacation/${props.vacation.id}/edit`}
            >
              <IconPencil />
            </ActionIcon>
            <ActionIcon onClick={() => setModalOpened(true)}>
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
    </>
  );
}
