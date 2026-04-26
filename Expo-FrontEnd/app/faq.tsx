import { ScrollView, StyleSheet, Text, View } from "react-native";
import CustomFooter from "./components/footer";
import CustomNavbar from "./components/navbar";

export default function FAQ() {
  return (
    <View style={styles.container}>
      <CustomNavbar title="GYIK" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Gyakran Ismételt Kérdések</Text>

        <View style={styles.faqItem}>
          <Text style={styles.question}>Hogyan küldhetek csomagot?</Text>
          <Text style={styles.answer}>
            Egyszerűen hozz létre egy fiókot, válaszd a „Csomagküldés” opciót,
            add meg a felvételi és szállítási adatokat, majd igazold vissza a kérést.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>Hogyan követhetem nyomon a szállítást?</Text>
          <Text style={styles.answer}>
            Minden csomag rendelkezik egy követési azonosítóval (ID). A szállítmányodat
            a „Csomagkövetés” menüpont alatt ellenőrizheted.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>Biztosítva van a csomagom?</Text>
          <Text style={styles.answer}>Nem. Nem egy biztosítótársaság vagyunk.</Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>Milyen területekre szállítotok?</Text>
          <Text style={styles.answer}>
            Jelenleg kizárólag Magyarország területén szállítunk. A nemzetközi
            szállítás a mi életünkben már valószínűleg sosem fog megvalósulni.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>Mennyi ideig tart a kiszállítás?</Text>
          <Text style={styles.answer}>Őszintén szólva, fogalmam sincs...</Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>Kihez fordulhatok segítségért?</Text>
          <Text style={styles.answer}>
            Ügyfélszolgálatunkat a kapcsolat oldalon keresztül érheted el
            egy hibajegy (ticket) beküldésével.
          </Text>
        </View>
      </ScrollView>

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
    padding: 24,
    maxWidth: 900,
    width: "100%",
    alignSelf: "center",
  },

  pageTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#007aff",
    marginBottom: 32,
    textAlign: "center",
  },

  faqItem: {
    marginBottom: 28,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },

  question: {
    fontSize: 18,
    fontWeight: "700",
    color: "#007aff",
    marginBottom: 10,
  },

  answer: {
    fontSize: 15,
    color: "#444",
    lineHeight: 24,
  },
});