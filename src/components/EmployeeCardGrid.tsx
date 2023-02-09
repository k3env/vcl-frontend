import {
  ActionIcon,
  Affix,
  Alert,
  Center,
  SimpleGrid,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle, IconPlus } from "@tabler/icons";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Employee } from "../models/Employee";
import { EmployeeAPI } from "../services/EmployeeAPI";
import { DeleteModal } from "./DeleteModal";
import { EmployeeCard } from "./EmployeeCard";
import { LoadingScreen } from "./LoadingScreen";

export function EmployeeCardGrid() {
  const [state, setState] = useState<Employee[] | null>(null);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    EmployeeAPI.list()
      .then((r) => { setState(r.data) }, (reason) => {
        showNotification({
          title: "Employee loading failed",
          message: reason.response.statusText,
          color: "red",
        });
      })
  }, [counter]);
  const handleDeleteClick = (d: Employee) => {
    setCounter(counter + 1)
  }

  if (state === null) {
    return <LoadingScreen />;
  }
  return (
    <>
      {state.length !== 0 ? (
        <SimpleGrid cols={3} spacing="sm">
          {state.map((e) => (
            <EmployeeCard
              employee={e}
              canPress={true}
              key={e._id?.toString()}
              onDelete={handleDeleteClick}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Center>
          <Text size="xl">No one employee found</Text>
          <br />
          <Text>
            You can add someone by click on green plus button at bottom
            right corner
          </Text>
        </Center>
      )}
      <Affix position={{ bottom: 10, right: 10 }}>
        <ActionIcon
          color="green"
          size="xl"
          radius="xl"
          variant="filled"
          component={Link}
          to="/employees/new"
        >
          <IconPlus />
        </ActionIcon>
      </Affix>
    </>
  );
}
