import { useState } from "react";
import { View } from "react-native";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORY_NAMES } from "@/lib/presets";
import { addCategory } from "@/db/categories";
import { Plus } from "lucide-react-native";

type Props = {
  serviceId: number;
  existingNames: string[];
  nextPosition: number;
};

// Mounted only while open, so each opening starts fresh.
export function AddCategoryDialog({ serviceId, existingNames, nextPosition }: Props) {
  const options = CATEGORY_NAMES.filter((name) => !existingNames.includes(name));
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string>(options[0] ?? "");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!selected) return;
    setSaving(true);
    try {
      await addCategory(serviceId, selected, nextPosition);
      setIsOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <View className="px-4">
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
        <Button variant="dashed">
          <Icon as={Plus} className="size-4 text-primary" />
          <Text>Add Category</Text>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex-row gap-2 items-center">
        <Button size="icon" className="bg-primary/5">
            <Icon as={Plus} className="text-primary" />
        </Button>
        <View>
            <DialogTitle>Add Category</DialogTitle>
            <Text variant="muted">Add an offering category</Text>
        </View>
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

        <DialogFooter className="flex-row gap-2">
            <Button variant="outline" onPress={() => setIsOpen(false)} disabled={saving} className="flex-1">
              <Text>Cancel</Text>
            </Button>
            <Button onPress={handleAdd} disabled={saving} className="flex-1">
              <Text>{saving ? "Saving..." : "Add Category"}</Text>
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </View>
  );
}
