import { Modal, Space, Group, Button, Text } from "@mantine/core";

type DeleteModalProps = { modalOpened: boolean, setModalOpened: (arg0: boolean) => void, handleDeleteClick: () => void, loading: boolean, errorChild: React.ReactNode, children: React.ReactNode }

export function DeleteModal(props: DeleteModalProps) {
  return <Modal
    opened={props.modalOpened}
    onClose={() => props.setModalOpened(false)}
    title={<Text size="xl">Are you sure?</Text>}
    centered
  >
    {props.children}
    <Space h="xl" />
    {props.errorChild}
    <Space h="xl" />
    <Group grow spacing="xs">
      <Button
        color="red"
        onClick={props.handleDeleteClick}
        loading={props.loading}
      >
        Yes
      </Button>
      <Button color="gray" onClick={() => props.setModalOpened(false)}>
        No
      </Button>
    </Group>
  </Modal>
}