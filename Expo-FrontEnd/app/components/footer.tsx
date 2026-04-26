import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Footer() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        © {new Date().getFullYear()} Nextrest. Minden jog fenntartva.
      </Text>

      <TouchableOpacity onPress={() => router.push("/faq")} activeOpacity={0.7}>
        <Text style={styles.link}>GYIK</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/cookie-policy")} activeOpacity={0.7}>
        <Text style={styles.link}>Süti Tájékoztató</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/noticeBoard")} activeOpacity={0.7}>
        <Text style={styles.link}>Felhívások</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
    color: "#117bff",
  },
  link: {
    fontSize: 14,
    fontWeight: "500",
    color: "#117bff",
    textDecorationLine: "underline",
  },
});
