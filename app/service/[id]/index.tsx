import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { deleteCategory } from "@/db/categories";
import { useServiceTree } from "@/db/live";
import { categoryTotal, formatNaira, grandTotal } from "@/lib/money";
import { formatServiceDate } from "@/lib/dates";
import { AddCategoryDialog } from "@/components/add-category-dialog";
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

import { CustomHeader } from "@/components/custom-header"

export default function ServiceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const serviceId = Number(id);

  const { services: list, ready } = useServiceTree();
  const service = list.find((s) => s.id === serviceId);

  const [addOpen, setAddOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  async function confirmDelete() {
    if (pendingDeleteId === null) return;
    await deleteCategory(pendingDeleteId);
    setPendingDeleteId(null);
  }

  if (!ready) {
    return <View className="flex-1 bg-background" />;
  }

  if (!service) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">Service not found.</Text>
      </View>
    );
  }

  const existingNames = service.categories.map((c) => c.name);
  const nextPosition =
    service.categories.reduce((max, c) => Math.max(max, c.position), -1) + 1;

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ header: () => <CustomHeader title={service.label} subtitle={formatServiceDate(service.serviceDate)}/> }} />

      <ScrollView className="flex-1" contentContainerClassName="gap-4 p-4">
        {service.categories.length === 0 && (
          <Text className="mt-10 text-center text-muted-foreground">
            No categories yet. Tap Add Category to start.
          </Text>
        )}

        {service.categories.map((c) => {
          const counted = c.entries.filter((e) => e.count > 0).length;
          return (
            <Pressable
              key={c.id}
              onPress={() =>
                router.push({
                  pathname: "/service/[id]/category/[catId]",
                  params: { id: String(serviceId), catId: String(c.id) },
                })
              }
              onLongPress={() => setPendingDeleteId(c.id)}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{c.name}</CardTitle>
                  <Text className="text-muted-foreground">
                    {counted} denomination{counted === 1 ? "" : "s"} counted
                  </Text>
                </CardHeader>
                <CardContent>
                  <Text className="text-lg font-semibold text-foreground">
                    {formatNaira(categoryTotal(c.entries))}
                  </Text>
                </CardContent>
              </Card>
            </Pressable>
          );
        })}

        <Button variant="outline" onPress={() => setAddOpen(true)}>
          <Text>Add Category</Text>
        </Button>
      </ScrollView>

      <View className="gap-3 border-t border-border bg-card p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-muted-foreground">Grand total</Text>
          <Text className="text-xl font-bold text-accent">
            {formatNaira(grandTotal(service.categories))}
          </Text>
        </View>
        <Button
          onPress={() =>
            router.push({ pathname: "/service/[id]/report", params: { id: String(serviceId) } })
          }
        >
          <Text>View Report</Text>
        </Button>
      </View>

      {addOpen && (
        <AddCategoryDialog
          serviceId={serviceId}
          existingNames={existingNames}
          nextPosition={nextPosition}
          onClose={() => setAddOpen(false)}
        />
      )}

      <AlertDialog
        open={pendingDeleteId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPendingDeleteId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this category?</AlertDialogTitle>
            <AlertDialogDescription>
              All counts in it will be deleted. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction onPress={confirmDelete}>
              <Text>Remove</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  );
}
