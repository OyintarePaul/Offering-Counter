import { useCallback, useMemo, useState } from "react";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useServiceTree } from "@/db/live";
import { formatServiceDate } from "@/lib/dates";
import { AddOfferingDialog } from "@/components/offering/add-offering-dialog";
import { ViewReportBtn } from "@/components/offering/view-report-btn";
import { CustomHeader } from "@/components/custom-header";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Plus } from "lucide-react-native";
import {
	OfferingCard,
	type OfferingItem,
} from "@/components/offering/offering-card";
import { EmptyOffering } from "@/components/offering/empty-offering";
import { OfferingsSummary } from "@/components/offering/offerings-summary";

export default function OfferingsScreen() {
	const insets = useSafeAreaInsets();
	const [addOpen, setAddOpen] = useState(false);
	const { id } = useLocalSearchParams<{ id: string }>();
	const serviceId = Number(id);

	const { services: list, ready } = useServiceTree();
	const service = list.find((s) => s.id === serviceId);

	const existingNames = useMemo(
		() => service?.offerings.map((c) => c.name) ?? [],
		[service?.offerings],
	);

	const nextPosition = useMemo(
		() =>
			(service?.offerings.reduce((max, c) => Math.max(max, c.position), -1) ??
				-1) + 1,
		[service?.offerings],
	);

	const renderItem = useCallback(
		({ item }: { item: OfferingItem }) => (
			<OfferingCard offering={item} serviceId={serviceId} />
		),
		[],
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
		<View
			style={{ paddingBottom: Math.max(insets.bottom, 30) }}
			className="flex-1 bg-background"
		>
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
				data={service.offerings}
				keyExtractor={(item) => String(item.id)}
				renderItem={renderItem}
				ListHeaderComponent={<OfferingsSummary offerings={service.offerings} />}
				ListEmptyComponent={EmptyOffering}
				contentContainerClassName="gap-4 p-4 flex-grow"
				showsVerticalScrollIndicator={false}
			/>

			{addOpen && (
				<AddOfferingDialog
					serviceId={serviceId}
					existingNames={existingNames}
					nextPosition={nextPosition}
					onClose={() => setAddOpen(false)}
				/>
			)}
			<View className="px-4">
				<Button variant="dashed" onPress={() => setAddOpen(true)}>
					<Icon as={Plus} className="size-4 text-primary" />
					<Text>Add Offering</Text>
				</Button>
			</View>

			<ViewReportBtn serviceId={serviceId} />
		</View>
	);
}
