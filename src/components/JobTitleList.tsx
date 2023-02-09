import { Box, Button, Group, TextInput, Text, Divider, Badge, Chip, Card, CloseButton } from "@mantine/core";
import { useForm } from "@mantine/form";
import { openConfirmModal } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useEffect, useState } from "react"
import { FJobTitle, JobTitle } from "../models/JobTitle"
import { JobTitleAPI } from "../services/JobTitleAPI"
import { DeleteResponse } from "../services/_ResponseTypes";


export function JobTitleItem(props: { title: JobTitle, onDelete: (id: string) => void }) {
  const deleteModal = () => {
    openConfirmModal({
      title: `Delete ${props.title.title}?`,
      children: (
        <Text size="sm">
          Are you sure you want to delete your profile? This action is destructive and you will have
          to contact support to restore your data.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: "No don't delete it" },
      confirmProps: { color: 'red' },
      onCancel: () => { },
      onConfirm: () => handleEmployeeDelete(),
    })
  }

  const handleEmployeeDelete = () => {
    if (props.title._id !== undefined) {
      JobTitleAPI.delete(props.title._id).then(handleEmployeeDeleteSuccess, handleEmployeeDeleteError);
    } else {
      handleEmployeeDeleteError()
    }
  };
  const handleEmployeeDeleteSuccess = (r: DeleteResponse) => {
    showNotification({
      message: r.message,
      color: "green",
      title: 'Deleted'
    })
    props.onDelete(props.title._id ?? '')
  };
  const handleEmployeeDeleteError = (reason?: AxiosError) => {
    showNotification({
      message: reason ? (`Something terrible happened: ${JSON.stringify(reason?.response?.data)}`) : ('Unknown error'),
      color: "red",
      title: 'Something went wrong'
    })
  }

  return (
    <Box sx={{ maxWidth: '500px', borderColor: 'ActiveBorder', borderWidth: '1px', borderStyle: 'solid', borderRadius: '10px' }} m={'xs'} p={"xs"}>
      <Group position="apart">
        <Text>{props.title.title}</Text>
        <CloseButton title="Delete" size="xl" iconSize={20} onClick={deleteModal} />
      </Group>
    </Box>
  );
}

export function JobTitleList() {
  const [titles, setTitles] = useState<JobTitle[] | null>(null)
  const [counter, setCounter] = useState<number>(0)

  const form = useForm<FJobTitle>({
    initialValues: {
      title: '',
    },
  });

  function resetFields() {
    form.reset()
  }

  function formOnSubmit(e: FJobTitle) {
    console.log(e)
    JobTitle.fromFormData(e).save((d) => {
      showNotification({
        message: JSON.stringify(d)
      })
      setCounter(counter + 1)
      form.reset()
    }, (e) => {
      showNotification({
        message: JSON.stringify(e.response?.data)
      })
    })
  }

  useEffect(() => {
    JobTitleAPI.list().then(r => {
      setTitles(r.data)
    })
  }, [counter])

  if (titles === null) {
    return <div>Titles is loading</div>
  }

  return (
    <div>
      {titles.map(t => (
        <JobTitleItem title={t} key={t._id} onDelete={(id) => setCounter(counter + 1)} />
        // <Chip defaultChecked key={t._id} size="xl" my={'sm'}>{t.title}</Chip>
      ))}
      <Divider my="sm" />
      <Box sx={{ maxWidth: 400 }}>
        <Text size={"lg"}>
          Add new title
        </Text>
        <form onSubmit={form.onSubmit((v) => formOnSubmit(v))}>
          <Group>
            <Group>
              <TextInput
                required
                // label="Job title"
                placeholder="ex. System administrator"
                {...form.getInputProps("title")}
              />
            </Group>
            <Group>
              <Button type="submit" color="green">
                Add
              </Button>
              <Button color="red" onClick={resetFields}>
                Reset
              </Button>
            </Group>
          </Group>
        </form>
      </Box>
    </div>
  )
}