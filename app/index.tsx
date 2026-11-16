import { Stack } from "expo-router";
import { useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList, View } from "react-native";
import { CustomHeader } from "@/components/custom-header";
import { EmptyServices } from "@/components/services/empty-services";
import { NewServiceDialog } from "@/components/services/new-service-dialog";
import {
	ServiceCard,
	type ServiceItem,
} from "@/components/services/service-card";
import { useServiceTree } from "@/db/live";

export default function ServicesScreen() {
    const insets = useSafeAreaInsets();
	const { services: list, ready } = useServiceTree();

	const renderItem = useCallback(
		({ item }: { item: ServiceItem }) => <ServiceCard service={item} />,
		[],
	);

	return (
		<View
            style={{ paddingBottom: Math.max(insets.bottom, 20) }}
            className="flex-1 bg-background pt-3"
        >
			<Stack.Screen
				options={{
					header: () => (
						<CustomHeader subtitle="Offering Counter" title="Services" />
					),
				}}
			/>

			<FlatList
				data={ready ? list : []}
				keyExtractor={(item) => String(item.id)}
				renderItem={renderItem}
				ListEmptyComponent={ready ? EmptyServices : undefined}
				contentContainerClassName="gap-4 px-4 flex-grow"
				showsVerticalScrollIndicator={false}
			/>
            <View className="absolute bottom-6 right-6">
			     <NewServiceDialog />
            </View>
		</View>
	);
}
