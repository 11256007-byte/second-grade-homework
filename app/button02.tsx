import { useState } from "react";
import {
    Button,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function Button02() {
  const [log, setLog] = useState("點擊任一按鈕...");

  return (
    <View style={styles.container}>
      <Text style={styles.log}>{log}</Text>

      {/* ───────────────────────────────────────
          1. Button
          - 最簡單，樣式固定（iOS / Android 不同）
          - 只能設定 title 和 color，無法自訂外觀
         ─────────────────────────────────────── */}
      <Button
        title="Button"
        color="#4A90E2"
        onPress={() => setLog("Button 被按下")}
      />

      <View style={styles.divider} />

      {/* ───────────────────────────────────────
          2. TouchableOpacity
          - 按下時整體透明度降低（opacity 效果）
          - 可完全自訂子元件樣式
          - activeOpacity 控制按下時的透明度（預設 0.2）
         ─────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.touchable}
        activeOpacity={0.9}
        onPress={() => setLog("TouchableOpacity 被按下")}
      >
        <Text style={styles.btnText}>TouchableOpacity</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* ───────────────────────────────────────
          3. Pressable
          - 最新、最靈活的按鈕元件
          - style 可接收函式，依 pressed 狀態動態改變樣式
          - 支援 onPressIn / onPressOut / onLongPress
         ─────────────────────────────────────── */}
      <Pressable
        style={({ pressed }) => [
          styles.pressable,
          pressed && styles.pressableActive,
        ]}
        onPress={() => setLog("Pressable 被按下")}
        onLongPress={() => setLog("Pressable 長按！")}
      >
        {({ pressed }) => (
          <Text style={styles.btnText}>
            {pressed ? "放開我..." : "Pressable"}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
  },
  log: {
    fontSize: 16,
    marginBottom: 24,
    color: "#333",
  },
  divider: {
    height: 8,
  },
  // TouchableOpacity 樣式
  touchable: {
    backgroundColor: "#7B7B7B",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  // Pressable 預設樣式
  pressable: {
    backgroundColor: "#E24A4A",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  // Pressable 按下時的樣式
  pressableActive: {
    backgroundColor: "#9B2222",
    transform: [{ scale: 0.96 }],
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
