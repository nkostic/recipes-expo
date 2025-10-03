import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initDatabase } from '../lib/database';

const queryClient = new QueryClient();

export default function RootLayout() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="create" options={{ title: 'Create Recipe' }} />
        <Stack.Screen name="recipe" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}
