import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomFooter from "./components/footer";
import CustomNavbar from "./components/navbar";

type ResponsiveSectionProps = {
  title: string;
  children: ReactNode;
  marginTop?: number;
};

function ResponsiveSection({
  title,
  children,
  marginTop = 0,
}: ResponsiveSectionProps) {
  const { width } = useWindowDimensions();
  // Meghatározzuk, hogy mobil vagy asztali nézetben vagyunk-e
  const isMobile = width < 768;

  return (
    <View
      style={[
        styles.rowSectionLeft,
        {
          // Mobilon egymás alatt, asztalin egymás mellett
          flexDirection: isMobile ? "column" : "row",
          // Csak asztali nézetben adunk balról margót
          paddingLeft: isMobile ? 0 : 50,
          marginTop,
          // Alapértelmezett gap mobilon, asztalin nagyobb térközt hagyunk
          gap: isMobile ? 10 : 32,
        },
      ]}
    >
      {/* Cím szekció */}
      <View
        style={{
          // Mobilon teljes szélesség, asztalin rugalmas (flex: 1)
          width: isMobile ? "100%" : undefined,
          flex: isMobile ? 0 : 1,
          // Asztalin legalább 300px, legfeljebb 400px széles
          minWidth: isMobile ? undefined : 300,
          maxWidth: isMobile ? undefined : 400,
          // Mobilon középre, asztalin balra igazított tartalom
          alignItems: isMobile ? "center" : "flex-start",
          // Mobilon adunk egy kis alsó margót, hogy ne érjen hozzá a tartalomhoz
          marginBottom: isMobile ? 15 : 0,
        }}
      >
        <Text
          style={{
            // Mobilon kisebb (28), asztalin nagyobb (48) betűméret
            fontSize: isMobile ? 28 : 48,
            fontWeight: "800",
            color: "#007AFF",
            // Mobilon középre, asztalin balra (vagy jobbra) igazított szöveg
            // Itt javítottuk a hibás [] értéket "center"-re
            textAlign: isMobile ? "center" : "left",
            width: "100%", // A Text View kitölti a szülő View-t
          }}
        >
          {title}
        </Text>
      </View>

      {/* Szöveges tartalom szekció */}
      <View
        style={{
          // Mobilon teljes szélesség, asztalin rugalmas (flex: 2)
          width: isMobile ? "100%" : undefined,
          flex: isMobile ? 0 : 2,
          // Maximum 900 pixel széles lehet
          maxWidth: isMobile ? undefined : 900,
        }}
      >
        {children}
      </View>
    </View>
  );
}

export default function Index() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');

        if (token && userData) {
          setIsLoggedIn(true);
          setUser(JSON.parse(userData));
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      } catch (e) {
        console.error("Hiba az auth ellenőrzésekor:", e);
      }
    };
    checkAuth();
  }, []);

  const titleFontSize = isMobile ? 55 : 125;
  const bodySize = isMobile ? 16 : 17;

  // Navigációs szűrő
  const handleProtectedAction = (path: string) => {
    if (isLoggedIn) {
      router.push(path as any);
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <View style={styles.container}>
      <CustomNavbar title="Home" />

      <View style={styles.iconBackground}>
        <AntDesign name="codepen" size={250} color="#000" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Text style={[styles.titleText, { fontSize: titleFontSize }]}>
            {user ? `Szia, ${user.name}!` : "Üdvözöl a Nextrest!"}
          </Text>
          <Text style={[styles.subtitleText, { fontSize: isMobile ? 18 : 24 }]}>
            Gyors és megbízható csomagszállítás, bárhová is kéred.
          </Text>
        </View>

        <View style={styles.rowSection}>
          <TouchableOpacity style={styles.topCard} onPress={() => handleProtectedAction("/user/sendParcel")}>
            <AntDesign name="plus-circle" size={30} color="#007AFF" />
            <Text style={styles.descTitle}>Csomagküldés</Text>
            <Text style={styles.descText}>
              Hozz létre egy új szállítási igényt pár egyszerű lépésben.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.topCard} onPress={() => router.push("/user/tracking")}>
            <AntDesign name="search" size={30} color="#007AFF" />
            <Text style={styles.descTitle}>Csomagkövetés</Text>
            <Text style={styles.descText}>
              Kövesd nyomon a küldeményed valós idejű frissítésekkel.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.topCard} onPress={() => handleProtectedAction("/user/dashboard")}>
            <AntDesign name="environment" size={30} color="#007AFF" />
            <Text style={styles.descTitle}>Rendeléseim</Text>
            <Text style={styles.descText}>
              Tekintsd meg és kezeld az összes szállításodat egy helyen.
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.whiteSection}>
          <ResponsiveSection title="Bemutatkozunk">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <AntDesign name="team" size={24} color="#007AFF" />
              <Text style={{ fontWeight: '700', color: '#007AFF' }}>Kik vagyunk mi?</Text>
            </View>
            <Text style={[styles.bodyText, { fontSize: bodySize }]}>
              A Nextrest egy iskolai projektnek indult, amit majdnem elvetettünk egy "jobb" ötlet miatt:
              egy borbély üzlet weboldala lett volna. Szerencsére a borbély nem válaszolt, így Kiss Imre Marcell
              és jómagam (Miklós Ilián Richárd) elkezdtünk dolgozni ezen a csomagszállító projekten.
              Mivel még középiskolások vagyunk, ott spórolunk a költségeken, ahol tudunk, de a csomagod
              garantáltan egyben érkezik meg.

            </Text>
          </ResponsiveSection>

          <ResponsiveSection title="Árazás" marginTop={35}>
            <View style={styles.pricingWrapper}>
              <View style={styles.priceCard}>
                <AntDesign name="gift" size={24} color="#007AFF" />
                <Text style={styles.priceTitle}>Kicsi (S)</Text>
                <Text style={styles.priceAmount}>990 Ft</Text>
                <Text style={styles.priceSubtitle}>Max 5 kg</Text>
              </View>
              <View style={[styles.priceCard, { borderColor: '#007AFF', borderWidth: 2, backgroundColor: '#f0f7ff' }]}>
                <View style={styles.badge}><Text style={styles.badgeText}>NÉPSZERŰ</Text></View>
                <AntDesign name="code-sandbox" size={24} color="#007AFF" />
                <Text style={styles.priceTitle}>Közepes (M)</Text>
                <Text style={styles.priceAmount}>1 490 Ft</Text>
                <Text style={styles.priceSubtitle}>Max 15 kg</Text>
              </View>
              <View style={styles.priceCard}>
                <AntDesign name="car" size={24} color="#007AFF" />
                <Text style={styles.priceTitle}>Nagy (L)</Text>
                <Text style={styles.priceAmount}>2 190 Ft</Text>
                <Text style={styles.priceSubtitle}>Max 30 kg</Text>
              </View>
            </View>
          </ResponsiveSection>

          <ResponsiveSection title="Elérhetőség" marginTop={35}>
            <View style={{ flexDirection: 'row', gap: 20, marginTop: 15 }}>
              <AntDesign name="android" size={30} color="#a4c639" />
            </View>
            <Text
              style={{
                fontSize: bodySize,
                color: "#444",
                lineHeight: 26,
                marginTop: 15,
              }}
            >
              A Nextrest mobilalkalmazásként is elérhető.{"\n"}
              Töltsd le a Google Play Áruházból!
            </Text>
          </ResponsiveSection>


          <ResponsiveSection title="Support" marginTop={35}>
            <Text style={[styles.bodyText, { fontSize: bodySize }]}>
              Ha bármilyen problémád adódna, ügyfélszolgálati csapatunk készséggel segít neked.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/support")}
              style={[styles.topCard, { marginTop: 25, flexDirection: 'row', gap: 10, alignSelf: isMobile ? "stretch" : "flex-start" }]}
            >
              <AntDesign name="customer-service" size={20} color="#007AFF" />
              <Text style={styles.descTitle}>Kapcsolat</Text>
            </TouchableOpacity>
          </ResponsiveSection>
        </View>
      </ScrollView>

      <CustomFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#efeff6" },
  iconBackground: { position: "absolute", top: "32%", alignSelf: "center", opacity: 0.05, zIndex: 0 },
  scrollContent: { padding: 16, gap: 65, zIndex: 1 },
  hero: { backgroundColor: "#fff", alignItems: "center", borderRadius: 20, padding: 10 },
  titleText: { fontWeight: "bold", textAlign: "center", color: "#007AFF", marginTop: 24 },
  subtitleText: { textAlign: "center", color: "#333", marginTop: 12, marginBottom: 32, maxWidth: 700 },
  rowSection: { flexDirection: "row", justifyContent: "center", gap: 32, flexWrap: "wrap" },
  rowSectionLeft: { width: "100%", maxWidth: 1500, alignSelf: "center", flexWrap: "wrap" },
  whiteSection: { backgroundColor: "#fff", borderRadius: 20, padding: 25 },
  bodyText: { color: "#444", lineHeight: 26, marginTop: 15 },
  topCard: { alignItems: "center", backgroundColor: "#fff", padding: 24, borderRadius: 20, gap: 15, borderColor: "#e0e0e0", borderWidth: 1 },
  descTitle: { fontSize: 22, fontWeight: "700", color: "#007AFF", textAlign: "center" },
  descText: { fontSize: 17, color: "#444", lineHeight: 28, textAlign: "center" },
  pricingWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginTop: 20 },
  priceCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, minWidth: 160, alignItems: 'center', flex: 1, borderColor: '#eee', borderWidth: 1 },
  priceTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  priceAmount: { fontSize: 22, fontWeight: '800', color: '#007AFF', marginVertical: 5 },
  priceSubtitle: { fontSize: 14, color: '#888' },
  badge: { position: 'absolute', top: -10, backgroundColor: '#007AFF', paddingHorizontal: 10, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' }
});