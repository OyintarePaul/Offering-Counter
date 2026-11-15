import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

export function CustomHeader({
	subtitle,
	title,
}: {
	subtitle?: string;
	title: string;
}) {
	const insets = useSafeAreaInsets();
	const router = useRouter();
	return (
		<View
			style={{ paddingTop: insets.top + 30 }}
			className="px-4 pb-2 flex-row gap-3 items-center"
		>
			{router.canGoBack() && (
				<Button size="icon" variant="outline" onPress={() => router.back()}>
					<Icon as={ChevronLeft} className="size-4" />
				</Button>
			)}
			<View>
				{subtitle && (
					<Text variant="muted" className="">
						{subtitle}
					</Text>
				)}
				<Text variant="h3">{title}</Text>
			</View>
		</View>
	);
}
