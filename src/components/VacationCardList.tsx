import { SimpleGrid } from "@mantine/core";
import { useEffect, useState } from "react";
import { TEmployeeSingle } from "../models/Employee";
import { Vacation } from "../models/Vacation";
import { VacationAPI } from "../services/VacationAPI";
import { LoadingScreen } from "./LoadingScreen";
import { VacationCard } from "./VacationCard";

export function VacationCardList(props: TEmployeeSingle) {
  const [state, setState] = useState<Vacation[] | null>(null);
  useEffect(() => {
    const handleVacationsLoad = (vs: Vacation[]) => setState(vs);
    VacationAPI.list(props.employee?.id ?? 0).then(handleVacationsLoad);
  }, [props.employee?.id]);

  if (state === null) {
    return <LoadingScreen />;
  }

  return (
    <SimpleGrid cols={4} spacing="xs">
      {state?.map((v) => (
        <VacationCard vacation={v} key={v.id?.toString()} />
      ))}
    </SimpleGrid>
  );
}
