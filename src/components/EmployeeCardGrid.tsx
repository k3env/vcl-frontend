import {
  ActionIcon,
  Affix,
  Center,
  Group,
  SimpleGrid,
  Space,
  Text,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import React from "react";
import { Link } from "react-router-dom";
import { TEmployeeList } from "../models/Employee";
import { EmployeeAPI } from "../services/EmployeeAPI";
import { EmployeeCard } from "./EmployeeCard";
import { LoadingScreen } from "./LoadingScreen";

export class EmployeeCardGrid extends React.Component<{}, TEmployeeList> {
  state: TEmployeeList = {
    employees: null,
  };

  componentDidMount() {
    EmployeeAPI.list().then((es) => {
      this.setState({ employees: es });
    });
  }

  render() {
    if (this.state.employees === null) {
      return <LoadingScreen />;
    }

    return (
      <>
        {this.state.employees.length !== 0 && (
          <SimpleGrid cols={3} spacing="sm">
            {this.state.employees.map((e) => (
              <EmployeeCard
                employee={e}
                canPress={true}
                key={e.id?.toString()}
              />
            ))}
          </SimpleGrid>
        )}
        {this.state.employees.length === 0 && (
          <Center>
            <Group>
              <Text size="xl">No one employee found</Text>
              <Space h="sm" />
              <Text>
                You can add someone by click on green plus button at bottom
                right corner
              </Text>
            </Group>
          </Center>
        )}
        <Affix position={{ bottom: 10, right: 10 }}>
          <ActionIcon
            color="green"
            size="xl"
            radius="xl"
            variant="filled"
            component={Link}
            to="/employees/new"
          >
            <IconPlus />
          </ActionIcon>
        </Affix>
      </>
    );
  }
}
