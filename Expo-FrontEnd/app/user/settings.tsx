import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Alert,
    TextInput,
    Modal,
    useWindowDimensions,
    ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";

import CustomNavbar from "../components/navbar";
import CustomFooter from "../components/footer";

export default function SettingsScreen() {
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isDesktop = width > 768;
    const API_URL = "https://api.nextrest.hu/api";

    const [user, setUser] = useState({ id: null, name: "", email: "", phone_number: "" });
    const [editModal, setEditModal] = useState(false);
    const [tempUser, setTempUser] = useState({ name: "", phone_number: "" });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadUser = async () => {
            const data = await AsyncStorage.getItem("userData");
            if (data) {
                const parsed = JSON.parse(data);
                setUser(parsed);
                setTempUser({ name: parsed.name, phone_number: parsed.phone_number || "" });
            }
        };
        loadUser();
    }, []);

    const handleSave = async () => {
        if (!tempUser.name.trim()) {
            Alert.alert("Hiba", "A név nem lehet üres!");
            return;
        }

        setIsSaving(true);

        try {
            const token = await AsyncStorage.getItem("userToken");

            const res = await fetch(`${API_URL}/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: tempUser.name,
                    phone_number: tempUser.phone_number,
                }),
            });

            let data: any = {};
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await res.json();
            }

            if (res.ok) {
                const updatedUser = { ...user, ...tempUser };
                setUser(updatedUser);
                await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
                setEditModal(false);
                Alert.alert("Siker", "Profil adatok elmentve!");
            } else {
                const errorMessage = data?.message || `Szerver hiba: ${res.status}`;
                Alert.alert("Hiba", errorMessage);
            }
        } catch (error) {
            console.error("Fetch error:", error);
            Alert.alert("Hiba", "Hálózati hiba történt!");
        } finally {
            setIsSaving(false);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.multiRemove(["userToken", "userData"]);
        router.replace("/auth/login");
    };

    return (
        <View style={styles.container}>
            <CustomNavbar title="Beállítások" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.wrapper, isDesktop && styles.row]}>

                    {/* Sidebar */}
                    <View style={[styles.sidebar, isDesktop && styles.desktopSidebar]}>
                        <View style={styles.profileBrief}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>{user.name ? user.name[0].toUpperCase() : "?"}</Text>
                            </View>
                            <Text style={styles.sideName}>{user.name}</Text>
                            <Text style={styles.sideEmail}>{user.email}</Text>
                        </View>

                        <TouchableOpacity style={styles.menuItem} onPress={() => setEditModal(true)}>
                            <AntDesign name="user" size={20} color="#007AFF" />
                            <Text style={styles.menuItemText}>Szerkesztés</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                            <AntDesign name="logout" size={20} color="#ff3b30" />
                            <Text style={[styles.menuItemText, { color: "#ff3b30" }]}>Kijelentkezés</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Main Content */}
                    <View style={[styles.mainContent, isDesktop && styles.desktopMain]}>
                        <Text style={styles.sectionHeader}>Személyes Információk</Text>

                        <View style={styles.infoCard}>
                            <View style={styles.infoField}>
                                <Text style={styles.label}>Teljes név</Text>
                                <Text style={styles.value}>{user.name}</Text>
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.infoField}>
                                <Text style={styles.label}>Email Cím</Text>
                                <Text style={styles.value}>{user.email}</Text>
                            </View>
                            <View style={styles.separator} />
                            <View style={styles.infoField}>
                                <Text style={styles.label}>Telefonszám</Text>
                                <Text style={styles.value}>{user.phone_number || "Not provided"}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Edit Modal */}
            <Modal visible={editModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Profil Szerkeztés</Text>

                        <Text style={styles.inputLabel}>Név</Text>
                        <TextInput
                            style={styles.input}
                            value={tempUser.name}
                            onChangeText={(t) => setTempUser({ ...tempUser, name: t })}
                            placeholder="Enter your name"
                        />

                        <Text style={styles.inputLabel}>Telefonszám</Text>
                        <TextInput
                            style={styles.input}
                            value={tempUser.phone_number}
                            onChangeText={(t) => setTempUser({ ...tempUser, phone_number: t })}
                            keyboardType="phone-pad"
                            placeholder="Enter your phone number"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setEditModal(false)}
                                disabled={isSaving}
                            >
                                <Text style={styles.cancelText}>Mégse</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.saveBtn, isSaving && { opacity: 0.7 }]}
                                onPress={handleSave}
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.saveText}>Mentés</Text>
                                )}
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
    container: { flex: 1, backgroundColor: "#f4f4f9" },
    scrollContent: { paddingVertical: 20, paddingHorizontal: 15, alignItems: 'center' },
    wrapper: { width: "100%", maxWidth: 1100, gap: 20 },
    row: { flexDirection: "row", alignItems: "flex-start" },
    sidebar: { backgroundColor: "#fff", borderRadius: 15, padding: 20, width: "100%", elevation: 2 },
    desktopSidebar: { width: 300 },
    profileBrief: { alignItems: "center", marginBottom: 20, borderBottomWidth: 1, borderBottomColor: "#eee", paddingBottom: 20 },
    avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#007AFF", justifyContent: "center", alignItems: "center", marginBottom: 10 },
    avatarText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
    sideName: { fontSize: 18, fontWeight: "bold", color: "#333" },
    sideEmail: { fontSize: 13, color: "#777" },
    menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, gap: 10 },
    menuItemText: { fontSize: 16, fontWeight: "500", color: "#444" },
    logoutItem: { marginTop: 10, borderTopWidth: 1, borderTopColor: "#eee", paddingTop: 15 },
    mainContent: { flex: 1, width: "100%" },
    desktopMain: { paddingLeft: 10 },
    sectionHeader: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 15 },
    infoCard: { backgroundColor: "#fff", borderRadius: 15, padding: 20, elevation: 2 },
    infoField: { paddingVertical: 10 },
    label: { fontSize: 13, color: "#888", marginBottom: 3 },
    value: { fontSize: 16, color: "#333", fontWeight: "500" },
    separator: { height: 1, backgroundColor: "#eee" },
    modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
    modalContent: { backgroundColor: "#fff", width: "90%", maxWidth: 400, borderRadius: 20, padding: 25 },
    modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    inputLabel: { fontSize: 14, color: "#666", marginBottom: 5, marginTop: 10 },
    input: { backgroundColor: "#f0f0f5", padding: 12, borderRadius: 10, fontSize: 16 },
    modalButtons: { flexDirection: "row", gap: 10, marginTop: 30 },
    cancelBtn: { flex: 1, padding: 15, alignItems: "center" },
    saveBtn: { flex: 2, backgroundColor: "#007AFF", padding: 15, borderRadius: 12, alignItems: "center" },
    cancelText: { color: "#666", fontWeight: "600" },
    saveText: { color: "#fff", fontWeight: "bold" }
});