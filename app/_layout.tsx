import "@/global.css";
import { Stack } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { PortalHost } from "@rn-primitives/portal";
import migrations from "@/drizzle/migrations";
import { db } from "@/db/client";

export default function RootLayout() {
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
    <>
      <Stack />
      <PortalHost />
    </>
  );
}
