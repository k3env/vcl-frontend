import { Alert, ColorSwatch, Grid, Group, LoadingOverlay, useMantineTheme, Text } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons";
import { AxiosError } from "axios";
import { DateTime } from "luxon";
import { useEffect, useReducer, useState } from "react";
import { Vacation } from "../models/Vacation";
import { DeleteModalReducer, DeleteReducerState } from "../reducers/DeleteModalReducer";
import { VacationAPI } from "../services/VacationAPI";
import { DeleteResponse } from "../services/_ResponseTypes";
import { DeleteModal } from "./DeleteModal";
import { VacationCard } from "./VacationCard";

type VacationHash = { [key: string]: Vacation[] }

export function VacationList() {
  const theme = useMantineTheme();
  const [day, setDay] = useState<DateTime>(DateTime.now())
  const [selectedMonth, setSelectedMonth] = useState<DateTime>(DateTime.now())
  const [vacations, setVacations] = useState<VacationHash>({});
  const [loading, setLoading] = useState<boolean>(true);

  const VacationItem = (props: { vacation: Vacation }) => {
    return <ColorSwatch color={props.vacation.employee.color} size={8} />
  }

  const handleConfirmComplete = (data: DeleteResponse) => {
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
  const handleVacationDelete = () => {
    if (state.deletionID !== undefined) {
      dispatch({
        type: 'confirm-click',
      })
    }
  };

  const [state, dispatch] = useReducer(DeleteModalReducer, initialState)

  const customDayRender = (date: Date) => {
    const day = date.getDate();
    const dateString = DateTime.fromJSDate(date).toFormat('yyyy-LL-dd');
    let vs = vacations[dateString] ?? []
    let items: JSX.Element[] = vs.map((v) => (<VacationItem key={v.id} vacation={v} />)).slice(0, 5);
    return (
      <div>
        <Grid gutter="xs" grow>
          <Grid.Col span={6}>{day}</Grid.Col>
          {items.length > 0 && <Grid.Col span={6}>
            <Group spacing="xs">
              {items}
            </Group>
          </Grid.Col>}
        </Grid>
      </div>
    )
  }

  const handleChangeDate = (date: Date) => {
    setDay(DateTime.fromJSDate(date));
  }
  const handleMonthChange = (month: Date) => {
    console.log(month)
    setSelectedMonth(DateTime.fromJSDate(month))
  }

  useEffect(() => {
    let _vacations: VacationHash = {}
    VacationAPI.list().then((vs) => {
      vs.forEach((v) => {
        for (let di = 0; di < v.length; di++) {
          const key = v.start.plus({ days: di }).toFormat('yyyy-LL-dd');
          if (_vacations[key] === undefined) {
            _vacations[key] = []
          }
          _vacations[key].push(v)
        }
      })
      setVacations(_vacations)
      setLoading(false)
    })
  }, [state.count])

  const style = ({
    cell: {
      border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
    },
    day: { borderRadius: 0, height: 70, fontSize: theme.fontSizes.lg },
    weekday: { fontSize: theme.fontSizes.lg },
    weekdayCell: {
      fontSize: theme.fontSizes.xl,
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
      border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
        }`,
      height: 70,
    },
  })

  const key = day.toFormat('yyyy-LL-dd');

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={5} />
      <DeleteModal
        errorChild={state.error}
        handleDeleteClick={handleVacationDelete}
        loading={state.onLoading}
        modalOpened={state.modalOpened}
        onModalClose={() => dispatch({ type: 'close-click' })}
      // reducer={{ state: state, dispatch: dispatch }}
      >
        <Text>Are you sure want delete vacation #{state.deletionID}?</Text>
        <Text>This action is irreversible</Text>
      </DeleteModal>
      <Calendar
        value={day.toJSDate()}
        onChange={handleChangeDate}
        onMonthChange={handleMonthChange}
        month={selectedMonth.toJSDate()}
        fullWidth
        size="xl"
        renderDay={customDayRender}
        hideOutsideDates
        styles={style}
      />
      <Grid gutter="xs" pt="lg">
        {
          (vacations[key])?.map(
            (v) => {
              return <Grid.Col key={v.id?.toString()} span={4}><VacationCard vacation={v} onDelete={handleDeleteClick} showHeader={true} /></Grid.Col>
            }
          )
        }
      </Grid>
    </>
  )
}