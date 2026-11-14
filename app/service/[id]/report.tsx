import { router, Stack, useLocalSearchParams } from "expo-router";
import { FlatList, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomHeader } from "@/components/custom-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useServiceTree } from "@/db/live";
import { formatNaira } from "@/lib/money";
import { buildReport, ReportModel } from "@/lib/report";

const TABULAR_NUMS = { fontVariant: ["tabular-nums"] as const };

export default function ReportScreen() {
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { services, ready } = useServiceTree();

    const service = services.find((s) => s.id === Number(id));

    if (!ready) {
        return <View className="flex-1 bg-background" />;
    }

    if (!service) {
        return (
            <View className="flex-1 items-center justify-center bg-background">
                <Text className="text-muted-foreground">Service not found.</Text>
            </View>
        );
    }

    const report = buildReport(service);
    const hasCategories = report.categories.length > 0;

    const renderItem = ({ item: category }) => (
        <Card className="gap-3">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle>{category.name}</CardTitle>
                <Text className="font-semibold" style={TABULAR_NUMS}>
                    {formatNaira(category.total)}
                </Text>
            </CardHeader>
            <CardContent className="gap-1.5">
                {category.rows.map((row) => (
                    <View
                        key={row.denomination}
                        className="flex-row items-center justify-between"
                    >
                        <Text className="text-muted-foreground">
                            {formatNaira(row.denomination)} × {row.count}
                        </Text>
                        <Text className="text-muted-foreground" style={TABULAR_NUMS}>
                            {formatNaira(row.amount)}
                        </Text>
                    </View>
                ))}
            </CardContent>
        </Card>
    )

    return (
        <View
            style={{ paddingBottom: Math.max(insets.bottom, 30) }}
            className="flex-1 bg-background"
        >
            <Stack.Screen
                options={{ header: () => <CustomHeader title="Report" /> }}
            />

            <FlatList
                className="flex-1"
                contentContainerClassName="gap-4 p-4"
                data={report.categories}
                keyExtractor={(item) => item.name}
                ListHeaderComponent={
                    hasCategories ? (
                        <ReportHeader report={report}/>
                    ) : null
                }
                ListEmptyComponent={EmptyReport}
                renderItem={renderItem}
            />

            {hasCategories && (
                <View className="px-4 pt-2">
                    <Button>
                        <Text>Save Report</Text>
                    </Button>
                </View>
            )}
        </View>
    );
}


function ReportHeader({ report }: { report: reportModel }) {
    return (
        <View className="rounded-xl bg-primary p-6">
            <Text className="text-sm text-primary-foreground">
                Grand total &bull; {report.serviceLabel}
            </Text>
            <Text
                variant="h2"
                className="font-extrabold text-primary-foreground"
                style={TABULAR_NUMS}
            >
                {formatNaira(report.grandTotal)}
            </Text>
        </View>
    )
}

function EmptyReport() {
    return (
        <View className="mt-6 items-center gap-4">
            <Text className="text-muted-foreground">Nothing counted yet.</Text>
            <Button variant="outline" onPress={() => router.back()}>
                <Text>Back to service</Text>
            </Button>
        </View>
    )
}
