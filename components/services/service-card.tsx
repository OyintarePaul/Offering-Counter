import { Link } from "expo-router";
import { Pressable, View } from "react-native";
import { DeleteServiceDialog } from "@/components/services/delete-service-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import type { useServiceTree } from "@/db/live";
import { formatServiceDate } from "@/lib/dates";
import { formatNaira, grandTotal } from "@/lib/money";
import { routes } from "@/lib/routes";

export type ServiceItem = ReturnType<typeof useServiceTree>["services"][number];

type ServiceCardProps = {
	service: ServiceItem;
};

export function ServiceCard({ service }: ServiceCardProps) {
	const offeringCount = service.offerings.length;

	return (
		<Link href={routes.offerings(service.id)} asChild>
			<Pressable>
				<Card>
					<CardHeader className="flex-row justify-between items-center gap-2">
						<View className="flex-1">
							<CardTitle className="text-primary">{service.label}</CardTitle>
							<Text variant="h4">{formatServiceDate(service.serviceDate)}</Text>
						</View>
						<Text variant="muted" className="text-muted-foreground">
							{offeringCount} {offeringCount === 1 ? "offering" : "offerings"}
						</Text>
						<DeleteServiceDialog serviceId={service.id} />
					</CardHeader>
					<CardContent className="flex-row items-center justify-between">
						<Text variant="h3" className="text-accent font-sans-bold">
							{formatNaira(grandTotal(service.offerings))}
						</Text>
					</CardContent>
				</Card>
			</Pressable>
		</Link>
	);
}
