import "./App.css";
import {
  EmployeeCardDetails,
  EmployeeCardGrid,
  EmployeeForm,
} from "./components";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import {
  ColorScheme,
  ColorSchemeProvider,
  Container,
  MantineProvider,
} from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useState } from "react";
import { VacationForm } from "./components/VacationForm";
import { AppHeader } from "./components/AppHeader";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppRoot />}>
          <Route index element={<EmployeeCardGrid />} />
          <Route
            path="employees/:employee_id"
            element={<EmployeeCardDetails />}
          />
          <Route
            path="employees/:employee_id/edit"
            element={<EmployeeForm />}
          />
          <Route
            path="employees/:employee_id/vacation/:vID/edit"
            element={<VacationForm />}
          />
          <Route
            path="employees/:employee_id/vacation/new"
            element={<VacationForm />}
          />
          <Route path="employees/new" element={<EmployeeForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function AppRoot() {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("dark");
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider theme={{ colorScheme }} withGlobalStyles>
        <NotificationsProvider position="top-right">
          <AppHeader links={[{ link: "/", label: "Home" }]} />
          <Container fluid>
            <Outlet />
          </Container>
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
