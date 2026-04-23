import React, { useState, useEffect } from "react";
import {
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Modal,
    StyleSheet
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import CustomNavbar from "../components/navbar";
import CustomFooter from "../components/footer";

export default function SendParcelScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const API_URL = "https://api.nextrest.hu/api";

    const sizeMapping: { [key: string]: { apiValue: string; price: number; courierId: string } } = {
        S: { apiValue: "small", price: 990, courierId: "1" },
        M: { apiValue: "medium", price: 1490, courierId: "2" },
        L: { apiValue: "large", price: 2190, courierId: "3" },
    };

    const [formData, setFormData] = useState({
        user_id: "",
        courier_id: sizeMapping["S"].courierId,
        pickup_address: "",
        dropoff_address: "",
        package_size: "S",
        price: sizeMapping["S"].price,
        status: "pending",
        receiver_name: "",
        receiver_phone: "",
        description: "",
    });

    useEffect(() => {
        const initForm = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("userData");
                const token = await AsyncStorage.getItem("userToken");

                if (!token) {
                    router.replace("/auth/login");
                    return;
                }

                if (storedUser) {
                    const user = JSON.parse(storedUser);
                    setFormData((prev) => ({
                        ...prev,
                        user_id: user.id.toString()
                    }));
                }
            } catch (e) {
                console.error("Hiba az adatok betöltésekor", e);
            }
        };
        initForm();
    }, []);

    const handleSizeChange = (sizeKey: string) => {
        const selected = sizeMapping[sizeKey];
        setFormData({
            ...formData,
            package_size: sizeKey,
            price: selected.price,
            courier_id: selected.courierId
        });
    };

    const validateAndConfirm = () => {
        if (!formData.pickup_address || !formData.dropoff_address || !formData.receiver_name) {
            Alert.alert("Hiba", "Kérlek töltsd ki a kötelező (*) mezőket!");
            return;
        }
        setShowConfirmModal(true);
    };

    const handleFinalSubmit = async () => {
        setShowConfirmModal(false);
        setLoading(true);

        try {
            const token = await AsyncStorage.getItem("userToken");

            const payload = {
                user_id: formData.user_id,
                courier_id: formData.courier_id,
                pickup_address: formData.pickup_address,
                dropoff_address: formData.dropoff_address,
                package_size: sizeMapping[formData.package_size].apiValue,
                price: formData.price,
                status: formData.status,
                notes: `Címzett: ${formData.receiver_name}, Tel: ${formData.receiver_phone}. ${formData.description}`
            };

            const res = await fetch(`${API_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (res.ok) {
                Alert.alert("Siker", "Csomagküldés sikeresen rögzítve!", [
                    { text: "Dashboard", onPress: () => router.push("/user/dashboard") }
                ]);
            } else {
                let errorMsg = data.message || "Hiba történt a mentés során.";
                if (data.errors) {
                    errorMsg = Object.values(data.errors).flat().join("\n");
                }
                Alert.alert("Backend hiba", errorMsg);
            }
        } catch (error) {
            Alert.alert("Hiba", "Hálózati hiba történt. Ellenőrizd a kapcsolatot!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <CustomNavbar title="Csomagküldés" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.card}>

                    <Text style={styles.sectionTitle}>Útvonal adatai</Text>

                    <Text style={styles.label}>Felvételi cím *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="3301, Eger Példa utca 1."
                        value={formData.pickup_address}
                        onChangeText={(t) => setFormData({ ...formData, pickup_address: t })}
                    />

                    <Text style={styles.label}>Kézbesítési cím *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="3301, Eger Példa utca 2."
                        value={formData.dropoff_address}
                        onChangeText={(t) => setFormData({ ...formData, dropoff_address: t })}
                    />

                    <View style={styles.divider} />

                    <Text style={styles.sectionTitle}>Csomag adatai</Text>

                    <Text style={styles.label}>Címzett neve *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Címzett teljes neve"
                        value={formData.receiver_name}
                        onChangeText={(t) => setFormData({ ...formData, receiver_name: t })}
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.label}>Csomag mérete</Text>
                            <View style={styles.sizePicker}>
                                {["S", "M", "L"].map((s) => (
                                    <TouchableOpacity
                                        key={s}
                                        style={[styles.sizeBtn, formData.package_size === s && styles.sizeBtnActive]}
                                        onPress={() => handleSizeChange(s)}
                                    >
                                        <Text style={[styles.sizeText, formData.package_size === s && styles.sizeTextActive]}>{s}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </View>

                    <Text style={styles.label}>Telefon</Text>
                    <TextInput
                        style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                        placeholder="+36 12 345 6789"
                        value={formData.receiver_phone}
                        onChangeText={(t) => setFormData({ ...formData, receiver_phone: t })}
                    />

                    <Text style={styles.label}>Megjegyzés</Text>
                    <TextInput
                        style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
                        multiline
                        placeholder="Pl. kapukód, törékeny áru..."
                        value={formData.description}
                        onChangeText={(t) => setFormData({ ...formData, description: t })}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.push("/user/dashboard")}>
                            <Text style={styles.cancelText}>Mégse</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.submitBtn} onPress={validateAndConfirm} disabled={loading}>
                            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Küldés ({formData.price} Ft)</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            <Modal visible={showConfirmModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <AntDesign name="check-circle" size={45} color="#007AFF" />
                        <Text style={styles.modalTitle}>Rendelés összegzése</Text>

                        <View style={styles.priceBadge}>
                            <Text style={styles.priceBadge}>Fizetendő összeg{'\n'}{'\n'}
                                <Text style={styles.priceValue}>{formData.price} Ft</Text>
                            </Text>

                        </View>

                        <Text style={styles.modalText}>
                            Választott méret: {formData.package_size === 'S' ? 'Kicsi' : formData.package_size === 'M' ? 'Közepes' : 'Nagy'}
                        </Text>
                        <Text style={{ fontSize: 11, color: '#999', marginBottom: 20 }}>
                            Hozzárendelt futár: #{formData.courier_id}{'\n'}
                            <Text style={styles.modalSubText}>Fizetni a futárnál kell.</Text>
                        </Text>


                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowConfirmModal(false)}>
                                <Text style={styles.modalCancelText}>Módosítás</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalConfirm} onPress={handleFinalSubmit}>
                                <Text style={styles.modalConfirmText}>Küldés</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <CustomFooter />
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#efeff6" },
    scrollContent: { paddingVertical: 20, paddingHorizontal: 15, alignItems: "center" },
    card: { backgroundColor: "#fff", width: "100%", maxWidth: 500, borderRadius: 20, padding: 20, elevation: 4, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8 },
    sectionTitle: { fontSize: 18, fontWeight: "800", color: "#333", marginBottom: 10, marginTop: 10 },
    label: { fontSize: 13, fontWeight: "600", color: "#777", marginBottom: 5, marginTop: 10 },
    input: { backgroundColor: "#fdfdfd", borderWidth: 1, borderColor: "#eee", borderRadius: 10, padding: 12, fontSize: 15 },
    divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 20 },
    row: { flexDirection: "row", marginTop: 5 },
    sizePicker: { flexDirection: "row", gap: 8, marginTop: 5 },
    sizeBtn: { flex: 1, height: 45, borderRadius: 10, borderWidth: 1, borderColor: "#ddd", alignItems: "center", justifyContent: "center" },
    sizeBtnActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
    sizeText: { fontWeight: "bold", color: "#666" },
    sizeTextActive: { color: "#fff" },
    buttonContainer: { flexDirection: "row", gap: 12, marginTop: 25 },
    submitBtn: { flex: 2, backgroundColor: "#007AFF", padding: 15, borderRadius: 12, alignItems: "center", justifyContent: 'center' },
    submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    cancelBtn: { flex: 1, padding: 15, borderRadius: 12, alignItems: "center", borderWidth: 1, borderColor: "#ddd" },
    cancelText: { color: "#888", fontWeight: "600" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", padding: 15 },
    modalContent: { backgroundColor: "#fff", borderRadius: 20, padding: 25, alignItems: "center", maxWidth: 450, alignSelf: "center" },
    modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
    modalText: { fontSize: 16, marginBottom: 10 },
    modalSubText: { fontSize: 12, color: "#999", textAlign: "center", marginTop: 10 },
    priceBadge: { backgroundColor: "#eef6ff", padding: 15, borderRadius: 15, marginVertical: 15 },
    priceValue: { fontSize: 28, fontWeight: "900", color: "#007AFF", textAlign: "center" },
    modalButtons: { flexDirection: "row", gap: 10, marginTop: 20, width: "100%" },
    modalCancel: { flex: 1, padding: 12, alignItems: "center", borderColor: "#BBB", borderWidth: 1, borderRadius: 15 },
    modalCancelText: { color: "#aaa", marginHorizontal: 50 },
    modalConfirm: { flex: 2, backgroundColor: "#007AFF", padding: 12, borderRadius: 10, alignItems: "center" },
    modalConfirmText: { color: "#fff", fontWeight: "bold" }
});