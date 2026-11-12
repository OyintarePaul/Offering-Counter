import { Button, Text, View } from "react-native";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { db } from "@/db/client";
import { services } from "@/db/schema";

export default function Index() {
  const { data } = useLiveQuery(db.select().from(services));

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-background">
      <Text className="text-foreground text-lg">Services saved: {data.length}</Text>
      <Button
        title="Add test service"
        onPress={() => {
          db.insert(services)
            .values({
              serviceDate: "2026-11-15",
              label: "Main Service",
              createdAt: new Date(),
            })
            .onConflictDoNothing()
            .run();
        }}
      />
    </View>
  );
}
