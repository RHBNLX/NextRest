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
  const isMobile = width < 768;

  return (
    <View
      style={[
        styles.rowSectionLeft,
        {
          flexDirection: isMobile ? "column" : "row",
          paddingLeft: isMobile ? 0 : 50,
          marginTop,
          gap: isMobile ? 10 : 32,
        },
      ]}
    >
      <View
        style={{
          width: isMobile ? "100%" : undefined,
          flex: isMobile ? 0 : 1,
          minWidth: isMobile ? undefined : 300,
          maxWidth: isMobile ? undefined : 400,
          alignItems: isMobile ? "center" : "flex-start",
          marginBottom: isMobile ? 15 : 0,
        }}
      >
        <Text
          style={{
            fontSize: isMobile ? 28 : 48,
            fontWeight: "800",
            color: "#007AFF",
            textAlign: isMobile ? "center" : "left",
            width: "100%",
          }}
        >
          {title}
        </Text>
      </View>
      <View
        style={{
          width: isMobile ? "100%" : undefined,
          flex: isMobile ? 0 : 2,
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

  const titleFontSize = isMobile ? 45 : 100;
  const bodySize = isMobile ? 16 : 17;

  const handleProtectedAction = (path: string) => {
    if (isLoggedIn) {
      router.push(path as any);
    } else {
      router.push("/auth/login");
    }
  };

  return (
    <View style={styles.container}>
      <CustomNavbar title="Főoldal" />

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

          <TouchableOpacity
            style={[styles.topCard, { width: isMobile ? "100%" : 320 }]}
            onPress={() => router.push("/auth/login")}
          >
            <AntDesign name="user" size={40} color="#007AFF" />
            <Text style={styles.descTitle}>Bejelentkezés</Text>
            <Text style={styles.descText}>
              Üdvözlünk újra a NextRest-nél! Jelentkezz be a fiókodba a funkciók eléréséhez.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.topCard, { width: isMobile ? "100%" : 320 }]}
            onPress={() => handleProtectedAction("/user/sendParcel")}
          >
            <AntDesign name="plus-circle" size={40} color="#007AFF" />
            <Text style={styles.descTitle}>Csomagküldés</Text>
            <Text style={styles.descText}>
              Hozz létre egy új szállítási igényt pár egyszerű lépésben, gyorsan és kényelmesen.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.topCard, { width: isMobile ? "100%" : 320 }]}
            onPress={() => handleProtectedAction("/auth/register")}
          >
            <AntDesign name="user-add" size={40} color="#007AFF" />
            <Text style={styles.descTitle}>Regisztráció</Text>
            <Text style={styles.descText}>
              1 perc alatt létrehozhatod fiókodat és máris élvezheted a NextRest előnyeit!
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
              A Nextrest egy iskolai projektnek indult, amit majdnem elvetettünk egy "jobb" ötlet miatt.
              Szerencsére Kiss Imre Marcell és Miklós Ilián Richárd elkezdtünk dolgozni ezen a csomagszállító projekten.
              Garantáljuk, hogy a csomagod épségben célba ér!
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

          <ResponsiveSection title="Support" marginTop={35}>
            <Text style={[styles.bodyText, { fontSize: bodySize }]}>
              Ha bármilyen problémád adódna, ügyfélszolgálati csapatunk készséggel segít neked.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/support")}
              style={[styles.actionButton, { marginTop: 20 }]}
            >
              <AntDesign name="customer-service" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Kapcsolatfelvétel</Text>
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
  scrollContent: { padding: 16, gap: 40, zIndex: 1 },
  hero: { backgroundColor: "#fff", alignItems: "center", borderRadius: 20, padding: 20, width: '100%' },
  titleText: { fontWeight: "bold", textAlign: "center", color: "#007AFF", marginTop: 10 },
  subtitleText: { textAlign: "center", color: "#333", marginTop: 12, marginBottom: 20, maxWidth: 700 },

  rowSection: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    flexWrap: "wrap",
    width: "100%",
    maxWidth: 1200,
    alignSelf: 'center'
  },

  topCard: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    minHeight: 280,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  rowSectionLeft: { width: "100%", maxWidth: 1500, alignSelf: "center" },
  whiteSection: { backgroundColor: "#fff", borderRadius: 20, padding: 25, marginBottom: 20 },
  bodyText: { color: "#444", lineHeight: 26, marginTop: 15 },

  descTitle: { fontSize: 22, fontWeight: "700", color: "#007AFF", marginTop: 15, textAlign: "center" },
  descText: { fontSize: 16, color: "#666", lineHeight: 24, textAlign: "center", marginTop: 10 },

  pricingWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, marginTop: 20 },
  priceCard: { backgroundColor: '#fff', padding: 20, borderRadius: 15, minWidth: 160, alignItems: 'center', flex: 1, borderColor: '#eee', borderWidth: 1 },
  priceTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  priceAmount: { fontSize: 22, fontWeight: '800', color: '#007AFF', marginVertical: 5 },
  priceSubtitle: { fontSize: 14, color: '#888' },
  badge: { position: 'absolute', top: -10, backgroundColor: '#007AFF', paddingHorizontal: 10, borderRadius: 10 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },

  actionButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    gap: 10,
    alignSelf: 'flex-start'
  },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});