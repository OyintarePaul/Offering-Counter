import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { services } from "@/db/schema";
import { formatNaira, grandTotal } from "@/lib/money";
import { formatServiceDate } from "@/lib/dates";
import { NewServiceDialog } from "@/components/new-service-dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function ServicesScreen() {
  const { data } = useLiveQuery(
    db.query.services.findMany({
      orderBy: [desc(services.serviceDate), desc(services.createdAt)],
      with: { categories: { with: { entries: true } } },
    })
  );

  const [newOpen, setNewOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  function confirmDelete() {
    if (pendingDeleteId === null) return;
    db.delete(services).where(eq(services.id, pendingDeleteId)).run();
    setPendingDeleteId(null);
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView className="flex-1" contentContainerClassName="gap-4 p-4">
        {data.length === 0 && (
          <Text className="mt-10 text-center text-muted-foreground">
            No services yet. Tap New Service to start.
          </Text>
        )}

        {data.map((s) => (
          <Card key={s.id}>
            <CardHeader>
              <CardTitle>{formatServiceDate(s.serviceDate)}</CardTitle>
              <Text className="text-muted-foreground">
                {s.label} · {s.categories.length} categories
              </Text>
            </CardHeader>
            <CardContent className="flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-accent">
                {formatNaira(grandTotal(s.categories))}
              </Text>
              <Button variant="destructive" size="sm" onPress={() => setPendingDeleteId(s.id)}>
                <Text>Delete</Text>
              </Button>
            </CardContent>
          </Card>
        ))}
      </ScrollView>

      <View className="p-4">
        <Button onPress={() => setNewOpen(true)}>
          <Text>New Service</Text>
        </Button>
      </View>

      {newOpen && <NewServiceDialog onClose={() => setNewOpen(false)} />}

      <AlertDialog
        open={pendingDeleteId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPendingDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this service?</AlertDialogTitle>
            <AlertDialogDescription>
              Its categories and counts will be removed. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={confirmDelete}>
              <Text>Delete</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
