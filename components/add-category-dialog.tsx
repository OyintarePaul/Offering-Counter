import { useState } from "react";
import { View } from "react-native";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORY_NAMES } from "@/lib/presets";
import { addCategory } from "@/db/categories";

type Props = {
  serviceId: number;
  existingNames: string[];
  nextPosition: number;
  onClose: () => void;
};

// Mounted only while open, so each opening starts fresh.
export function AddCategoryDialog({ serviceId, existingNames, nextPosition, onClose }: Props) {
  const options = CATEGORY_NAMES.filter((name) => !existingNames.includes(name));
  const [selected, setSelected] = useState<string>(options[0] ?? "");

  async function handleAdd() {
    if (!selected) return;
    await addCategory(serviceId, selected, nextPosition);
    onClose();
  }

  return (
    <Dialog open onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add category</DialogTitle>
        </DialogHeader>

        {options.length === 0 ? (
          <Text className="text-muted-foreground">Every category is already added.</Text>
        ) : (
          <View className="gap-2">
            <Label>Category</Label>
            <Select
              value={{ value: selected, label: selected }}
              onValueChange={(option) => {
                if (option) setSelected(option.value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent>
                {options.map((name, i) => (
                  <SelectItem key={name} value={name} label={name} index={i}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </View>
        )}

        <DialogFooter>
          <Button variant="outline" onPress={onClose}>
            <Text>Cancel</Text>
          </Button>
          {options.length > 0 && (
            <Button onPress={handleAdd}>
              <Text>Add</Text>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
