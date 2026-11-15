import { useState } from "react";
import { View } from "react-native";
import DateTimePicker, {
	DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
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
import { SERVICE_LABELS } from "@/lib/presets";
import {
	upcomingSunday,
	formatServiceDate,
	toIsoDate,
	parseIsoDate,
} from "@/lib/dates";
import { findOrCreateService } from "@/db/services";
import { Plus } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { routes } from "@/lib/routes"

export function NewServiceDialog() {
	const insets = useSafeAreaInsets();
	const [open, setOpen] = useState(false);

	return (
		<View
			style={{ paddingBottom: Math.max(insets.bottom, 30) }}
			className="bg-background px-4 pt-3"
		>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button>
						<Icon
							as={Plus}
                            className="size-4"

						/>
						<Text>New Service</Text>
					</Button>
				</DialogTrigger>

				<DialogContent>
					<NewServiceForm onClose={() => setOpen(false)} />
				</DialogContent>
			</Dialog>
		</View>
	);
}

function NewServiceForm({ onClose }: { onClose: () => void }) {
	const [serviceDate, setServiceDate] = useState(() => upcomingSunday());
	const [label, setLabel] = useState<string>(SERVICE_LABELS[0]);
	const [showPicker, setShowPicker] = useState(false);
	const [saving, setSaving] = useState(false);

	function handleDateChange(_, selected: Date) {
		setShowPicker(false);
		setServiceDate(toIsoDate(selected));
	}

	async function handleCreate() {
		setSaving(true);
		try {
			const id = await findOrCreateService(serviceDate, label);
			onClose();
			router.push(routes.offerings(id))
		} finally {
			setSaving(false);
		}
	}

	return (
		<>
			<DialogHeader className="flex-row gap-2 items-center">
				<Button size="icon" className="bg-primary/5">
					<Icon as={Plus} className="text-primary" />
				</Button>
				<View>
					<DialogTitle>New Service</DialogTitle>
					<Text variant="muted">Add a service to start counting</Text>
				</View>
			</DialogHeader>

			<View className="gap-4">
				<View className="gap-2">
					<Label>Service Type</Label>
					<Select
						value={{ value: label, label }}
						onValueChange={(option) => {
							if (option) setLabel(option.value);
						}}
					>
						<SelectTrigger className="h-12">
							<SelectValue placeholder="Choose a service" />
						</SelectTrigger>
						<SelectContent className="w-50">
							{SERVICE_LABELS.map((l, i) => (
								<SelectItem key={l} value={l} label={l} index={i}>
									{l}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</View>

				<View className="gap-2">
					<Label>Date</Label>
					<Button
						variant="outline"
						onPress={() => setShowPicker(true)}
						className="justify-between"
					>
						<Text className="font-normal text-foreground">
							{formatServiceDate(serviceDate)}
						</Text>
					</Button>
					{showPicker && (
						<DateTimePicker
							value={parseIsoDate(serviceDate)}
							mode="date"
							display="default"
							onValueChange={handleDateChange}
                            onDismiss={() => setShowPicker(false)}
						/>
					)}
				</View>
			</View>

			<DialogFooter className="flex-row gap-2">
				<Button
					variant="outline"
					onPress={onClose}
					disabled={saving}
					className="flex-1"
				>
					<Text>Cancel</Text>
				</Button>
				<Button onPress={handleCreate} disabled={saving} className="flex-1">
					<Text>{saving ? "Saving..." : "Create Service"}</Text>
				</Button>
			</DialogFooter>
		</>
	);
}
