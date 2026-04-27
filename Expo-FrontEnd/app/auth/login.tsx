import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
} from "react-native";
import { useRouter, Href } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { usePageTitle } from "../../hooks";
import axiosInstance from "../../api/axiosInstance";

import CustomFooter from "../components/footer";
import CustomNavbar from "../components/navbar";

export default function LoginScreen() {
  usePageTitle("Belépés");
  const router = useRouter();
  const { updateToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mgmtCode, setMgmtCode] = useState("");
  const [loading, setLoading] = useState(false);

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [tempUser, setTempUser] = useState<any>(null);

  const finalizeAuth = async (token: string, user: any, path: string) => {
    try {
      await updateToken(token, user);
      
      await new Promise((resolve) => setTimeout(resolve, 150));
      
      router.replace(path as Href);
    } catch (e) {
      Alert.alert("Hiba", "Hiba történt a munkamenet mentésekor.");
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Hiba", "Kérjük, töltsd ki az összes mezőt!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/login", { email, password });
      const { access_token, user } = response.data;

      if (user.role === "admin") {
        setTempToken(access_token);
        setTempUser(user);
        setShowAdminModal(true);
        setLoading(false);
      } else if (user.role === "courier") {
        await finalizeAuth(access_token, user, "/courier/dashboard");
      } else {
        await finalizeAuth(access_token, user, "/user/dashboard");
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Hibás bejelentkezési adatok!";
      Alert.alert("Hiba", msg);
      setLoading(false);
    }
  };

  const handleAdminModalSubmit = async () => {
    if (!mgmtCode) {
      Alert.alert("Hiba", "Kérjük, adja meg a menedzsment kódot!");
      return;
    }

    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
        mgmt_code: mgmtCode,
      });

      const { access_token, user } = response.data;
      setShowAdminModal(false);
      await finalizeAuth(access_token, user, "/mgmt/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Érvénytelen menedzsment kód!";
      Alert.alert("Hozzáférés megtagadva", msg);
      setMgmtCode("");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#efeff6" }}>
      <CustomNavbar title="Belépés" />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
        >
          <View style={styles.form}>
            <Text style={styles.heading}>Bejelentkezés</Text>

            <TextInput
              style={styles.input}
              placeholder="Email cím"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              style={styles.input}
              placeholder="Jelszó"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity onPress={handleLogin} disabled={loading}>
              <View style={[styles.button, { backgroundColor: "#007AFF" }]}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Belépés</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>

      <Modal visible={showAdminModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Menedzsment azonosítás</Text>
            <Text style={styles.modalSubText}>Adminisztrátor észlelve. Adja meg a .env-ben beállított kódot:</Text>
            
            <TextInput
              style={[styles.input, styles.adminInput, { width: "100%", textAlign: "center" }]}
              placeholder="Kód"
              value={mgmtCode}
              onChangeText={setMgmtCode}
              secureTextEntry
              keyboardType="number-pad"
              autoFocus
            />

            <View style={{ flexDirection: "row", gap: 10, width: "100%" }}>
              <TouchableOpacity 
                style={[styles.button, { flex: 1, backgroundColor: "#8e8e93" }]} 
                onPress={() => setShowAdminModal(false)}
              >
                <Text style={styles.buttonText}>Mégse</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, { flex: 1, backgroundColor: "#34C759" }]} 
                onPress={handleAdminModalSubmit}
              >
                <Text style={styles.buttonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CustomFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingVertical: 50, paddingHorizontal: 20 },
  form: { width: "100%", maxWidth: 400 },
  heading: { fontSize: 28, fontWeight: "700", marginBottom: 30, color: "#1a1a1a", textAlign: "center" },
  input: { height: 55, borderRadius: 12, paddingHorizontal: 16, fontSize: 16, marginBottom: 16, backgroundColor: "#fff", color: "#000", borderWidth: 1, borderColor: "#ddd" },
  adminInput: { borderColor: "#34C759", borderWidth: 2 },
  button: { height: 55, alignItems: "center", justifyContent: "center", borderRadius: 12, elevation: 3 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "85%", maxWidth: 350, backgroundColor: "#fff", borderRadius: 24, padding: 25, alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 5 },
  modalSubText: { fontSize: 14, color: "#666", textAlign: "center", marginBottom: 20 }
});