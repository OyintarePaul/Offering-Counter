import { useState } from "react";
import { View } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICE_LABELS } from "@/lib/presets";
import { upcomingSunday, formatServiceDate, toIsoDate, parseIsoDate } from "@/lib/dates";
import { findOrCreateService } from "@/db/services";

type Props = { onClose: () => void };

// Mounted only while open, so each opening starts with fresh defaults.
export function NewServiceDialog({ onClose }: Props) {
  const [serviceDate, setServiceDate] = useState(() => upcomingSunday());
  const [label, setLabel] = useState<string>(SERVICE_LABELS[0]);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  function handleDateChange(event: DateTimePickerEvent, selected?: Date) {
    setShowPicker(false);
    if (event.type === "set" && selected) {
      setServiceDate(toIsoDate(selected));
    }
  }

  async function handleCreate() {
    setSaving(true);
    await findOrCreateService(serviceDate, label);
    setSaving(false);
    onClose();
  }

  return (
    <Dialog open onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Service</DialogTitle>
        </DialogHeader>

        <View className="gap-4">
          <View className="gap-2">
            <Label>Date</Label>
            <Button variant="outline" onPress={() => setShowPicker(true)}>
              <Text>{formatServiceDate(serviceDate)}</Text>
            </Button>
            {showPicker && (
              <DateTimePicker
                value={parseIsoDate(serviceDate)}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View className="gap-2">
            <Label>Service</Label>
            <Select
              value={{ value: label, label }}
              onValueChange={(option) => {
                if (option) setLabel(option.value);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a service" />
              </SelectTrigger>
              <SelectContent>
                {SERVICE_LABELS.map((l, i) => (
                  <SelectItem key={l} value={l} label={l} index={i}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </View>
        </View>

        <DialogFooter>
          <Button variant="outline" onPress={onClose}>
            <Text>Cancel</Text>
          </Button>
          <Button onPress={handleCreate} disabled={saving}>
            <Text>{saving ? "Saving..." : "Create"}</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
