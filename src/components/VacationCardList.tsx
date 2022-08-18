import { Alert, SimpleGrid, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons";
import { AxiosError } from "axios";
import { useEffect, useReducer, useState } from "react";
import { TEmployeeSingle } from "../models/Employee";
import { Vacation } from "../models/Vacation";
import { DeleteVacationModalReducer, DeleteVacationReducerState } from "../reducers/DeleteVacationModalReducer";
import { DeleteVacationResponse, VacationAPI } from "../services/VacationAPI";
import { DeleteModal } from "./DeleteModal";
import { LoadingScreen } from "./LoadingScreen";
import { VacationCard } from "./VacationCard";

export function VacationCardList(props: TEmployeeSingle) {

  const handleConfirmComplete = (data: DeleteVacationResponse) => {
    dispatch({ type: 'action-success' })
    showNotification({
      color: 'green',
      title: 'Vacation deleted',
      message: `Vacation #${data.id} deleted`
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

  const initialState: DeleteVacationReducerState = {
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
  const [state, dispatch] = useReducer(DeleteVacationModalReducer, initialState)

  useEffect(() => {
    const handleVacationsLoad = (vs: Vacation[]) => setVacations(vs);
    VacationAPI.list(props.employee?.id ?? 0).then(handleVacationsLoad);
  }, [props.employee?.id, state.count]);

  if (vacations === null) {
    return <LoadingScreen />;
  }

  const handleVacationDelete = () => {
    if (state.deletionID !== undefined) {
      dispatch({
        type: 'confirm-click',
      })
    }
  };

  const handleDeleteClick = (id?: number) => {
    if (id) {
      dispatch({ type: 'open-click', payload: { vid: id, model: (Vacation.name) } })
    } else {
      showNotification({
        color: 'red',
        title: 'Cannot delete vacation',
        message: 'Can\'t delete unsaved vacation\nUNREACHABLE STATE'
      })
    }
  }

  return (
    <>
      <DeleteModal
        errorChild={state.error}
        handleDeleteClick={handleVacationDelete}
        loading={state.onLoading}
        modalOpened={state.modalOpened}
        onModalClose={() => dispatch({ type: 'close-click' })}
      >
        <Text>Are you sure want delete vacation #{state.deletionID}?</Text>
        <Text>This action is irreversible</Text>
      </DeleteModal>
      <SimpleGrid cols={4} spacing="xs" >
        {vacations?.map((v) => (
          <VacationCard vacation={v} key={v.id?.toString()} onDelete={handleDeleteClick} />
        ))}
      </SimpleGrid>
    </>
  );
}
