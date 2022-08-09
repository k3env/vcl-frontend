import { Alert, Button, Group, Modal, SimpleGrid, Space, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { TEmployeeSingle } from "../models/Employee";
import { Vacation } from "../models/Vacation";
import { DeleteVacationResponse, VacationAPI } from "../services/VacationAPI";
import { LoadingScreen } from "./LoadingScreen";
import { VacationCard } from "./VacationCard";

export function VacationCardList(props: TEmployeeSingle) {
  const [state, setState] = useState<Vacation[] | null>(null);
  const [count, setCount] = useState<number>(0)
  const [vID, setVID] = useState<number | undefined>()
  useEffect(() => {
    const handleVacationsLoad = (vs: Vacation[]) => setState(vs);
    VacationAPI.list(props.employee?.id ?? 0).then(handleVacationsLoad);
  }, [props.employee?.id, count]);

  const [modalOpened, setModalOpened] = useState(false);
  const [onLoading, setOnLoading] = useState(false);
  const [childItem, setChildItem] = useState((<></>));

  if (state === null) {
    return <LoadingScreen />;
  }

  const handleVacationDelete = () => {
    if (vID !== undefined) {
      setOnLoading(true);
      VacationAPI.delete(vID)
        .then((data) => {
          setOnLoading(false);
          setModalOpened(false);
          handleDeleteSuccess(data)
        }, (reason: AxiosError) => {
          setOnLoading(false);
          setChildItem((<Alert icon={<IconAlertCircle size={16} />} title="Something went wrong" color="red">
            Something terrible happened: {JSON.stringify(reason.response?.data)}
          </Alert>))
        });
    }
  };

  const handleDeleteSuccess = (data: DeleteVacationResponse) => {
    setCount(count + 1);
    showNotification({
      color: 'green',
      title: 'Vacation deleted',
      message: `Vacation #${data.id} deleted`
    })
  }

  const handleDeleteClick = (id: number) => {
    setVID(id);
    setModalOpened(true)
  }

  return (
    <>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Text size="xl">Are you sure?</Text>}
        centered
      >
        <Text>Are you sure want delete vacation #{vID}?</Text>
        <Text>This action is irreversible</Text>
        <Space h="xl" />
        {childItem}
        <Space h="xl" />
        <Group grow spacing="xs">
          <Button
            color="red"
            onClick={handleVacationDelete}
            loading={onLoading}
          >
            Yes
          </Button>
          <Button color="gray" onClick={() => setModalOpened(false)}>
            No
          </Button>
        </Group>
      </Modal>
      <SimpleGrid cols={4} spacing="xs">
        {state?.map((v) => (
          <VacationCard vacation={v} key={v.id?.toString()} onDelete={handleDeleteClick} />
        ))}
      </SimpleGrid>
    </>
  );
}
