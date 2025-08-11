import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SofiaContext } from "@/hooks/sofia-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Назад" }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="questionnaire" options={{ headerShown: false }} />
      <Stack.Screen name="recipe-summary" options={{ headerShown: false }} />
      <Stack.Screen name="birthdate-input" options={{ headerShown: false }} />
      <Stack.Screen name="wisdom-flower-results" options={{ headerShown: false }} />
      <Stack.Screen name="recipe-generation" options={{ headerShown: false }} />
      <Stack.Screen name="my-recipes" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SofiaContext>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <RootLayoutNav />
        </GestureHandlerRootView>
      </SofiaContext>
    </QueryClientProvider>
  );
}