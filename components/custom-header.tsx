import { View, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Ionicon } from "@/components/ionicon";

export function CustomHeader({ subtitle, title, back }: { subtitle?: string, title: string, back: boolean }) {
    const insets = useSafeAreaInsets()
    const router = useRouter();
    return (
        <View style={{ paddingTop: insets.top + 30 }} className="px-4 flex-row gap-3 items-center">
            { back && <Button size="icon" variant="outline"><Ionicon name="chevron-back" size={18} /></Button> }
            <View>
                {subtitle &&
                    <Text variant="muted" className="leading-none">
                        {subtitle}
                    </Text>
                }
                <Text variant="h2" className="-mt-0.5">
                    {title}
                </Text>
            </View>
        </View>
    )
}
