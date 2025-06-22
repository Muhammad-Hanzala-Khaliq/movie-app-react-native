import { Stack } from "expo-router";
import "./globals.css";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true} />

      <Stack
        screenOptions={{
          // Global header styling
          headerStyle: {
            backgroundColor: "#0a0a0f", // Dark navy like your app
          },
          headerTintColor: "#e5e7eb", // Light gray for back button and title
          headerTitleStyle: {
            fontWeight: "600",
            fontSize: 18,
            color: "#e5e7eb",
          },
          headerShadowVisible: false, // Remove default shadow
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
        <Stack.Screen
          name="chat"
          options={{
            title: "AI Movie Suggestions",
            headerShown: true,
            headerStyle: {
              backgroundColor: "#0a0a0f",
              borderBottomWidth: 1,
              borderBottomColor: "#6b46c1", // Purple accent border
            },
            headerTintColor: "#e5e7eb",
            headerTitleStyle: {
              color: "#e5e7eb",
              fontWeight: "600",
              fontSize: 18,
            },
          }}
        />
      </Stack>
    </>
  );
}