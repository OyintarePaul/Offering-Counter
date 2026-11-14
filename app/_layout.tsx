import "@/global.css";
import { Stack } from "expo-router";
import { ActivityIndicator, Text, View, useColorScheme } from "react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { PortalHost } from "@rn-primitives/portal";
import migrations from "@/drizzle/migrations";
import { db } from "@/db/client";
import { ThemeProvider } from 'expo-router/react-navigation';
import { NAV_THEME } from '@/lib/theme';
import { StatusBar } from 'expo-status-bar';
import { useUniwind } from "uniwind";


export default function RootLayout() {
  const { theme } = useUniwind();
  const resolvedTheme = theme === 'dark' ? 'dark' : 'light';
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-destructive">Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ThemeProvider value={NAV_THEME[resolvedTheme]}>
      <StatusBar style={resolvedTheme === 'dark' ? 'light' : 'dark'} />
      <Stack />
      <PortalHost />
    </ThemeProvider>
  );
}
