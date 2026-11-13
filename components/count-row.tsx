import { useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { formatNaira, rowTotal } from "@/lib/money";

// Turns typed text into a count. Empty or non-numeric text counts as 0.
export function parseCount(text: string): number {
  const n = parseInt(text.replace(/\D/g, ""), 10);
  return isNaN(n) ? 0 : n;
}

type Props = {
  denomination: number;
  count: number;
  inputRef: (el: TextInput | null) => void;
  onChangeCount: (count: number) => void;
  onNext: () => void;
  isLast: boolean;
  onRemove: () => void;
  onLayoutY: (y: number) => void;
  onFocusRow: () => void;
};

export function CountRow({
  denomination,
  count,
  inputRef,
  onChangeCount,
  onNext,
  isLast,
  onRemove,
  onLayoutY,
  onFocusRow,
}: Props) {
  // Local text so the cursor doesn't jump while typing.
  const [text, setText] = useState(count === 0 ? "" : String(count));

  // Only overwrite the text when the saved count changed from outside.
  useEffect(() => {
    if (parseCount(text) !== count) {
      setText(count === 0 ? "" : String(count));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  function handleChange(typed: string) {
    const clean = typed.replace(/\D/g, "");
    setText(clean);
    onChangeCount(parseCount(clean));
  }

  return (
    <View onLayout={(e) => onLayoutY(e.nativeEvent.layout.y)}>
      <Card>
        <CardContent className="flex-row items-center justify-between gap-3 p-4">
          <Text className="w-24 text-base font-semibold text-foreground">
            {formatNaira(denomination)}
          </Text>

          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={handleChange}
            onFocus={onFocusRow}
            placeholder="0"
            keyboardType="number-pad"
            selectTextOnFocus
            returnKeyType={isLast ? "done" : "next"}
            onSubmitEditing={onNext}
            className="h-12 w-20 rounded-md border border-input bg-background px-3 text-center text-lg text-foreground"
          />

          <Text className="flex-1 text-right font-semibold text-foreground">
            {formatNaira(rowTotal(denomination, count))}
          </Text>

          <Pressable onPress={onRemove} hitSlop={8}>
            <Text className="text-xl text-destructive">×</Text>
          </Pressable>
        </CardContent>
      </Card>
    </View>
  );
}
