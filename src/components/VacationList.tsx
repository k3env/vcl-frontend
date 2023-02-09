import { Alert, ColorSwatch, Grid, Group, LoadingOverlay, useMantineTheme, Text } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { showNotification } from "@mantine/notifications";
import { IconAlertCircle } from "@tabler/icons";
import { DateTime } from "luxon";
import { useEffect, useReducer, useState } from "react";
import { Vacation } from "../models/Vacation";
import { DeleteModalReducer, DeleteReducerState } from "../reducers/DeleteModalReducer";
import { VacationAPI } from "../services/VacationAPI";
import { AxiosAPIError, DeleteResponse } from "../services/_ResponseTypes";
import { DeleteModal } from "./DeleteModal";
import { VacationCard } from "./VacationCard";

type VacationHash = { [key: string]: Vacation[] }

export function VacationList() {
  const theme = useMantineTheme();
  const [day, setDay] = useState<DateTime>(DateTime.now())
  const [selectedMonth, setSelectedMonth] = useState<DateTime>(DateTime.now())
  const [vacations, setVacations] = useState<VacationHash>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [count, setCount] = useState<number>(0)

  const VacationItem = (props: { vacation: Vacation }) => {
    return <ColorSwatch color={props.vacation.employee.color} size={8} />
  }

  const handleDeleteClick = (id?: string) => {
    setCount(count + 1)
  }

  const customDayRender = (date: Date) => {
    const day = date.getDate();
    const dateString = DateTime.fromJSDate(date).toFormat('yyyy-LL-dd');
    let vs = vacations[dateString] ?? []
    let items: JSX.Element[] = vs.map((v) => (<VacationItem key={v._id} vacation={v} />)).slice(0, 5);
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
      console.log(vs)
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
  }, [count])

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
              return <Grid.Col key={v._id} span={4}><VacationCard vacation={v} onDelete={handleDeleteClick} showHeader={true} /></Grid.Col>
            }
          )
        }
      </Grid>
    </>
  )
}