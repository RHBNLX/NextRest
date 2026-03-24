import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import type { ReactNode } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

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
        },
      ]}
    >
      <Text
        style={{
          fontSize: isMobile ? 42 : 90,
          color: "#007AFF",
          width: "100%",
        }}
      >
        {title}
      </Text>

      <View style={{ width: "100%", maxWidth: 900 }}>{children}</View>
    </View>
  );
}

export default function Index() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const titleFontSize = isMobile ? 55 : 125;
  const bodySize = isMobile ? 16 : 17;

  return (
    <View style={styles.container}>
      <CustomNavbar title="Home" />

      <View style={styles.iconBackground}>
        <AntDesign name="codepen" size={250} color="#000" />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Text style={[styles.titleText, { fontSize: titleFontSize }]}>
            Welcome to Nextrest!
          </Text>
          <Text style={[styles.subtitleText, { fontSize: isMobile ? 18 : 24 }]}>
            Fast & reliable parcel delivery, wherever you need it.
          </Text>
        </View>

        <View style={styles.rowSection}>
          <TouchableOpacity style={styles.topCard}>
            <Text style={styles.descTitle}>Send a Parcel</Text>
            <Text style={styles.descText}>
              Create a new delivery request in just a few steps.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.topCard}>
            <Text style={styles.descTitle}>Track a Parcel</Text>
            <Text style={styles.descText}>
              Follow your shipment with real-time updates.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.topCard}>
            <Text style={styles.descTitle}>My Orders</Text>
            <Text style={styles.descText}>
              View and manage all your deliveries in one place.
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[styles.rowSection, { backgroundColor: "#fff", borderRadius: 20, padding: 25, }]}>
          <ResponsiveSection title="Let us introduce ourselves">
            <Text
              style={{
                fontSize: bodySize,
                color: "#444",
                lineHeight: 26,
                marginTop: 15,
              }}
            >
              Nextrest started as an idea for a school project, which was almost
              ditched due to a better idea: a website for a barber shop.
              Fortunately, the barber shop got out of question due to the client
              not answering. So, Kiss Imre Marcell and I (Miklós Ilián Richárd)
              started working on this parcel delivery project. Since we are
              still high school students, we cut costs where we can, but your
              package will arrive in one piece. If it does not, you can contact
              Customer Support — and if it does, please leave a review.
            </Text>
          </ResponsiveSection>

          <ResponsiveSection title="Availability" marginTop={35}>
            <Text
              style={{
                fontSize: bodySize,
                color: "#444",
                lineHeight: 26,
                marginTop: 15,
              }}
            >
              Nextrest is also available for mobile devices as well.{"\n"}
              Download it from Google Play Store or the Apple App Store.
            </Text>
          </ResponsiveSection>

          <ResponsiveSection title="Customer Support" marginTop={35}>
            <Text
              style={{
                fontSize: bodySize,
                color: "#444",
                lineHeight: 26,
                marginTop: 15,
              }}
            >
              If you encounter any issues with your deliveries or have
              questions, our Customer Support team is here to help you.
            </Text>

            <TouchableOpacity
              onPress={() => router.push("/support")}
              style={[
                styles.topCard,
                {
                  marginTop: 25,
                  alignSelf: isMobile ? "stretch" : "flex-start",
                },
              ]}
            >
              <Text style={styles.descTitle}>Contact Support</Text>
            </TouchableOpacity>
          </ResponsiveSection>
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

  iconBackground: {
    position: "absolute",
    top: "32%",
    alignSelf: "center",
    opacity: 0.05,
    zIndex: 0,
  },

  scrollContent: {
    padding: 16,
    gap: 65,
    zIndex: 1,
  },

  hero: {
    backgroundColor: "#fff",
    alignItems: "center",
    borderRadius: 20,
    padding: 10,
  },

  titleText: {
    fontWeight: "bold",
    textAlign: "center",
    color: "#007AFF",
    marginTop: 24,
  },
  subtitleText: {
    textAlign: "center",
    color: "#333",
    marginTop: 12,
    marginBottom: 32,
    maxWidth: 700,
  },

  rowSection: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 32,
    flexWrap: "wrap",
  },

  rowSectionLeft: {
    width: "100%",
    maxWidth: 1500,
    alignSelf: "center",
    flexWrap: "wrap",
    gap: 32,
  },

  topCard: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    gap: 15,
    borderColor: "#e0e0e0",
    borderWidth: 1,
  },

  descTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#007AFF",
    width: 220,
    textAlign: "center",
  },
  descText: {
    fontSize: 17,
    color: "#444",
    lineHeight: 28,
    textAlign: "center",
  },
});
