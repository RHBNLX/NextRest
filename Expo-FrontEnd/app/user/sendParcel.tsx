import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    ActivityIndicator,
    Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import CustomNavbar from "../components/navbar";
import CustomFooter from "../components/footer";

export default function ReturnParcel() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        receiver_name: "",
        receiver_email: "",
        receiver_address: "",
        receiver_phone: "",
        weight: "",
        size: "S",
        description: "",
    });

    useEffect(() => {
        const getToken = async () => {
            const storedToken = await AsyncStorage.getItem("userToken");
            if (!storedToken) {
                router.replace("/auth/login" as any);
            } else {
                setToken(storedToken);
            }
        };
        getToken();
    }, []);

    const handleSubmit = async () => {
        if (!formData.receiver_name || !formData.receiver_address || !formData.weight) {
            Alert.alert("Hiba", "Kérlek töltsd ki a kötelező mezőket!");
            return;
        }

        try {
            setLoading(true);
            const response = await fetch("https://api.nextrest.hu/api/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,

                    weight: parseFloat(formData.weight),
                }),
            });

            if (response.ok) {
                Alert.alert("Siker", "Csomagküldési igényedet rögzítettük!", [
                    { text: "OK", onPress: () => router.push("/user/dashboard" as any) }
                ]);
            } else {
                const errorData = await response.json();
                Alert.alert("Hiba", errorData.message || "Valami hiba történt.");
            }
        } catch (error) {
            Alert.alert("Hiba", "Nem sikerült csatlakozni a szerverhez.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <CustomNavbar title="Csomagküldés" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>
                    <View style={styles.header}>
                        <AntDesign name="form" size={24} color="#007AFF" />
                        <Text style={styles.headerTitle}>Küldemény adatai</Text>
                    </View>

                    <Text style={styles.label}>Címzett neve *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Minta János"
                        value={formData.receiver_name}
                        onChangeText={(t) => setFormData({ ...formData, receiver_name: t })}
                    />

                    <Text style={styles.label}>Szállítási cím *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="1234 Budapest, Példa utca 1."
                        value={formData.receiver_address}
                        onChangeText={(t) => setFormData({ ...formData, receiver_address: t })}
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Súly (kg) *</Text>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                placeholder="5"
                                value={formData.weight}
                                onChangeText={(t) => setFormData({ ...formData, weight: t })}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.label}>Méret</Text>
                            <View style={styles.sizePicker}>
                                {["S", "M", "L"].map((s) => (
                                    <TouchableOpacity
                                        key={s}
                                        style={[styles.sizeBtn, formData.size === s && styles.sizeBtnActive]}
                                        onPress={() => setFormData({ ...formData, size: s })}
                                    >
                                        <Text style={[styles.sizeText, formData.size === s && styles.sizeTextActive]}>{s}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    <Text style={styles.label}>Címzett telefonszáma</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="phone-pad"
                        placeholder="+36 30 123 4567"
                        value={formData.receiver_phone}
                        onChangeText={(t) => setFormData({ ...formData, receiver_phone: t })}
                    />

                    <Text style={styles.label}>Megjegyzés (opcionális)</Text>
                    <TextInput
                        style={[styles.input, { height: 80, textAlignVertical: "top" }]}
                        multiline
                        placeholder="Pl.: törékeny, kapucsengő 12..."
                        value={formData.description}
                        onChangeText={(t) => setFormData({ ...formData, description: t })}
                    />

                    <TouchableOpacity
                        style={styles.submitBtn}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.submitText}>Csomag feladása</Text>
                                <AntDesign name="arrow-right" size={20} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <CustomFooter />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#efeff6" },
    scrollContent: { padding: 20, alignItems: "center" },
    card: {
        backgroundColor: "#fff",
        width: "100%",
        maxWidth: 600,
        borderRadius: 20,
        padding: 24,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 5,
    },
    header: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 25 },
    headerTitle: { fontSize: 22, fontWeight: "700", color: "#333" },
    label: { fontSize: 14, fontWeight: "600", color: "#666", marginBottom: 8, marginTop: 12 },
    input: {
        backgroundColor: "#f9f9f9",
        borderWidth: 1,
        borderColor: "#e0e0e0",
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
    },
    row: { flexDirection: "row", justifyContent: "space-between" },
    sizePicker: { flexDirection: "row", gap: 5 },
    sizeBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e0e0e0",
        alignItems: "center"
    },
    sizeBtnActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
    sizeText: { fontWeight: "bold", color: "#666" },
    sizeTextActive: { color: "#fff" },
    submitBtn: {
        backgroundColor: "#007AFF",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        borderRadius: 15,
        marginTop: 30,
        gap: 10,
    },
    submitText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});