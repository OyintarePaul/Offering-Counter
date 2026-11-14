import { router, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useServiceTree } from "@/db/live";
import { formatNaira } from "@/lib/money";
import { buildReport } from "@/lib/report";

export default function ReportScreen() {
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
		<View className="flex-1 bg-background">
			<Stack.Screen options={{ title: "Report" }} />

			<ScrollView
				className="flex-1"
				contentContainerClassName="gap-4 p-4 pb-10"
			>
				<Card>
					<CardHeader>
						<CardTitle>Offerings Report</CardTitle>
						<Text className="text-muted-foreground">{report.dateLabel}</Text>
						<Text className="text-muted-foreground">{report.serviceLabel}</Text>
					</CardHeader>
				</Card>

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
								Grand total
							</Text>
							<Text
								className="text-4xl font-bold text-primary-foreground"
								style={{ fontVariant: ["tabular-nums"] }}
							>
								{formatNaira(report.grandTotal)}
							</Text>
						</View>

						{report.categories.map((c) => (
							<Card key={c.name}>
								<CardHeader className="flex-row items-center justify-between">
									<CardTitle>{c.name}</CardTitle>
									<Text
										className="font-semibold text-foreground"
										style={{ fontVariant: ["tabular-nums"] }}
									>
										{formatNaira(c.total)}
									</Text>
								</CardHeader>
								<CardContent className="gap-2">
									{c.rows.map((r) => (
										<View
											key={r.denomination}
											className="flex-row items-center justify-between border-t border-border pt-2"
										>
											<Text className="text-foreground">
												{formatNaira(r.denomination)} × {r.count}
											</Text>
											<Text
												className="text-foreground"
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
		</View>
	);
}
