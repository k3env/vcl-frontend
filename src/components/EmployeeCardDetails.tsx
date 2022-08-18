import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Employee, TEmployeeSingle } from "../models/Employee";
import { EmployeeAPI } from "../services/EmployeeAPI";
import { DeleteModal } from "./DeleteModal";
import { EmployeeCard } from "./EmployeeCard";
import { LoadingScreen } from "./LoadingScreen";
import { VacationCardList } from "./VacationCardList";
import { Alert, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { AxiosError } from "axios";

export function EmployeeCardDetails() {
  const [state, setState] = useState<TEmployeeSingle>(() => {
    return {
      employee: null,
    };
  });

  let params = useParams();
  useEffect(() => {
    const handleEmployeeLoad = (e: Employee) => setState({ employee: e });
    const employeeId = Number.parseInt(params.employee_id ?? "0", 10);
    EmployeeAPI.get(employeeId)
      .then(handleEmployeeLoad, (reason) => {
        showNotification({
          title: "Employee loading failed",
          message: reason.response.statusText,
          color: "red",
        });
      })
  }, [params.employee_id]);


  const [modalOpened, setModalOpened] = useState(false);
  const [onLoading, setOnLoading] = useState(false);
  const [childItem, setChildItem] = useState((<></>));
  const [deleteData, setDeleteData] = useState(Employee.empty)

  const nav = useNavigate()

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
  const handleEmployeeDeleteSuccess = () => nav("/");
  const handleEmployeeDeleteError = (reason?: AxiosError) => {
    setOnLoading(false);
    setChildItem(
      (<Alert icon={<IconAlertCircle size={16} />} title="Something went wrong" color="red">
        {reason ? (`Something terrible happened: ${JSON.stringify(reason?.response?.data)}`) : ('Unknown error')}
      </Alert>)
    )
  }

  if (state.employee === null) {
    return <LoadingScreen />;
  }
  return (
    <>
      <DeleteModal errorChild={childItem} modalOpened={modalOpened} loading={onLoading} handleDeleteClick={handleEmployeeDelete} onModalClose={() => setModalOpened(false)}>
        <Text>Are you sure want delete {state.employee.name}?</Text>
        <Text>This action is irreversible</Text>
      </DeleteModal>
      <EmployeeCard employee={state.employee} onDelete={handleDeleteClick} />
      <VacationCardList employee={state.employee} />
    </>
  );
}
