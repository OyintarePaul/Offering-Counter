import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router, Stack } from "expo-router";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { services } from "@/db/schema";
import { useServiceTree } from "@/db/live";
import { formatNaira, grandTotal } from "@/lib/money";
import { formatServiceDate } from "@/lib/dates";
import { NewServiceDialog } from "@/components/new-service-dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { CustomHeader } from "@/components/custom-header"

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
  const { services: list, ready } = useServiceTree();

  const [newOpen, setNewOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  function confirmDelete() {
    if (pendingDeleteId === null) return;
    db.delete(services).where(eq(services.id, pendingDeleteId)).run();
    setPendingDeleteId(null);
  }

  return (
    <View className="flex-1 bg-background">
        <Stack.Screen options={{ header: ({ back }) => <CustomHeader subtitle="Offering Counter" title="Services" back={back}/> }}/>
      <ScrollView className="flex-1" contentContainerClassName="gap-4 p-4">
        {ready && list.length === 0 && (
          <Text className="mt-10 text-center text-muted-foreground">
            No services yet. Tap New Service to start.
          </Text>
        )}

        {ready &&
          list.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => router.push({ pathname: "/service/[id]", params: { id: String(s.id) } })}
            >
              <Card>
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
            </Pressable>
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
