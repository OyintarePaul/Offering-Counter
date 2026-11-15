import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { formatNaira, grandTotal } from "@/lib/money";
import type { OfferingItem } from "./offering-card";

type OfferingsSummaryProps = {
	offerings: OfferingItem[];
};

export function OfferingsSummary({ offerings }: OfferingsSummaryProps) {
	return (
		<Card className="bg-primary">
			<CardContent className="gap-2">
				<Text variant="muted" className="text-background leading-none">
					Service total
				</Text>
				<Text variant="h1" className="text-background leading-none">
					{formatNaira(grandTotal(offerings))}
				</Text>
			</CardContent>
		</Card>
	);
}
