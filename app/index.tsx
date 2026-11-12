import { View } from "react-native";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";

export default function Index() {
  return (
    <View className="flex-1 justify-center bg-background p-6 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Theme check</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          <Label>Tithe count</Label>
          <Input placeholder="0" keyboardType="number-pad" />
          <Button className="bg-primary">
            <Text>Save</Text>
          </Button>
        </CardContent>
      </Card>
    </View>
  );
}
