import { useState } from "react";
import { View } from "react-native";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DENOMINATIONS } from "@/lib/presets";
import { formatNaira } from "@/lib/money";
import { addDenomination } from "@/db/entries";
import { Plus } from "lucide-react-native";

type Props = {
	offeringId: number;
	existing: number[];
	onAdded: (denomination: number) => void;
	onClose: () => void;
};

// Mounted only while open, so each opening starts fresh.
export function AddDenominationDialog({
	offeringId,
	existing,
	onAdded,
	onClose,
}: Props) {
	const options: number[] = DENOMINATIONS.filter((d) => !existing.includes(d));
	const [selected, setSelected] = useState<number>(options[0] ?? 0);
	const [saving, setSaving] = useState(false);

	async function handleAdd() {
		if (options.length === 0) return;
		setSaving(true);
		try {
			await addDenomination(offeringId, selected);
			onAdded(selected);
			onClose();
		} finally {
			setSaving(false);
		}
	}

	return (
		<Dialog
			open
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<DialogContent>
				<DialogHeader className="flex-row gap-2 items-center">
					<Button size="icon" className="bg-primary/5">
						<Icon as={Plus} className="text-primary" />
					</Button>
					<View>
						<DialogTitle>Add Denomination</DialogTitle>
						<Text variant="muted">Add an denomiation</Text>
					</View>
				</DialogHeader>

				{options.length === 0 ? (
					<Text className="text-muted-foreground">
						All denominations are already added.
					</Text>
				) : (
					<View className="gap-2">
						<Label>Denomination</Label>
						<Select
							value={{ value: String(selected), label: formatNaira(selected) }}
							onValueChange={(option) => {
								if (option) setSelected(Number(option.value));
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder="Choose a denomination" />
							</SelectTrigger>
							<SelectContent>
								{options.map((d, i) => (
									<SelectItem
										key={d}
										value={String(d)}
										label={formatNaira(d)}
										index={i}
									>
										{formatNaira(d)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</View>
				)}

				<DialogFooter className="flex-row gap-2">
					<Button variant="outline" onPress={onClose} className="flex-1">
						<Text>Cancel</Text>
					</Button>
					{options.length > 0 && (
						<Button onPress={handleAdd} className="flex-1" disabled={saving}>
							<Text>{saving ? "Saving" : "Add"}</Text>
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
