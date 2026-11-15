import { Minus, Plus } from "lucide-react-native";
import { type ComponentRef, useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { DeleteDenominationDialog } from "@/components/offering/delete-denomination-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { formatNaira, rowTotal } from "@/lib/money";

// Turns typed text into a count. Empty or non-numeric text counts as 0.
export function parseCount(text: string): number {
	const n = parseInt(text.replace(/\D/g, ""), 10);
	return isNaN(n) ? 0 : n;
}

type Props = {
	offeringId: number;
	denomination: number;
	count: number;
	inputRef: (el: ComponentRef<typeof TextInput> | null) => void;
	onChangeCount: (count: number) => void;
	onNext: () => void;
	isLast: boolean;
	onLayoutY: (y: number) => void;
	onFocusRow: () => void;
};

export function CountRow({
	offeringId,
	denomination,
	count,
	inputRef,
	onChangeCount,
	onNext,
	isLast,
	onLayoutY,
	onFocusRow,
}: Props) {
	// Local text so the cursor doesn't jump while typing.
	const [text, setText] = useState(count === 0 ? "" : String(count));

	// Only overwrite the text when the saved count changed from outside.
	useEffect(() => {
		if (parseCount(text) !== count) {
			setText(count === 0 ? "" : String(count));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [count]);

	function handleChange(typed: string) {
		const clean = typed.replace(/\D/g, "");
		setText(clean);
		onChangeCount(parseCount(clean));
	}

	function handleStep(amount: number) {
		const next = Math.max(0, count + amount);
		setText(next === 0 ? "" : String(next));
		onChangeCount(next);
	}

	return (
		<View onLayout={(e) => onLayoutY(e.nativeEvent.layout.y)}>
			<Card>
				<CardContent className="flex-row items-center justify-between gap-1">
					<View className="flex-1">
						<Text variant="h4">{formatNaira(denomination)}</Text>
						<Text variant="muted" className="text-muted-foreground">
							= {formatNaira(rowTotal(denomination, count))}
						</Text>
					</View>

					<Button
						size="icon"
						variant="secondary"
						className="bg-muted"
						onPress={() => handleStep(-1)}
						disabled={count <= 0}
					>
						<Icon as={Minus} className="text-muted-foreground size-4" />
					</Button>

					<TextInput
						ref={inputRef}
						value={text}
						onChangeText={handleChange}
						onFocus={onFocusRow}
						placeholder="0"
						keyboardType="number-pad"
						selectTextOnFocus
						returnKeyType={isLast ? "done" : "next"}
						onSubmitEditing={onNext}
						style={{ fontVariant: ["tabular-nums"] }}
						className="h-12 w-9 rounded-md border-0 px-1 text-center text-foreground"
					/>

					<Button
						size="icon"
						className="bg-primary"
						onPress={() => handleStep(1)}
					>
						<Icon as={Plus} className="text-primary-foreground size-4" />
					</Button>

					<DeleteDenominationDialog
						denomination={denomination}
						offeringId={offeringId}
					/>
				</CardContent>
			</Card>
		</View>
	);
}
