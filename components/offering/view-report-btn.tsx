import { View } from "react-native";
import { Link } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { routes } from "@/lib/routes";

interface ViewReportBtnProps {
	serviceId: string;
}

export function ViewReportBtn({ serviceId }: ViewReportBtnProps) {
	return (
		<Link href={routes.report(serviceId)} asChild>
			<Button className="flex-1">
				<Text>View Report</Text>
			</Button>
		</Link>
	);
}
