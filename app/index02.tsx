import { Text, View, StyleSheet } from "react-native";

// Union type 限制 size props 只能是這三個值
type ButtonSize = "small" | "medium" | "large";

// Union type 限制 variant props 只能是這三個值
type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = {
  label: string;
  size: ButtonSize;
  variant: ButtonVariant;
};

function Button({ label, size, variant }: ButtonProps) {
  return (
    <View style={[styles.button, styles[size], styles[variant]]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export default function Index02() {
  return (
    <View style={styles.container}>
      {/* ✅ 正確用法 */}
      <Button label="確認" size="large" variant="primary" />
      <Button label="取消" size="medium" variant="secondary" />
      <Button label="刪除" size="small" variant="danger" />

      {/* ❌ 以下會產生 TypeScript 錯誤，因為不在 union type 範圍內 */}
      {/* <Button label="錯誤" size="huge" variant="warning" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    color: "#fff",
    fontWeight: "bold",
  },
  // size variants
  small: { paddingHorizontal: 12, paddingVertical: 6 },
  medium: { paddingHorizontal: 20, paddingVertical: 10 },
  large: { paddingHorizontal: 28, paddingVertical: 14 },
  // color variants
  primary: { backgroundColor: "#4A90E2" },
  secondary: { backgroundColor: "#7B7B7B" },
  danger: { backgroundColor: "#E24A4A" },
});
