import { View } from "react-native";
import { Text } from "@/components/ui/text";

export function EmptyOffering() {
	return (
		<View className="mt-10 items-center px-6">
			<Text className="text-center text-muted-foreground">
				No offerings yet. Tap Add Offering to start.
			</Text>
		</View>
	);
}
