import { useCallback } from "react";
import { FlatList, View } from "react-native";
import { router, Stack } from "expo-router";
import { useServiceTree } from "@/db/live";
import { CustomHeader } from "@/components/custom-header";
import { NewServiceDialog } from "@/components/services/new-service-dialog";
import {
    ServiceCard,
    type ServiceItem,
} from "@/components/services/service-card";
import { EmptyServices } from "@/components/services/empty-services";

export default function ServicesScreen() {
    const { services: list, ready } = useServiceTree();

    const renderItem = useCallback(
        ({ item }: { item: ServiceItem }) => <ServiceCard service={item} />,
        [],
    );

    return (
        <View className="flex-1 bg-background">
            <Stack.Screen
                options={{
                    header: () => (
                        <CustomHeader
                            subtitle="Offering Counter"
                            title="Services"
                        />
                    ),
                }}
            />

            <FlatList
                data={ready ? list : []}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                ListEmptyComponent={ready ? EmptyServices : undefined}
                contentContainerClassName="gap-4 p-4 flex-grow"
                showsVerticalScrollIndicator={false}
            />

            <NewServiceDialog />
        </View>
    );
}
