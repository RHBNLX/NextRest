import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";

import CustomFooter from "../components/footer";
import CustomNavbar from "../components/navbar";

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "https://api.nextrest.hu/api";

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) {
      setError("Minden mező kitöltése kötelező!");
      return;
    }
    if (password.length < 8) {
      setError("A jelszónak legalább 8 karakternek kell lennie!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          phone_number: phone,
          role: "customer",
          avatar_url: null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        let fullError = data.message || "Hiba történt.";

        if (data.errors) {
          fullError = Object.values(data.errors).flat().join("\n");
        }
        setError(fullError);
        return;
      }
      router.replace("/auth/login");

    } catch (err) {
      console.error(err);
      setError("Hálózati hiba történt. Ellenőrizd az internetkapcsolatot!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomNavbar title="Regisztráció" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <Text style={styles.heading}>Hozzon létre fiókot!</Text>

          <TextInput
            placeholder="Teljes név"
            placeholderTextColor="#666"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />

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
            placeholder="Telefonszám"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
          />

          <TextInput
            placeholder="Jelszó (min. 8 karakter)"
            placeholderTextColor="#666"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.registerButton, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Regisztráció</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.loginLinkText}>
              Már van fiókod? <Text style={styles.bold}>Jelentkezz be!</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#efeff6" },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  form: { width: "100%", maxWidth: 400 },
  heading: { fontSize: 26, fontWeight: "700", marginBottom: 25, color: "#1a1a1a", textAlign: "center" },
  input: {
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  registerButton: {
    height: 55,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  disabledButton: { backgroundColor: "#a0cfff" },
  registerButtonText: { color: "#fff", fontSize: 17, fontWeight: "600" },
  errorText: { color: "#ff3b30", textAlign: "center", marginBottom: 15, fontSize: 14 },
  loginLink: { marginTop: 20, alignItems: "center" },
  loginLinkText: { color: "#666", fontSize: 15 },
  bold: { color: "#007AFF", fontWeight: "700" },
});