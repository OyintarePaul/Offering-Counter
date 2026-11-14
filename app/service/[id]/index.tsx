import { useCallback, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useServiceTree } from "@/db/live";
import { formatServiceDate } from "@/lib/dates";
import { AddCategoryDialog } from "@/components/service-detail/add-category-dialog";
import { ViewReportBtn } from "@/components/service-detail/view-report-btn"
import { CustomHeader } from "@/components/custom-header";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Plus } from "lucide-react-native"

import {
  CategoryCard,
  type CategoryItem,
} from "@/components/service-detail/category-card";
import { EmptyCategories } from "@/components/service-detail/empty-categories";
import { ServiceSummary } from "@/components/service-detail/service-summary";

export default function ServiceDetailsScreen() {
  const insets = useSafeAreaInsets();
  const [addOpen, setAddOpen] = useState(false)
  const { id } = useLocalSearchParams<{ id: string }>();
  const serviceId = Number(id);

  const { services: list, ready } = useServiceTree();
  const service = list.find((s) => s.id === serviceId);

  const existingNames = useMemo(
    () => service?.categories.map((c) => c.name) ?? [],
    [service?.categories]
  );

  const nextPosition = useMemo(
    () =>
      (service?.categories.reduce((max, c) => Math.max(max, c.position), -1) ??
        -1) + 1,
    [service?.categories]
  );

  const handleOpenCategory = useCallback(
    (catId: number) => {
      router.push({
        pathname: "/service/[id]/category/[catId]",
        params: { id: String(serviceId), catId: String(catId) },
      });
    },
    [serviceId]
  );

  const renderItem = useCallback(
    ({ item }: { item: CategoryItem }) => (
      <CategoryCard
        category={item}
        serviceId={serviceId}
      />
    ),
    [handleOpenCategory]
  );

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

  return (
    <View style={{ paddingBottom: Math.max(insets.bottom, 30) }} className="flex-1 bg-background">
      <Stack.Screen
        options={{
          header: () => (
            <CustomHeader
              title={service.label}
              subtitle={formatServiceDate(service.serviceDate)}
            />
          ),
        }}
      />

      <FlatList
        data={service.categories}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        ListHeaderComponent={
           <ServiceSummary
                categories={service.categories}
            />
        }
        ListEmptyComponent={EmptyCategories}
        contentContainerClassName="gap-4 p-4 flex-grow"
        showsVerticalScrollIndicator={false}
      />

      {addOpen && (
        <AddCategoryDialog
          serviceId={serviceId}
          existingNames={existingNames}
          nextPosition={nextPosition}
          onClose={() => setAddOpen(false)}
        />
      )}
        <View className="px-4">
            <Button variant="dashed" onPress={() => setAddOpen(true)}>
              <Icon as={Plus} className="size-4 text-primary" />
              <Text>Add Category</Text>
            </Button>
        </View>

        <ViewReportBtn serviceId={serviceId} />
    </View>
  );
}
