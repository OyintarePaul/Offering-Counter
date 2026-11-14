import { router, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useServiceTree } from "@/db/live";
import { formatNaira } from "@/lib/money";
import { buildReport } from "@/lib/report";
import { CustomHeader } from "@/components/custom-header"
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ReportScreen() {
    const insets = useSafeAreaInsets()
	const { id } = useLocalSearchParams<{ id: string }>();
	const serviceId = Number(id);

	const { services: list, ready } = useServiceTree();
	const service = list.find((s) => s.id === serviceId);

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

	const report = buildReport(service);

	return (
		<View style={{ paddingBottom: Math.max(insets.bottom, 30) }} className="flex-1 bg-background">
			<Stack.Screen options={{ header: () => <CustomHeader title="Report"/> }} />

			<ScrollView
				className="flex-1"
				contentContainerClassName="gap-4 p-4"
			>
				{report.categories.length === 0 ? (
					<View className="mt-6 items-center gap-4">
						<Text className="text-muted-foreground">Nothing counted yet.</Text>
						<Button variant="outline" onPress={() => router.back()}>
							<Text>Back to service</Text>
						</Button>
					</View>
				) : (
					<>
						<View className="rounded-xl bg-primary p-6">
							<Text className="text-sm text-primary-foreground">
								Grand total &bull; {report.serviceLabel}
							</Text>
							<Text
                                variant="h2"
								className="text-primary-foreground font-extrabold"
								style={{ fontVariant: ["tabular-nums"] }}
							>
								{formatNaira(report.grandTotal)}
							</Text>
						</View>

						{report.categories.map((c) => (
							<Card key={c.name} className="gap-3">
								<CardHeader className="flex-row items-center justify-between">
									<CardTitle>{c.name}</CardTitle>
									<Text
										className="font-semibold"
										style={{ fontVariant: ["tabular-nums"] }}
									>
										{formatNaira(c.total)}
									</Text>
								</CardHeader>
								<CardContent className="gap-1.5">
									{c.rows.map((r) => (
										<View
											key={r.denomination}
											className="flex-row items-center justify-between"
										>
											<Text className="text-muted-foreground">
												{formatNaira(r.denomination)} × {r.count}
											</Text>
											<Text
												className="text-muted-foreground"
												style={{ fontVariant: ["tabular-nums"] }}
											>
												{formatNaira(r.amount)}
											</Text>
										</View>
									))}
								</CardContent>
							</Card>
						))}
					</>
				)}
			</ScrollView>
            <View className="px-4 pt-2">
                <Button>
                <Text>Save Report</Text>
                </Button>
            </View>

		</View>
	);
}
