import { ScrollView, StyleSheet, Text, View } from "react-native";

const longData = Array.from({ length: 30 }, (_, i) => `第 ${i + 1} 筆資料`);

export default function ScrollView01() {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>View 與 ScrollView 比較</Text>
      <Text style={styles.desc}>
        下方兩個區塊都放入 30 筆資料，容器高度都固定為 220。
      </Text>

      <Text style={styles.blockTitle}>1) View：內容過長時不支援捲動</Text>
      <View style={styles.box}>
        {longData.map((item) => (
          <Text key={`view-${item}`} style={styles.itemText}>
            {item}
          </Text>
        ))}
      </View>

      <Text style={styles.blockTitle}>2) ScrollView：內容過長時可上下捲動</Text>
      <View style={styles.box}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {longData.map((item) => (
            <Text key={`scroll-${item}`} style={styles.itemText}>
              {item}
            </Text>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 56,
    paddingHorizontal: 16,
    backgroundColor: "#F7F7F7",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },
  desc: {
    color: "#666",
    marginBottom: 14,
  },
  blockTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  box: {
    height: 220,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 10,
  },
  itemText: {
    fontSize: 14,
    lineHeight: 24,
  },
});
