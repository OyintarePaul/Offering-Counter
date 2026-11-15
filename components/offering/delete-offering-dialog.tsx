import { Trash } from "lucide-react-native";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { deleteOffering } from "@/db/offerings";

type DeleteOfferingDialogProps = {
	offeringId: number | null;
};

export function DeleteOfferingDialog({
	offeringId,
}: DeleteOfferingDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	async function handleConfirm() {
		if (offeringId === null) return;

		try {
			setIsLoading(true);
			await deleteOffering(offeringId);
			setIsOpen(false);
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogTrigger asChild>
				<Button
					variant="destructive-soft"
					size="icon"
					onPress={(e) => e.stopPropagation()}
				>
					<Icon as={Trash} className="text-destructive size-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<Button
						variant="destructive-soft"
						size="icon"
						onPress={(e) => e.stopPropagation()}
					>
						<Icon as={Trash} className="size-4" />
					</Button>
					<AlertDialogTitle>Remove this offering?</AlertDialogTitle>
					<AlertDialogDescription>
						All counts in it will be deleted. This can&apos;t be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter className="flex-row gap-2">
					<Button
						variant="outline"
						onPress={() => setIsOpen(false)}
						disabled={isLoading}
						className="flex-1"
					>
						<Text>Cancel</Text>
					</Button>
					<Button
						onPress={handleConfirm}
						disabled={isLoading}
						variant="destructive"
						className="flex-1"
					>
						<Text>{isLoading ? "Removing..." : "Remove"}</Text>
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
