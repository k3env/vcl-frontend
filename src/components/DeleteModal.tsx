import { Modal, Space, Group, Button, Text } from "@mantine/core";
import React from "react";
import { DeleteVacationReducerAction, DeleteVacationReducerState } from "../reducers/DeleteVacationModalReducer";

interface DeleteModalProps {
  modalOpened: boolean,
  handleDeleteClick: () => void,
  onModalClose: () => void,
  loading: boolean,
  errorChild: React.ReactNode | null,
  children: React.ReactNode
  reducer?: { state: DeleteVacationReducerState, dispatch: React.Dispatch<DeleteVacationReducerAction> }
}

export function DeleteModal(props: DeleteModalProps) {
  if (props.reducer !== undefined) {
    const { state, dispatch } = props.reducer

    const handleDeleteClick = () => (id?: number) => {
      if (id) {
        dispatch({
          type: 'confirm-click',
        })
      }
    }

    return <Modal
      opened={state.modalOpened}
      onClose={() => dispatch({ type: 'close-click' })}
      title={<Text size="xl">Are you sure?</Text>}
      centered
    >
      {props.children}
      <Group spacing="xl" hidden={state.error === null}>
        <Space h="xs" />
        {state.error}
        <Space h="xs" />
      </Group>
      <Group grow spacing="xs">
        <Button
          color="red"
          onClick={handleDeleteClick}
          loading={state.onLoading}
        >
          Yes
        </Button>
        <Button color="gray" onClick={() => dispatch({ type: 'close-click' })}>
          No
        </Button>
      </Group>
    </Modal>
  }
  return <Modal
    opened={props.modalOpened}
    onClose={() => props.onModalClose()}
    title={<Text size="xl">Are you sure?</Text>}
    centered
  >
    {props.children}
    <Group spacing="xl" hidden={props.errorChild === null}>
      <Space h="xs" />
      {props.errorChild}
      <Space h="xs" />
    </Group>
    <Group grow spacing="xs">
      <Button
        color="red"
        onClick={props.handleDeleteClick}
        loading={props.loading}
      >
        Yes
      </Button>
      <Button color="gray" onClick={() => props.onModalClose()}>
        No
      </Button>
    </Group>
  </Modal>
}