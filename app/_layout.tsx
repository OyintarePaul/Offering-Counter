import "@/global.css";
import { PortalHost } from "@rn-primitives/portal";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { ThemeProvider } from "expo-router/react-navigation";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Text, View } from "react-native";
import { useUniwind } from "uniwind";
import { db } from "@/db/client";
import migrations from "@/drizzle/migrations";
import { NAV_THEME } from "@/lib/theme";
import * as SystemUI from "expo-system-ui";

export default function RootLayout() {
	const { theme } = useUniwind();
	const resolvedTheme = theme === "dark" ? "dark" : "light";
	const { success, error } = useMigrations(db, migrations);

    useEffect(() => {
        SystemUI.setBackgroundColorAsync(
        NAV_THEME[resolvedTheme].colors.background
    );
}, [resolvedTheme]);

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
			<Stack screenOptions={{
                title: "",
                contentStyle: {
                    backgroundColor: NAV_THEME[resolvedTheme].colors.background
                }
            }}/>
			<PortalHost />
		</ThemeProvider>
	);
}
