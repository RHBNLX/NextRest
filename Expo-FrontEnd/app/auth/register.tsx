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
import { useRouter } from "expo-router";
import { usePageTitle } from "../../hooks";
import axiosInstance from "../../api/axiosInstance";

import CustomFooter from "../components/footer";
import CustomNavbar from "../components/navbar";

export default function RegisterScreen() {
  usePageTitle("Regisztráció");
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const phoneRegex = /^(\+36|06|0036)(20|30|31|50|70)\d{7}$/;

    if (!name || !email || !password || !phone) {
      setError("Minden mező kitöltése kötelező!");
      return;
    }

    if (!phoneRegex.test(phone)) {
      setError(
        "Kérjük, érvényes magyar telefonszámot adjon meg (+36xx1234567)!",
      );
      return;
    }

    if (password.length < 8) {
      setError("A jelszónak legalább 8 karakternek kell lennie!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await axiosInstance.post("/users", {
        name,
        email,
        password,
        phone_number: phone,
        role: "customer",
      });

      router.replace("/auth/login");
    } catch (err: any) {
      let fullError = err.response?.data?.message || "Hiba történt.";
      if (err.response?.data?.errors) {
        fullError = Object.values(err.response.data.errors).flat().join("\n");
      }
      setError(fullError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
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
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Regisztráció</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.link}
            onPress={() => router.push("/auth/login")}
          >
            <Text style={styles.linkText}>
              Már van fiókod? <Text style={styles.bold}>Jelentkezz be!</Text>
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
    marginBottom: 30,
    color: "#1a1a1a",
    textAlign: "center",
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
    backgroundColor: "#a0cfff",
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
