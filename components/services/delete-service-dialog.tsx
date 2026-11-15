import { eq } from "drizzle-orm";
import { Trash } from "lucide-react-native";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { db } from "@/db/client";
import { services } from "@/db/schema";

type DeleteServiceDialogProps = {
	serviceId: number;
};

export function DeleteServiceDialog({ serviceId }: DeleteServiceDialogProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	async function handleConfirm() {
		setIsLoading(true);
		try {
			await db.delete(services).where(eq(services.id, serviceId)).run();
			setIsLoading(false);
		} finally {
			setIsOpen(false);
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
					<Icon as={Trash} className="size-4" />
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
					<AlertDialogTitle>Delete this service?</AlertDialogTitle>
					<AlertDialogDescription>
						Its offerings and counts will be removed. This can&apos;t be undone.
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
