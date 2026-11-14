import "@/global.css";
import { PortalHost } from "@rn-primitives/portal";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { ThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Text, View } from "react-native";
import { useUniwind } from "uniwind";
import { db } from "@/db/client";
import migrations from "@/drizzle/migrations";
import { NAV_THEME } from "@/lib/theme";

export default function RootLayout() {
	const { theme } = useUniwind();
	const resolvedTheme = theme === "dark" ? "dark" : "light";
	const { success, error } = useMigrations(db, migrations);

	if (error) {
		return (
			<View className="flex-1 items-center justify-center bg-background p-6">
				<Text className="text-destructive">
					Migration error: {error.message}
				</Text>
			</View>
		);
	}

	if (!success) {
		return (
			<View className="flex-1 items-center justify-center bg-background">
				<ActivityIndicator />
			</View>
		);
	}

	return (
		<ThemeProvider value={NAV_THEME[resolvedTheme]}>
			<StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} />
			<Stack />
			<PortalHost />
		</ThemeProvider>
	);
}
