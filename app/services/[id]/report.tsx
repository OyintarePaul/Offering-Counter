import { useRef } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { Alert, FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot, { captureRef } from "react-native-view-shot";
import { Download, Share2 } from "lucide-react-native";
import { CustomHeader } from "@/components/custom-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useServiceTree } from "@/db/live";
import { useMutation } from "@/hooks/use-mutation";
import { formatNaira } from "@/lib/money";
import { buildReport, ReportModel } from "@/lib/report";

const TABULAR_NUMS = { fontVariant: ["tabular-nums"] as const };

type CategoryItem = ReportModel["offerings"][number];

export default function ReportScreen() {
	const insets = useSafeAreaInsets();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { services, ready } = useServiceTree();

	const captureContainerRef = useRef<View>(null);
	const [permissionResponse, requestPermission] = MediaLibrary.usePermissions({
		granularPermissions: ["photo"],
	});

	const service = services.find((s) => s.id === Number(id));

	// Captures the full off-screen receipt view as a PNG URI
	async function captureReportImage(): Promise<string> {
		if (!captureContainerRef.current) {
			throw new Error("Report view is not ready.");
		}

		return captureRef(captureContainerRef, {
            fileName: service?.name,
			format: "png",
			quality: 1,
		});
	}

	const { mutate: handleSave, isPending: isSaving } = useMutation(async () => {
		if (permissionResponse?.status !== "granted") {
			const { granted } = await requestPermission();
			if (!granted) {
				Alert.alert(
					"Permission required",
					"Please allow photo library access to save the report.",
				);
				return;
			}
		}

		const uri = await captureReportImage();
		await MediaLibrary.saveToLibraryAsync(uri);
		Alert.alert("Saved", "Report image saved to your gallery.");
	});

	const { mutate: handleShare, isPending: isSharing } = useMutation(
		async () => {
			const isAvailable = await Sharing.isAvailableAsync();
			if (!isAvailable) {
				Alert.alert("Unavailable", "Sharing is not supported on this device.");
				return;
			}

			const uri = await captureReportImage();
			await Sharing.shareAsync(uri, {
				mimeType: "image/png",
				dialogTitle: "Share Service Report",
			});
		},
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

	const report = buildReport(service);
	const hasCategories = report.offerings.length > 0;
	const isBusy = isSaving || isSharing;

	const renderItem = ({ item: offering }: { item: CategoryItem }) => (
		<CategoryCard offering={offering} />
	);

	return (
		<View
			style={{ paddingBottom: Math.max(insets.bottom, 30) }}
			className="flex-1 bg-background"
		>
			<Stack.Screen
				options={{ header: () => <CustomHeader title="Report" /> }}
			/>

			{/* Interactive on-screen FlatList */}
			<FlatList
				className="flex-1"
				contentContainerClassName="gap-4 p-4"
				showsVerticalScrollIndicator={false}
				data={report.offerings}
				keyExtractor={(item) => item.name}
				ListHeaderComponent={
					hasCategories ? <ReportHeader report={report} /> : null
				}
				ListEmptyComponent={EmptyReport}
				renderItem={renderItem}
			/>

			{/* Off-screen full-height view so long reports aren't cut off when captured */}
			{hasCategories && (
				<View
					pointerEvents="none"
					style={{ position: "absolute", left: -9999, top: 0, width: 400 }}
				>
					<ViewShot
						ref={captureContainerRef}
						options={{ format: "png", quality: 1 }}
					>
						<View className="gap-4 bg-background p-5">
							<ReportHeader report={report} />
							{report.offerings.map((offering) => (
								<CategoryCard key={offering.name} offering={offering} />
							))}
						</View>
					</ViewShot>
				</View>
			)}

			{/* Pinned bottom action bar */}
			{hasCategories && (
				<View className="flex-row gap-3 px-4 pt-2">
					<Button
						variant="outline"
						className="flex-1 flex-row gap-2"
						disabled={isBusy}
						onPress={() => handleSave()}
					>
						<Icon as={Download} className="size-4" />
						<Text>{isSaving ? "Saving..." : "Save"}</Text>
					</Button>

					<Button
						className="flex-1 flex-row gap-2"
						disabled={isBusy}
						onPress={() => handleShare()}
					>
						<Icon as={Share2} className="size-4 text-primary-foreground" />
						<Text>{isSharing ? "Preparing..." : "Share Report"}</Text>
					</Button>
				</View>
			)}
		</View>
	);
}

function CategoryCard({ offering }: { offering: CategoryItem }) {
	return (
		<Card className="gap-3">
			<CardHeader className="flex-row items-center justify-between">
				<CardTitle>{offering.name}</CardTitle>
				<Text className="font-semibold" style={TABULAR_NUMS}>
					{formatNaira(offering.total)}
				</Text>
			</CardHeader>
			<CardContent className="gap-1.5">
				{offering.rows.map((row) => (
					<View
						key={row.denomination}
						className="flex-row items-center justify-between"
					>
						<Text className="text-muted-foreground">
							{formatNaira(row.denomination)} × {row.count}
						</Text>
						<Text className="text-muted-foreground" style={TABULAR_NUMS}>
							{formatNaira(row.amount)}
						</Text>
					</View>
				))}
			</CardContent>
		</Card>
	);
}

function ReportHeader({ report }: { report: ReportModel }) {
	return (
		<View className="rounded-xl bg-primary p-6">
			<Text className="text-sm text-primary-foreground">
				Grand total &bull; {report.serviceLabel}
			</Text>
			<Text
				variant="h2"
				className="font-extrabold text-primary-foreground"
				style={TABULAR_NUMS}
			>
				{formatNaira(report.grandTotal)}
			</Text>
		</View>
	);
}

function EmptyReport() {
	return (
		<View className="mt-6 items-center gap-4">
			<Text className="text-muted-foreground">Nothing counted yet.</Text>
			<Button variant="outline" onPress={() => router.back()}>
				<Text>Back to service</Text>
			</Button>
		</View>
	);
}
