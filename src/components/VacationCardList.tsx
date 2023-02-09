import { Alert, SimpleGrid, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons";
import { AxiosError } from "axios";
import { useEffect, useReducer, useState } from "react";
import { Employee } from "../models/Employee";
import { Vacation } from "../models/Vacation";
import { DeleteModalReducer, DeleteReducerState } from "../reducers/DeleteModalReducer";
import { VacationAPI } from "../services/VacationAPI";
import { DeleteResponse } from "../services/_ResponseTypes";
import { DeleteModal } from "./DeleteModal";
import { LoadingScreen } from "./LoadingScreen";
import { VacationCard } from "./VacationCard";

type VacationCardProps = {
  employee: Employee;
};

export function VacationCardList(props: VacationCardProps) {

  const handleConfirmComplete = (data: DeleteResponse) => {
    dispatch({ type: 'action-success' })
    showNotification({
      color: 'green',
      title: 'Vacation deleted',
      message: `Vacation #${data.data.id} deleted`
    });
  }

  const handleConfirmFail = (reason: AxiosError) => {
    dispatch({
      type: 'action-error', payload: {
        error: (<Alert icon={<IconAlertCircle size={16} />} title="Something went wrong" color="red">
          Something terrible happened: {JSON.stringify(reason)}
        </Alert>)
      }
    })
  }

  const initialState: DeleteReducerState = {
    count: 0,
    deletionID: undefined,
    deletionModel: 'Vacation',
    modalOpened: false,
    onLoading: false,
    error: null,
    callbackSuccess: (data) => { handleConfirmComplete(data) },
    callbackFail: (data) => { handleConfirmFail(data) }
  }

  const [vacations, setVacations] = useState<Vacation[] | null>(null);
  const [state, dispatch] = useReducer(DeleteModalReducer, initialState)

  useEffect(() => {
    VacationAPI.list(props.employee?._id ?? '').then((v) => {
      console.log(v)
      setVacations(v)
    });
  }, [props.employee?._id, state.count]);

  if (vacations === null) {
    return <LoadingScreen />;
  }

  const handleDeleteClick = (id?: string) => {
    setVacations(vacations.filter(v => v._id !== id))
  }

  return (
    <>
      <SimpleGrid cols={4} spacing="xs" >
        {vacations?.map((v) => (
          <VacationCard vacation={v} key={v._id} onDelete={handleDeleteClick} />
        ))}
      </SimpleGrid>
    </>
  );
}
