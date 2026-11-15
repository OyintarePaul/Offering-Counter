import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { formatNaira, grandTotal } from "@/lib/money";
import type { CategoryItem } from "./offering-card";

type ServiceSummaryProps = {
	offerings: CategoryItem[];
};

export function OfferingsSummary({ offerings }: ServiceSummaryProps) {
	return (
		<Card className="bg-primary">
			<CardContent className="gap-2">
				<Text
					variant="muted"
					className="text-background font-semibold leading-none"
				>
					Service total
				</Text>
				<Text variant="h1" className="text-background leading-none">
					{formatNaira(grandTotal(offerings))}
				</Text>
			</CardContent>
		</Card>
	);
}
