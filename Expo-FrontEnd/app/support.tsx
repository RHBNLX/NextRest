import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import CustomFooter from "./components/footer";
import CustomNavbar from "./components/navbar";

export default function Index() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.container}>
      <CustomNavbar title="Customer Support" />
      <View style={styles.content}>
        <Text
          style={[
            styles.card,
            {
              width: isMobile ? "auto" : 1500,
              fontSize: isMobile ? 20 : 35,
            },
          ]}
        >
          Email: support@nextrest.com{"\n"}
          Phone: +36 30 111 3625{"\n"}
          Address: Cifrakapu u. 158{"\n"}
          City: 3300 Eger{"\n\n"}
          Monday – Friday:{"\n"}8:00 AM – 4:00 PM{"\n\n"}
          Saturday – Sunday:{"\n"}Closed
        </Text>
      </View>

      <CustomFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efeff6",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    flexWrap: "wrap",
    alignSelf: "center",
    margin: 25,
    color: "#007aff",
  },
});
