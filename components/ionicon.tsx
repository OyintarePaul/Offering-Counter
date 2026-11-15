import { withUniwind } from "uniwind";
import { Ionicons as BaseIonicons } from "@react-native-vector-icons/ionicons";
import { cn } from "@/lib/utils";

const StyledIonicons = withUniwind(BaseIonicons);

export type IoniconProps = React.ComponentProps<typeof StyledIonicons>;

export function Ionicon({ colorClassName, size = 20, ...props }: IoniconProps) {
	return (
		<StyledIonicons
			size={size}
			colorClassName={cn("accent-foreground", colorClassName)}
			{...props}
		/>
	);
}
