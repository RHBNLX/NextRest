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
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

import CustomFooter from "../components/footer";
import CustomNavbar from "../components/navbar";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const API_URL = "https://api.nextrest.hu/api";

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Kérlek, add meg az email címed és a jelszavad!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Sikertelen bejelentkezés!");
        return;
      }

      if (data.access_token) {
        await AsyncStorage.setItem('userToken', data.access_token);
        if (data.user) {
          await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        }
        router.replace("/user/dashboard");
      } else {
        setError("A szerver nem küldött érvényes tokent.");
      }
    } catch (err) {
      setError("Hálózati hiba történt!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <CustomNavbar title="Bejelentkezés" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={styles.heading}>Üdvözöljük!</Text>

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

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Bejelentkezés</Text>}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => router.push("/auth/register")}
          >
            <Text style={styles.linkText}>
              Még nincs fiókod? <Text style={styles.bold}>Regisztrálj!</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <CustomFooter />
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efeff6"
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
    marginBottom: 30,
    color: "#1a1a1a",
    textAlign: "center"
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
  button: {
    height: 55,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledButton: {
    backgroundColor: "#a0cfff"
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600"
  },
  errorText: {
    color: "#ff3b30",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
    fontWeight: "500"
  },
  link: {
    marginTop: 20,
    alignItems: "center"
  },
  linkText: {
    color: "#666",
    fontSize: 15
  },
  bold: {
    color: "#007AFF",
    fontWeight: "700"
  },
});