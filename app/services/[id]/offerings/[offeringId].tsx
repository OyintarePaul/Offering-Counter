import { Ref, useEffect, useRef, useState } from "react";
import { Keyboard, FlatList, TextInput, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useServiceTree } from "@/db/live";
import { saveCount, removeDenomination } from "@/db/entries";
import { categoryTotal, formatNaira } from "@/lib/money";
import { CountRow } from "@/components/count-row";
import { AddDenominationDialog } from "@/components/offering/add-denomination-dialog";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { CustomHeader } from "@/components/custom-header";

export default function OfferingsDetailsScreen() {
	const insets = useSafeAreaInsets();
	const { id, offeringId: offId } = useLocalSearchParams<{
		id: string;
		offeringId: string;
	}>();
	const serviceId = Number(id);
	const offeringId = Number(offId);
	const { services: list, ready } = useServiceTree();
	const service = list.find((s) => s.id === serviceId);
	const offering = service?.offerings.find((c) => c.id === offeringId);

	const [addOpen, setAddOpen] = useState(false);
	const [focusDenom, setFocusDenom] = useState<number | null>(null);
	const [pendingRemove, setPendingRemove] = useState<number | null>(null);
	const inputRefs = useRef<Record<number, TextInput | null>>({});
	const listRef = useRef<FlatList>(null);
	const rowY = useRef<Record<number, number>>({});

	// Largest denominations first.
	const rows = offering
		? [...offering.entries].sort((a, b) => b.denomination - a.denomination)
		: [];

	// After adding a denomination, move the cursor to its new input.
	useEffect(() => {
		if (focusDenom !== null && inputRefs.current[focusDenom]) {
			inputRefs.current[focusDenom]?.focus();
			setFocusDenom(null);
		}
	}, [focusDenom, rows]);

	// Scroll the focused row to the top of the visible area, above the keyboard.
	function scrollToRow(index: number) {
		listRef.current?.scrollToIndex({
			index,
			animated: true,
			viewPosition: 0.2,
		});
	}

	function focusNext(index: number) {
		const next = rows[index + 1];
		if (next) {
			inputRefs.current[next.denomination]?.focus();
		} else {
			Keyboard.dismiss();
		}
	}

	async function confirmRemove() {
		if (pendingRemove === null) return;
		await removeDenomination(offeringId, pendingRemove);
		setPendingRemove(null);
	}

	if (!ready) {
		return <View className="flex-1 bg-background" />;
	}

	if (!service || !offering) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<Text className="text-muted-foreground">Offering not found.</Text>
			</View>
		);
	}

	return (
		<View
			style={{ paddingBottom: Math.max(insets.bottom, 20) }}
			className="flex-1 bg-background"
		>
			<Stack.Screen
				options={{ header: () => <CustomHeader title={offering.name} /> }}
			/>

			<FlatList
				ref={listRef}
				className="flex-1"
				contentContainerClassName="gap-3 p-4 pb-80"
				keyboardShouldPersistTaps="handled"
				showsVerticalScrollIndicator={false}
				data={rows}
				keyExtractor={(item) => String(item.denomination)}
				ListEmptyComponent={
					<Text className="mt-10 text-center text-muted-foreground">
						Add a denomination to start counting.
					</Text>
				}
				ListHeaderComponent={
					<View className="p-4">
						<Text className="text-muted-foreground">Running total</Text>
						<Text className="text-3xl font-bold text-accent">
							{formatNaira(categoryTotal(offering.entries))}
						</Text>
					</View>
				}
				renderItem={({ item: row, index }) => (
					<CountRow
						offeringId={offeringId}
						denomination={row.denomination}
						count={row.count}
						inputRef={(el) => {
							inputRefs.current[row.denomination] = el;
						}}
						onChangeCount={(n) => {
							void saveCount(offeringId, row.denomination, n);
						}}
						onNext={() => focusNext(index)}
						isLast={index === rows.length - 1}
						onRemove={() => {
							if (row.count > 0) {
								setPendingRemove(row.denomination);
							} else {
								void removeDenomination(offeringId, row.denomination);
							}
						}}
						onLayoutY={(y) => {
							rowY.current[row.denomination] = y;
						}}
						onFocusRow={() => scrollToRow(index)}
					/>
				)}
			/>

			<View className="px-4 pt-2">
				<Button variant="dashed" onPress={() => setAddOpen(true)}>
					<Text>Add Denomination</Text>
				</Button>
			</View>

			{addOpen && (
				<AddDenominationDialog
					offeringId={offeringId}
					existing={rows.map((r) => r.denomination)}
					onAdded={(d) => setFocusDenom(d)}
					onClose={() => setAddOpen(false)}
				/>
			)}
		</View>
	);
}
