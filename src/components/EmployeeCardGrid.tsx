import { ActionIcon, Center, Loader, SimpleGrid } from "@mantine/core";
import { IconPlus } from "@tabler/icons";
import React from "react";
import { Link } from "react-router-dom";
import { TEmployeeList } from "../models/Employee";
import { EmployeeAPI } from "../services/EmployeeAPI";
import { EmployeeCard } from "./EmployeeCard";

export class EmployeeCardGrid extends React.Component<{}, TEmployeeList> {
  state: TEmployeeList = {
    employees: null,
  };

  componentDidMount() {
    // TODO: убрать таймаут.
    EmployeeAPI.list().then((es) => {
      setTimeout(() => this.setState({ employees: es }), 1000);
    });
  }

  render() {
    if (this.state.employees === null) {
      return (
        <Center>
          <Loader color="red" size="xl" variant="bars" />
        </Center>
      );
    } else {
      let items = this.state.employees.map((e) => (
        <EmployeeCard employee={e} canPress={true} key={e.id?.toString()} />
      ));
      return (
        <>
          <SimpleGrid cols={3} spacing="sm">
            {items}
          </SimpleGrid>
          <ActionIcon
            color="green"
            size="xl"
            radius="xl"
            variant="filled"
            style={{ position: "absolute", bottom: "10px", right: "10px" }}
            component={Link}
            to="/employees/new"
          >
            <IconPlus />
          </ActionIcon>
        </>
      );
    }
  }
}
