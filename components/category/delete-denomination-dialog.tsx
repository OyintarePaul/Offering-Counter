import { useState } from "react";
import { removeDenomination } from "@/db/entries";
import { formatNaira } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Trash } from "lucide-react-native";
import {
    AlertDialog,
    AlertDialogTitle,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
    categoryId: number;
    denomination: number;
}

export function DeleteDenominationDialog({ categoryId, denomination }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function confirmRemove() {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            await removeDenomination(categoryId, denomination);
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
                    className="size-10"
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
                    <AlertDialogTitle>
                        Remove {formatNaira(denomination)}?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Its count will be cleared. This can't be undone.
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
                        onPress={confirmRemove}
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
