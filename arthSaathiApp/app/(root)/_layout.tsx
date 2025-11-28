import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="dynamic-persona" options={{ headerShown: false }} />
      <Stack.Screen
        name="persona-simulation"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="assessment-report" options={{ headerShown: false }} />
      <Stack.Screen name="survey" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
