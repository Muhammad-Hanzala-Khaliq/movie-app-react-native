// app/_layout.tsx
import { Stack, Redirect } from "expo-router";
import { StatusBar, Text, View } from "react-native";
import { useAuth } from "../context/AuthContext";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar hidden />
      <AuthLayout />
    </AuthProvider>
  );
}

function AuthLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false, // 👈 Ye line sab headers hide kar degi
      }}
    >
      {user ? (
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="auth/login"
            options={{
              title: "Login",
              headerStyle: { backgroundColor: "#0a0a0f" },
              headerTintColor: "#e5e7eb",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="auth/signup"
            options={{
              title: "Sign Up",
              headerStyle: { backgroundColor: "#0a0a0f" },
              headerTintColor: "#e5e7eb",
              headerShown: false,
            }}
          />
          <Redirect href="/auth/login" />
        </>
      )}
      <Stack.Screen
        name="chat"
        options={{
          title: "AI Movie Suggestions",
          headerStyle: { backgroundColor: "#0a0a0f" },
          headerTintColor: "#e5e7eb",
          headerShown: true,
        }}
      />
    </Stack>
  );
}
