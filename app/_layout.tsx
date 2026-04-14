import { Stack } from "expo-router";
import { TodoProvider } from "../hooks/TodoContext";

export default function RootLayout() {
  return (
    <TodoProvider>
      <Stack />
    </TodoProvider>
  );
}
