import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CustomFooter from "../components/footer";
import CustomNavbar from "../components/navbar";

export default function Index() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/;

  const handleRegister = () => {
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be 8–16 characters and include an uppercase letter, a number, and a symbol."
      );
      return;
    }

    setError("");
    // TODO: Submit registration
    console.log({ username, email, password });
  };

  return (
    <View style={styles.container}>
      <CustomNavbar title="Register" />

      <View style={styles.formContainer}>
        <View style={styles.form}>
          <Text style={styles.heading}>Welcome!</Text>

          <TextInput
            placeholder="Username"
            placeholderTextColor="#666"
            autoComplete="username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            placeholder="Email"
            placeholderTextColor="#666"
            autoComplete="email"
            keyboardType="email-address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#666"
            autoComplete="password"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.loginButton}
            onPress={handleRegister}
          >
            <Text style={styles.loginButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>

      <CustomFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#efeff6",
  },

  formContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 50,
    zIndex: 1,
  },

  form: {
    width: "90%",
    maxWidth: 400,
  },

  heading: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 24,
    color: "#000",
    textAlign: "center",
  },

  input: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fff",
    color: "#000",
  },

  loginButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,

    shadowColor: "#007Aff",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },

  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
});
