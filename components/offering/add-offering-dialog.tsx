import { useState } from "react";
import { View } from "react-native";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { CATEGORY_NAMES } from "@/lib/presets";
import { addOffering } from "@/db/offerings";
import { Plus } from "lucide-react-native";

type Props = {
	serviceId: number;
	existingNames: string[];
	nextPosition: number;
	onClose: () => void;
};

// Mounted only while open, so each opening starts fresh.
export function AddOfferingDialog({
	serviceId,
	existingNames,
	nextPosition,
	onClose,
}: Props) {
	const options = CATEGORY_NAMES.filter(
		(name) => !existingNames.includes(name),
	);
	const [selected, setSelected] = useState<string>(options[0] ?? "");
	const [saving, setSaving] = useState(false);

	async function handleAdd() {
		if (!selected) return;
		setSaving(true);
		try {
			await addOffering(serviceId, selected, nextPosition);
			onClose();
		} finally {
			setSaving(false);
		}
	}

	return (
		<View className="px-4">
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
							<DialogTitle>Add Offering</DialogTitle>
							<Text variant="muted">Add an offering to count</Text>
						</View>
					</DialogHeader>

					{options.length === 0 ? (
						<Text className="text-muted-foreground">
							Every offering is already added.
						</Text>
					) : (
						<View className="gap-2">
							<Label>Offering</Label>
							<Select
								value={{ value: selected, label: selected }}
								onValueChange={(option) => {
									if (option) setSelected(option.value);
								}}
							>
								<SelectTrigger>
									<SelectValue placeholder="Choose a offering" />
								</SelectTrigger>
								<SelectContent>
									{options.map((name, i) => (
										<SelectItem key={name} value={name} label={name} />
									))}
								</SelectContent>
							</Select>
						</View>
					)}

					<DialogFooter className="flex-row gap-2">
						<Button
							variant="outline"
							onPress={onClose}
							disabled={saving}
							className="flex-1"
						>
							<Text>Cancel</Text>
						</Button>
						{options.length > 0 && (
							<Button
								onPress={handleAdd}
								disabled={saving || !selected}
								className="flex-1"
							>
								<Text>{saving ? "Saving..." : "Add Offering"}</Text>
							</Button>
						)}
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</View>
	);
}
