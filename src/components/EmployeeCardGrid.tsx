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
import { Employee, TEmployeeList } from "../models/Employee";
import { EmployeeAPI } from "../services/EmployeeAPI";
import { DeleteModal } from "./DeleteModal";
import { EmployeeCard } from "./EmployeeCard";
import { LoadingScreen } from "./LoadingScreen";

export function EmployeeCardGrid() {
  const [state, setState] = useState<TEmployeeList>(() => {
    return {
      employees: null,
    };
  });
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const handleEmployeesLoad = (e: Employee[]) => setState({ employees: e });
    EmployeeAPI.list()
      .then(handleEmployeesLoad, (reason) => {
        showNotification({
          title: "Employee loading failed",
          message: reason.response.statusText,
          color: "red",
        });
      })
  }, [counter]);

  const [modalOpened, setModalOpened] = useState(false);
  const [onLoading, setOnLoading] = useState(false);
  const [childItem, setChildItem] = useState((<></>));
  const [deleteData, setDeleteData] = useState(Employee.empty)

  const handleDeleteClick = (data: Employee) => {
    setDeleteData(data)
    setModalOpened(true)
  }
  const handleEmployeeDelete = () => {
    if (deleteData.id !== undefined) {
      setOnLoading(true)
      EmployeeAPI.delete(deleteData.id).then(handleEmployeeDeleteSuccess, handleEmployeeDeleteError);
    } else {
      handleEmployeeDeleteError()
    }
  };
  const handleEmployeeDeleteSuccess = () => {
    setModalOpened(false);
    setOnLoading(false)
    setCounter(counter + 1)
  };
  const handleEmployeeDeleteError = (reason?: AxiosError) => {
    setOnLoading(false);
    setChildItem(
      (<Alert icon={<IconAlertCircle size={16} />} title="Something went wrong" color="red">
        {reason ? (`Something terrible happened: ${JSON.stringify(reason?.response?.data)}`) : ('Unknown error')}
      </Alert>)
    )
  }

  if (state.employees === null) {
    return <LoadingScreen />;
  }
  return (
    <>
      <DeleteModal errorChild={childItem} modalOpened={modalOpened} setModalOpened={setModalOpened} loading={onLoading} handleDeleteClick={handleEmployeeDelete}>
        <Text>Are you sure want delete {deleteData.name}?</Text>
        <Text>This action is irreversible</Text>
      </DeleteModal>
      {state.employees.length !== 0 ? (
        <SimpleGrid cols={3} spacing="sm">
          {state.employees.map((e) => (
            <EmployeeCard
              employee={e}
              canPress={true}
              key={e.id?.toString()}
              onDelete={handleDeleteClick}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Center>
          <Text size="xl">No one employee found</Text>
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
