import { View } from "react-native";
import { Text } from "@/components/ui/text";

export function EmptyServices() {
  return (
    <View className="mt-16 items-center px-6">
      <Text className="text-center text-muted-foreground">
        No services yet. Tap New Service to start.
      </Text>
    </View>
  );
}
