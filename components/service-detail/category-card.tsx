import { Pressable,View } from "react-native";
import { Link } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { categoryTotal, formatNaira } from "@/lib/money";
import type { useServiceTree } from "@/db/live";
import { DeleteCategoryDialog } from "@/components/service-detail/delete-category-dialog";

export type CategoryItem =
  ReturnType<typeof useServiceTree>["services"][number]["categories"][number];

type CategoryCardProps = {
  category: CategoryItem;
  serviceId: string;
};

export function CategoryCard({
  category,
  serviceId
}: CategoryCardProps) {
  const counted = category.entries.filter((e) => e.count > 0).length;

  return (
    <Link href={`/service/${serviceId}/category/${category.id}`} asChild>
    <Pressable>
      <Card>
        <CardContent className="flex-row gap-2 items-center">
            <View className="flex-1">
              <Text variant="h4" className="text-base">
                {category.name}
              </Text>
              <Text variant="muted" className="text-muted-foreground">
                {counted} denomination{counted === 1 ? "" : "s"} counted
              </Text>
            </View>
          <Text variant="h4" className="text-accent">
            {formatNaira(categoryTotal(category.entries))}
          </Text>

          <DeleteCategoryDialog categoryId={category.id}/>
        </CardContent>
      </Card>
    </Pressable>
</Link>
  );
}
