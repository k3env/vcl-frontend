import { showNotification } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Employee } from "../models/Employee";
import { EmployeeAPI } from "../services/EmployeeAPI";
import { DeleteModal } from "./DeleteModal";
import { EmployeeCard } from "./EmployeeCard";
import { LoadingScreen } from "./LoadingScreen";
import { VacationCardList } from "./VacationCardList";
import { Alert, Text } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons";
import { AxiosError } from "axios";

export function EmployeeCardDetails() {
  const [state, setState] = useState<Employee | null>(null);

  let params = useParams();
  useEffect(() => {
    const employeeId = params.employee_id ?? "";
    EmployeeAPI.get(employeeId)
      .then((r) => { setState(r.data) }, (reason) => {
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
    if (deleteData._id !== undefined) {
      setOnLoading(true)
      EmployeeAPI.delete(deleteData._id).then(handleEmployeeDeleteSuccess, handleEmployeeDeleteError);
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

  if (state === null) {
    return <LoadingScreen />;
  }
  return (
    <>
      <DeleteModal errorChild={childItem} modalOpened={modalOpened} loading={onLoading} handleDeleteClick={handleEmployeeDelete} onModalClose={() => setModalOpened(false)}>
        <Text>Are you sure want delete {state.name}?</Text>
        <Text>This action is irreversible</Text>
      </DeleteModal>
      <EmployeeCard employee={state} onDelete={handleDeleteClick} />
      <VacationCardList employee={state} />
    </>
  );
}
