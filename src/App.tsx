import "./App.css";
import {
  EmployeeCardDetails,
  EmployeeCardGrid,
  EmployeeForm,
  ThemeSwitch,
} from "./components";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";

import {
  ColorScheme,
  ColorSchemeProvider,
  Container,
  MantineProvider,
} from "@mantine/core";
import { useState } from "react";

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
    <div className="App">
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider theme={{ colorScheme }} withGlobalStyles>
          <ThemeSwitch />
          <Container fluid>
            <Outlet />
          </Container>
        </MantineProvider>
      </ColorSchemeProvider>
    </div>
  );
}

export default App;
