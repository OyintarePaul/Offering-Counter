import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Platform, Pressable } from "react-native";

const buttonVariants = cva(
	cn(
		"group shrink-0 flex-row items-center justify-center gap-2 rounded-lg shadow-none",
		Platform.select({
			web: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive whitespace-nowrap outline-none transition-all focus-visible:ring-[3px] disabled:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
		}),
	),
	{
		variants: {
			variant: {
				default: cn(
					"bg-primary active:bg-primary/90",
					Platform.select({ web: "hover:bg-primary/90" }),
				),
				destructive: cn(
					"bg-destructive active:bg-destructive/90 dark:bg-destructive/60",
					Platform.select({
						web: "hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
					}),
				),
                "destructive-soft": "bg-destructive/5 dark:bg-destructive/15 active:bg-destructive/15 dark:active:bg-destructive/25",
				outline: cn(
					"border border-border bg-background active:bg-background/90 dark:bg-input/30 dark:border-input dark:active:bg-input/50",
					Platform.select({
						web: "hover:bg-accent dark:hover:bg-input/50",
					}),
				),
				secondary: cn(
					"bg-secondary active:bg-secondary/80",
					Platform.select({ web: "hover:bg-secondary/80" }),
				),
				ghost: cn(
					"active:bg-accent dark:active:bg-accent/50",
					Platform.select({ web: "hover:bg-accent dark:hover:bg-accent/50" }),
				),
				link: "",
				dashed: cn(
					"border border-border border-dashed bg-background active:bg-background/90 dark:bg-input/30 dark:border-input dark:active:bg-input/50",
					Platform.select({
						web: "hover:bg-accent dark:hover:bg-input/50",
					}),
				),
			},
			size: {
				default: cn(
					"h-12 px-4 py-2 sm:h-9",
					Platform.select({ web: "has-[>svg]:px-3" }),
				),
				sm: cn(
					"h-9 gap-1.5 rounded-md px-3 sm:h-8",
					Platform.select({ web: "has-[>svg]:px-2.5" }),
				),
				lg: cn(
					"h-11 rounded-md px-6 sm:h-10",
					Platform.select({ web: "has-[>svg]:px-4" }),
				),
				icon: "h-11 w-11 sm:h-10 sm:w-10 rounded-lg",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const buttonTextVariants = cva(
	cn(
		"text-foreground text-sm font-bold",
		Platform.select({ web: "pointer-events-none transition-colors" }),
	),
	{
		variants: {
			variant: {
				default: "text-primary-foreground",
				destructive: "text-white",
                "destructive-soft": "text-destructive",
				outline: cn(
					"text-primary group-active:text-accent-foreground",
					Platform.select({ web: "group-hover:text-accent-foreground" }),
				),
				secondary: "text-secondary-foreground",
				ghost: "group-active:text-accent-foreground",
				link: cn(
					"text-primary group-active:underline",
					Platform.select({
						web: "underline-offset-4 hover:underline group-hover:underline",
					}),
				),
				dashed: cn(
					"text-primary group-active:text-accent-foreground",
					Platform.select({ web: "group-hover:text-accent-foreground" }),
				),
			},
			size: {
				default: "",
				sm: "",
				lg: "",
				icon: "",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

type ButtonProps = React.ComponentProps<typeof Pressable> &
	React.RefAttributes<typeof Pressable> &
	VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
	return (
		<TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
			<Pressable
				className={cn(
					props.disabled && "opacity-50",
					buttonVariants({ variant, size }),
					className,
				)}
				role="button"
				{...props}
			/>
		</TextClassContext.Provider>
	);
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
