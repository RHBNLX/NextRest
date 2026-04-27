import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { usePageTitle } from "../hooks";
import CustomNavbar from "./components/navbar";
import CustomFooter from "./components/footer";

interface Notice {
  id: number;
  title: string;
  description: string;
  date: string;
  type: "update" | "fix" | "feature";
}

const NOTICES: Notice[] = [
  {
    id: 1,
    title: "v2.1.0 Frissítés - Support Chat",
    description:
      "Elérhetővé vált az élő hibajegykezelő rendszer. Mostantól közvetlenül kommunikálhatsz a központtal.",
    date: "2026.03.20",
    type: "feature",
  },
  {
    id: 2,
    title: "Bejelentkezési hiba javítva",
    description:
      "Javítottuk a Bearer token lejáratakor fellépő hibát, amely engedélyezte a további használatot kijelentkezés után.",
    date: "2026.03.18",
    type: "fix",
  },
  {
    id: 3,
    title: "Adatvédelmi irányelvek",
    description:
      "Frissítettük a Cookie Policy-t a követelményeknek megfelelően.",
    date: "2026.05.15",
    type: "update",
  },
  {
    id: 4,
    title: "Új felhasználói felület",
    description:
      "Bevezettük az új, egyszerűbb felhasználói felületet, amely jobb felhasználói élményt nyújt.",
    date: "2026.05.10",
    type: "feature",
  },
  {
    id: 5,
    title: "Teljesítményjavítások",
    description:
      "Optimalizáltuk az adatbázis lekérdezéseket, így gyorsabbá vált a rendszer.",
    date: "2026.03.05",
    type: "fix",
  },
  {
    id: 6,
    title: "Új API végpontok",
    description: "Kibővítettük az API-t új végpontokkal a fejlesztők számára.",
    date: "2026.04.01",
    type: "feature",
  },
  {
    id: 7,
    title: "Biztonsági frissítés",
    description:
      "Javítottuk a biztonsági réseket, hogy még biztonságosabbá tegyük a szolgáltatást.",
    date: "2026.04.25",
    type: "fix",
  },
];

export default function NoticeBoardScreen() {
  usePageTitle("Felhívások");
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "feature":
        return { backgroundColor: "#28a745" };
      case "fix":
        return { backgroundColor: "#dc3545" };
      default:
        return { backgroundColor: "#007aff" };
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case "feature":
        return "ÚJ FUNKCIÓ";
      case "fix":
        return "JAVÍTÁS";
      default:
        return "FRISSÍTÉS";
    }
  };

  return (
    <View style={styles.container}>
      <CustomNavbar title="Hirdetőtábla" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Fejlesztői Hírek</Text>
          <Text style={styles.subtitle}>
            Kövesd nyomon a projekt fejlődését és a legfrissebb módosításokat.
          </Text>
        </View>

        <View
          style={[
            styles.grid,
            { flexDirection: isMobile ? "column" : "row", flexWrap: "wrap" },
          ]}
        >
          {NOTICES.map((item) => (
            <View
              key={item.id}
              style={[styles.card, { width: isMobile ? "100%" : "48%" }]}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.badge, getTypeStyle(item.type)]}>
                  <Text style={styles.badgeText}>{getTypeText(item.type)}</Text>
                </View>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <CustomFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#efeff6" },
  scrollContent: {
    padding: 20,
    maxWidth: 1100,
    alignSelf: "center",
    width: "100%",
    paddingBottom: 50,
  },
  header: { marginBottom: 30, alignItems: "center" },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  subtitle: { fontSize: 16, color: "#666", textAlign: "center" },
  grid: { gap: 20, justifyContent: "space-between" },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderTopWidth: 5,
    borderTopColor: "#007aff",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },
  dateText: {
    color: "#999",
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  cardDescription: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
});
