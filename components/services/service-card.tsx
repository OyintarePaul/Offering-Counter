import { View, Pressable } from "react-native";
import { Link } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { formatNaira, grandTotal } from "@/lib/money";
import { formatServiceDate } from "@/lib/dates";
import { DeleteServiceDialog } from "@/components/services/delete-service-dialog";
import type { useServiceTree } from "@/db/live";

export type ServiceItem = ReturnType<typeof useServiceTree>["services"][number];

type ServiceCardProps = {
  service: ServiceItem;
  onPress: (id: number) => void;
};

export function ServiceCard({ service }: ServiceCardProps) {
  const categoryCount = service.categories.length;

  return (
    <Link href={`service/${service.id}`} asChild>
    <Pressable>
      <Card>
        <CardHeader className="flex-row justify-between items-center gap-2">
          <View className="flex-1">
            <CardTitle className="text-primary">{service.label}</CardTitle>
            <Text variant="h4">{formatServiceDate(service.serviceDate)}</Text>
          </View>
          <Text variant="muted" className="text-muted-foreground">
            {categoryCount}{" "}
            {categoryCount === 1 ? "category" : "categories"}
          </Text>
          <DeleteServiceDialog serviceId={service.id} />
        </CardHeader>
        <CardContent className="flex-row items-center justify-between">
          <Text variant="h4" className="text-accent">
            {formatNaira(grandTotal(service.categories))}
          </Text>

        </CardContent>
      </Card>
    </Pressable>
    </Link>
  );
}
