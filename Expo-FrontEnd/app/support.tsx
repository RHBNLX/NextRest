import React, { useEffect, useState } from "react";
import {
  StyleSheet, Text, TouchableOpacity, useWindowDimensions,
  View, TextInput, ScrollView, Alert
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomFooter from "./components/footer";
import CustomNavbar from "./components/navbar";

export default function Index() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // App State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [ticketType, setTicketType] = useState("General Support");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkLoginStatus();
    if (typeof document !== 'undefined') {
      document.title = "Customer Support | NextRest";
    }
  }, []);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setIsLoggedIn(!!token);
    if (!token) setTicketType("General Support");
  };

  const handleSend = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');

      const response = await fetch("http://api.nextrest.hu/api/support_tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: isLoggedIn ? 1 : null,
          order_id: ticketType === "Parcel Issue" ? 1 : null,
          subject: subject,
          message: message,
          status: "open"
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert("Siker", data.uzenet);
        setSubject("");
        setMessage("");
      } else {
        Alert.alert("Hiba", data.uzenet || "Hiba történt a küldés során.");
      }
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült kapcsolódni a szerverhez.");
    }
  };

  return (
    <View style={styles.container}>
      <CustomNavbar title="Customer Support" />
      <ScrollView contentContainerStyle={[styles.mainLayout, { flexDirection: isMobile ? "column" : "row" }]}>

        {/* Left Sidebar remains the same... */}

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Submit a Ticket</Text>
          <View style={styles.formCard}>

            <Text style={styles.label}>Issue Category</Text>
            {!isLoggedIn && <Text style={styles.loginWarning}>Log in to report parcel issues.</Text>}

            <View style={styles.selectionRow}>
              {["Parcel Issue", "General Support"].map((type) => {
                const isDisabled = type === "Parcel Issue" && !isLoggedIn;
                return (
                  <TouchableOpacity
                    key={type}
                    disabled={isDisabled}
                    style={[
                      styles.chip,
                      ticketType === type && styles.chipActive,
                      isDisabled && styles.chipDisabled
                    ]}
                    onPress={() => setTicketType(type)}
                  >
                    <Text style={[
                      styles.chipText,
                      ticketType === type && styles.chipTextActive,
                      isDisabled && styles.chipTextDisabled
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>Subject</Text>
            <TextInput style={styles.input} value={subject} onChangeText={setSubject} />

            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              multiline
              value={message}
              onChangeText={setMessage}
            />

            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Text style={styles.sendButtonText}>Send Support Ticket</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <CustomFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  chipDisabled: {
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
  },
  chipTextDisabled: {
    color: "#999",
  },
  loginWarning: {
    fontSize: 12,
    color: "#ff3b30",
    marginBottom: 5,
    fontStyle: "italic"
  },

  container: { flex: 1, backgroundColor: "#efeff6" },
  mainLayout: { padding: 20, gap: 20 },
  sidebar: { gap: 15 },
  sidebarTitle: { fontSize: 24, fontWeight: "bold", color: "#007aff", marginBottom: 5 },
  infoCard: { backgroundColor: "#fff", padding: 25, borderRadius: 20, elevation: 2 },
  infoText: { fontSize: 16, lineHeight: 24, color: "#444" },
  bold: { fontWeight: "700", color: "#007aff" },
  formContainer: { flex: 1 },
  formTitle: { fontSize: 24, fontWeight: "bold", color: "#007aff", marginBottom: 20 },
  formCard: { backgroundColor: "#fff", padding: 25, borderRadius: 20, gap: 15, elevation: 2 },
  label: { fontSize: 14, fontWeight: "600", color: "#666", marginBottom: 5 },
  selectionRow: { flexDirection: "row", gap: 10, marginBottom: 10 },
  chip: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, borderWidth: 1, borderColor: "#007aff" },
  chipActive: { backgroundColor: "#007aff" },
  chipText: { color: "#007aff", fontWeight: "600" },
  chipTextActive: { color: "#fff" },
  input: {
    backgroundColor: "#f9f9fb",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  sendButton: {
    backgroundColor: "#007aff",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    marginTop: 10,
  },
  sendButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});