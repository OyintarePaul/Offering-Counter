import "react-native";

declare module "react-native" {
    interface TextInputType {
        focus(): void;
        blur(): void;
        clear(): void;
        isFocused(): boolean;
    }
}
