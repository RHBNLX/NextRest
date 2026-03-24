import { ScrollView, StyleSheet, Text, View } from "react-native";
import CustomFooter from "./components/footer";
import CustomNavbar from "./components/navbar";

export default function FAQ() {
  return (
    <View style={styles.container}>
      <CustomNavbar title="FAQ" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.pageTitle}>Frequently Asked Questions</Text>

        <View style={styles.faqItem}>
          <Text style={styles.question}>How do I send a parcel?</Text>
          <Text style={styles.answer}>
            Simply create an account, choose “Send a Parcel”, fill in the pickup
            and delivery details, and confirm your request.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>How can I track my delivery?</Text>
          <Text style={styles.answer}>
            Every parcel has a tracking ID. You can track your shipment from the
            “Track a Parcel” section.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>Is my parcel insured?</Text>
          <Text style={styles.answer}>No? We're not an insurance company.</Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>What areas do you deliver to?</Text>
          <Text style={styles.answer}>
            We currently deliver in Hungary only, with international shipping
            coming never in our lifespan.
          </Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>How long does delivery take?</Text>
          <Text style={styles.answer}>Honestly man, I don't know...</Text>
        </View>

        <View style={styles.faqItem}>
          <Text style={styles.question}>Who can I contact for support?</Text>
          <Text style={styles.answer}>
            You can reach our support team via the contact page, by submitting a ticket.
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
    fontWeight: "700",
    color: "#117bff",
    marginBottom: 32,
  },

  faqItem: {
    marginBottom: 28,
  },

  question: {
    fontSize: 20,
    fontWeight: "600",
    color: "#117bff",
    marginBottom: 8,
  },

  answer: {
    fontSize: 16,
    color: "#666",
    lineHeight: 26,
  },
});
