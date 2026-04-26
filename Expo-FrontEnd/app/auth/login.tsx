import React, { useState, useRef } from "react";
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
  Switch,
  Animated,
  Alert, // 1. Importáljuk az Alert-et
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

import CustomFooter from "../components/footer";
import CustomNavbar from "../components/navbar";

export default function LoginScreen() {
  const router = useRouter();
  const { updateToken } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mgmtCode, setMgmtCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const colorAnim = useRef(new Animated.Value(0)).current;

  const toggleAdmin = (value: boolean) => {
    setIsAdmin(value);
    Animated.timing(colorAnim, {
      toValue: value ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const buttonColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#007AFF", "#34C759"],
  });

const handleLogin = async () => {
    if (!email || !password || (isAdmin && !mgmtCode)) {
      // Böngészőben ez a natív felugró ablakot hívja meg
      if (typeof window !== 'undefined') {
        window.alert("Kérlek, tölts ki minden mezőt!");
      }
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = isAdmin
        ? { email, password, mgmt_code: mgmtCode }
        : { email, password };

      const response = await axiosInstance.post("/login", payload);
      const { access_token, token, user } = response.data;
      const finalToken = access_token || token;

      if (finalToken && user) {
        await updateToken(finalToken, user);

        // Webes környezetben a replace stabilabb navigációt biztosít
        if (isAdmin) {
          router.replace("/mgmt/dashboard");
        } else {
          router.replace("/user/dashboard");
        }
      } else {
        if (typeof window !== 'undefined') {
          window.alert("Szerver hiba: A szerver nem küldött érvényes tokent.");
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || "Sikertelen bejelentkezés!";
      setError(msg); // A vizuális hibaüzenetet is megtartjuk a gomb felett
      
      // Felugró ablak a hiba részleteivel
      if (typeof window !== 'undefined') {
        window.alert(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <CustomNavbar title={isAdmin ? "Admin Belépés" : "Bejelentkezés"} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={styles.heading}>
            {isAdmin ? "Management Portál" : "Üdvözöljük!"}
          </Text>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Admin mód</Text>
            <Switch
              trackColor={{ false: "#ccc", true: "#34C759" }}
              thumbColor={Platform.OS === "ios" ? "" : "#fff"}
              onValueChange={toggleAdmin}
              value={isAdmin}
            />
          </View>

          <TextInput
            placeholder="Email cím"
            placeholderTextColor="#666"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Jelszó"
            placeholderTextColor="#666"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {isAdmin && (
            <TextInput
              placeholder="Titkos MGMT kód"
              placeholderTextColor="#666"
              secureTextEntry
              style={[styles.input, styles.adminInput]}
              value={mgmtCode}
              onChangeText={setMgmtCode}
            />
          )}

          {/* Az errorText-et megtartottam vizuális visszajelzésnek, de az Alert már felugrik előtte */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Animated.View
            style={[
              { borderRadius: 12, overflow: "hidden", marginTop: 10 },
              { backgroundColor: buttonColor },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.button,
                { marginTop: 0 },
                loading && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {isAdmin ? "Admin Belépés" : "Bejelentkezés"}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {!isAdmin && (
            <TouchableOpacity
              style={styles.link}
              onPress={() => router.push("/auth/register")}
            >
              <Text style={styles.linkText}>
                Még nincs fiókod? <Text style={styles.bold}>Regisztrálj!</Text>
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      <CustomFooter />
    </KeyboardAvoidingView>
  );
}

// ... (stílusok változatlanok)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efeff6",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "transparent",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1a1a1a",
    textAlign: "center",
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    gap: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  input: {
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    color: "#000",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  adminInput: {
    borderColor: "#34C759",
    borderWidth: 1.5,
  },
  button: {
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  errorText: {
    color: "#ff3b30",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
    fontWeight: "500",
  },
  link: {
    marginTop: 20,
    alignItems: "center",
  },
  linkText: {
    color: "#666",
    fontSize: 15,
  },
  bold: {
    color: "#007AFF",
    fontWeight: "700",
  },
});
