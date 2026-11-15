import { Pressable, View } from "react-native";
import { Link } from "expo-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { categoryTotal, formatNaira } from "@/lib/money";
import type { useServiceTree } from "@/db/live";
import { DeleteOfferingDialog } from "@/components/offering/delete-offering-dialog";
import { routes } from "@/lib/routes"

export type OfferingItem = ReturnType<
	typeof useServiceTree
>["services"][number]["offerings"][number];

type Props = {
	offering: OfferingItem;
	serviceId: string;
};

export function OfferingCard({ offering, serviceId }: Props) {
	const counted = offering.entries.filter((e) => e.count > 0).length;

	return (
		<Link href={routes.serviceEntries(serviceId, offering.id)} asChild>
			<Pressable>
				<Card>
					<CardContent className="flex-row gap-2 items-center">
						<View className="flex-1">
							<Text variant="h4" className="text-base">
								{offering.name}
							</Text>
							<Text variant="muted" className="text-muted-foreground">
								{counted} denomination{counted === 1 ? "" : "s"} counted
							</Text>
						</View>
						<Text variant="h4" className="text-accent">
							{formatNaira(categoryTotal(offering.entries))}
						</Text>

						<DeleteOfferingDialog offeringId={offering.id} />
					</CardContent>
				</Card>
			</Pressable>
		</Link>
	);
}
