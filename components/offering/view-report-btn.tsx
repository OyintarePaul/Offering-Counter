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
		<View className="px-4 pt-4">
			<Link href={routes.report(serviceId)} asChild>
				<Button>
					<Text>View Report</Text>
				</Button>
			</Link>
		</View>
	);
}
