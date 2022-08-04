import { Center, Loader } from "@mantine/core";

export function LoadingScreen() {
  return (
    <Center>
      <Loader color="red" size="xl" variant="bars" />
    </Center>
  );
}
