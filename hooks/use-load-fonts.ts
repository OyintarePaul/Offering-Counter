import { DMSans_400Regular } from "@expo-google-fonts/dm-sans/400Regular";
import { DMSans_600SemiBold } from "@expo-google-fonts/dm-sans/600SemiBold";
import { DMSans_700Bold } from "@expo-google-fonts/dm-sans/700Bold";
import { DMSans_800ExtraBold } from "@expo-google-fonts/dm-sans/800ExtraBold";
import { useFonts } from "@expo-google-fonts/dm-sans/useFonts";

export function useLoadFonts() {
	return useFonts({
		DMSans_400Regular,
		DMSans_600SemiBold,
		DMSans_700Bold,
		DMSans_800ExtraBold,
	});
}
