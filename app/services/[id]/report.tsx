import { Asset, usePermissions } from "expo-media-library";
import { router, Stack, useLocalSearchParams } from "expo-router";
import * as Sharing from "expo-sharing";
import { Download, Share2 } from "lucide-react-native";
import { type ComponentRef, useRef } from "react";
import { Alert, FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ViewShot from "react-native-view-shot";
import { CustomHeader } from "@/components/custom-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useServiceTree } from "@/db/live";
import { useMutation } from "@/hooks/use-mutation";
import { formatNaira } from "@/lib/money";
import { buildReport, type ReportModel } from "@/lib/report";

const TABULAR_NUMS = { fontVariant: ["tabular-nums"] as const };

type OfferingItem = ReportModel["offerings"][number];

export default function ReportScreen() {
	const insets = useSafeAreaInsets();
	const { id } = useLocalSearchParams<{ id: string }>();
	const { services, ready } = useServiceTree();

	const captureContainerRef = useRef<ComponentRef<typeof ViewShot>>(null);
	const [permissionResponse, requestPermission] = usePermissions({
		granularPermissions: ["photo"],
		writeOnly: true,
	});

	const service = services.find((s) => s.id === Number(id));

	// Captures the full off-screen receipt view as a PNG URI
	async function captureReportImage(): Promise<string> {
		if (!captureContainerRef.current) {
			throw new Error("Report view is not ready.");
		}

		return captureContainerRef.current.capture();
	}

	const { mutate: handleSave, isPending: isSaving } = useMutation(async () => {
		try {
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
			if (!uri) {
				throw new Error("Failed to generate report image URL");
			}

			const localUri = uri.startsWith("file://") ? uri : `file://${uri}`;

			await Asset.create(localUri);

			Alert.alert("Saved", "Report image saved to your gallery.");
		} catch (error) {
			console.error("Failed to save report:", error);
			Alert.alert(
				"Save failed",
				error instanceof Error
					? error.message
					: "Could not save the report image to your gallery.",
			);
		}
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
	const hasOfferings = report.offerings.length > 0;
	const isBusy = isSaving || isSharing;

	const renderItem = ({ item: offering }: { item: OfferingItem }) => (
		<OfferingCard offering={offering} />
	);

	return (
		<View
			style={{ paddingBottom: Math.max(insets.bottom, 20) }}
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
					hasOfferings ? <ReportHeader report={report} /> : undefined
				}
				ListEmptyComponent={EmptyReport}
				renderItem={renderItem}
			/>

			{/* Off-screen full-height view so long reports aren't cut off when captured */}
			{hasOfferings && (
				<View
					pointerEvents="none"
					style={{ position: "absolute", left: -9999, top: 0, width: 400 }}
				>
					<ViewShot
						ref={captureContainerRef}
						options={{
							fileName: service?.label || "Report",
							format: "png",
							quality: 1,
						}}
					>
						<View className="gap-4 bg-background p-5">
							<ReportHeader report={report} />
							{report.offerings.map((offering) => (
								<OfferingCard key={offering.name} offering={offering} />
							))}
						</View>
					</ViewShot>
				</View>
			)}

			{/* Pinned bottom action bar */}
			{hasOfferings && (
				<View className="flex-row gap-3 px-4 pt-2">
					<Button
						variant="outline"
						className="flex-1"
						disabled={isBusy}
						onPress={() => handleSave()}
					>
						<Icon as={Download} className="size-4" />
						<Text>{isSaving ? "Saving..." : "Save"}</Text>
					</Button>

					<Button
						className="flex-1"
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

function OfferingCard({ offering }: { offering: OfferingItem }) {
	return (
		<Card className="gap-3">
			<CardHeader className="flex-row items-center justify-between">
				<CardTitle>{offering.name}</CardTitle>
				<Text className="font-sans-semibold" style={TABULAR_NUMS}>
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
		<Card className="bg-primary">
			<CardContent className="gap-2">
				<Text className="text-sm text-primary-foreground">
					Grand total &bull; {report.serviceLabel}
				</Text>
				<Text
					variant="h1"
					className="text-background leading-none"
					style={TABULAR_NUMS}
				>
					{formatNaira(report.grandTotal)}
				</Text>
			</CardContent>
		</Card>
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
