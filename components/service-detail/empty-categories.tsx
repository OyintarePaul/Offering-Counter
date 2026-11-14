import { View } from "react-native";
import { Text } from "@/components/ui/text";

export function EmptyCategories() {
  return (
    <View className="mt-10 items-center px-6">
      <Text className="text-center text-muted-foreground">
        No categories yet. Tap Add Category to start.
      </Text>
    </View>
  );
}
