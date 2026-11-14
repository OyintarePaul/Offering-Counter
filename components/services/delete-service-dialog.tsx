import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { services } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
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

import { Ionicon } from "@/components/ionicon"

type DeleteServiceDialogProps = {
  serviceId: number;
};

export function DeleteServiceDialog({ serviceId }: DeleteServiceDialogProps) {
  function handleConfirm() {
    db.delete(services).where(eq(services.id, serviceId)).run();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="bg-destructive/5"
          size="icon"
          onPress={(e) => e.stopPropagation()}
        >
          <Ionicon name="trash-outline" size={18} colorClassName="accent-destructive" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this service?</AlertDialogTitle>
          <AlertDialogDescription>
            Its categories and counts will be removed. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <Text>Cancel</Text>
          </AlertDialogCancel>
          <AlertDialogAction onPress={handleConfirm}>
            <Text>Delete</Text>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
