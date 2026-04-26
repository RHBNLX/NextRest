import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  useWindowDimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

import CustomNavbar from "../components/navbar";
import CustomFooter from "../components/footer";

const showAlert = (title: string, message: string) => {
  if (typeof window !== 'undefined') {
    window.alert(`${title}\n${message}`);
  }
};

export default function SettingsScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { user: authUser, logout } = useAuth();
  const isDesktop = width > 768;

  const [user, setUser] = useState({
    id: null as number | null,
    name: "",
    email: "",
    phone_number: "",
    avatar_url: "",
    phone_changed_at: null as string | null,
  });

  const [editModal, setEditModal] = useState(false);
  const [tempUser, setTempUser] = useState({
    name: "",
    phone_number: "",
    email: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (authUser) {
      setUser({
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        phone_number: authUser.phone_number || "",
        avatar_url: authUser.avatar_url || "",
        phone_changed_at: authUser.phone_changed_at || null,
      });
      setTempUser({
        name: authUser.name,
        phone_number: authUser.phone_number || "",
        email: authUser.email,
      });
    }
  }, [authUser]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      showAlert("Hiba", "Engedélyre van szükség a galéria eléréséhez!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      try {
        setIsSaving(true);
        const response = await axiosInstance.put(`/users/${user.id}`, {
          avatar_url: base64Image,
        });

        const updatedUser = { ...user, avatar_url: base64Image };
        setUser(updatedUser);
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
        showAlert("Siker", "Profilkép sikeresen frissítve!");
      } catch (error) {
        showAlert("Hiba", "Nem sikerült feltölteni a képet.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const canChangePhone = () => {
    if (!user.phone_changed_at) return true;
    const lastChange = new Date(user.phone_changed_at);
    const now = new Date();
    const diffInDays =
      (now.getTime() - lastChange.getTime()) / (1000 * 3600 * 24);
    return diffInDays >= 30;
  };

  const handleSave = async () => {
    if (!tempUser.name.trim()) {
      showAlert("Hiba", "A név nem lehet üres!");
      return;
    }

    const emailChanged = tempUser.email !== user.email;
    const phoneChanged = tempUser.phone_number !== user.phone_number;

    if (emailChanged && phoneChanged) {
      showAlert(
        "Biztonsági hiba",
        "Az email címet és a telefonszámot nem módosíthatja egy időben!",
      );
      return;
    }

    if (phoneChanged && !canChangePhone()) {
      showAlert(
        "Hiba",
        "A telefonszámot csak 30 naponta egyszer módosíthatja!",
      );
      return;
    }

    setIsSaving(true);
    try {
      const response = await axiosInstance.put(`/users/${user.id}`, {
        name: tempUser.name,
        email: tempUser.email,
        phone_number: tempUser.phone_number,
      });

      const updatedData = { ...user, ...tempUser };
      if (phoneChanged) updatedData.phone_changed_at = new Date().toISOString();

      setUser(updatedData);
      await AsyncStorage.setItem("userData", JSON.stringify(updatedData));
      setEditModal(false);
      showAlert("Siker", "Profil adatok elmentve!");
    } catch (error: any) {
      showAlert(
        "Hiba",
        error.response?.data?.message || "Szerver hiba történt",
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomNavbar title="Beállítások" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.wrapper, isDesktop && styles.row]}>
          <View style={[styles.sidebar, isDesktop && styles.desktopSidebar]}>
            <View style={styles.profileBrief}>
              <TouchableOpacity
                onPress={pickImage}
                style={styles.avatarWrapper}
              >
                {user.avatar_url ? (
                  <Image
                    source={{ uri: user.avatar_url }}
                    style={styles.largeAvatar}
                  />
                ) : (
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {user.name ? user.name[0].toUpperCase() : "?"}
                    </Text>
                  </View>
                )}
                <View style={styles.cameraIcon}>
                  <AntDesign name="camera" size={14} color="#fff" />
                </View>
              </TouchableOpacity>
              <Text style={styles.sideName}>{user.name}</Text>
              <Text style={styles.sideEmail}>{user.email}</Text>
            </View>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setEditModal(true)}
            >
              <AntDesign name="user" size={20} color="#007AFF" />
              <Text style={styles.menuItemText}>Adatok szerkesztése</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.menuItem, styles.logoutItem]}
              onPress={logout}
            >
              <AntDesign name="logout" size={20} color="#ff3b30" />
              <Text style={[styles.menuItemText, { color: "#ff3b30" }]}>
                Kijelentkezés
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.mainContent, isDesktop && styles.desktopMain]}>
            <View style={styles.warningBox}>
              <AntDesign name="info-circle" size={18} color="#856404" />
              <View style={{ flex: 1 }}>
                <Text style={styles.warningTitle}>Biztonsági irányelvek</Text>
                <Text style={styles.warningText}>
                  • Az email és a telefonszám nem módosítható egyszerre.{"\n"}•
                  A telefonszám frissítése után 30 nap várakozás szükséges az
                  újabb módosításhoz.
                </Text>
              </View>
            </View>

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
                <Text style={styles.value}>
                  {user.phone_number || "Nincs megadva"}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal visible={editModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profil szerkesztése</Text>

            <Text style={styles.inputLabel}>Név</Text>
            <TextInput
              style={styles.input}
              value={tempUser.name}
              onChangeText={(t) => setTempUser({ ...tempUser, name: t })}
            />

            <Text style={styles.inputLabel}>Email cím</Text>
            <TextInput
              style={styles.input}
              value={tempUser.email}
              onChangeText={(t) => setTempUser({ ...tempUser, email: t })}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.inputLabel}>Telefonszám</Text>
            <TextInput
              style={styles.input}
              value={tempUser.phone_number}
              onChangeText={(t) =>
                setTempUser({ ...tempUser, phone_number: t })
              }
              keyboardType="phone-pad"
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
                style={styles.saveBtn}
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
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  wrapper: { width: "100%", maxWidth: 1100, gap: 20 },
  row: { flexDirection: "row", alignItems: "flex-start" },
  sidebar: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    elevation: 2,
  },
  desktopSidebar: { width: 300 },
  profileBrief: {
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 20,
  },
  avatarWrapper: { position: "relative", marginBottom: 10 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  largeAvatar: { width: 80, height: 80, borderRadius: 40 },
  avatarText: { color: "#fff", fontSize: 32, fontWeight: "bold" },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#007AFF",
    padding: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },
  sideName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  sideEmail: { fontSize: 13, color: "#777" },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 10,
  },
  menuItemText: { fontSize: 16, fontWeight: "500", color: "#444" },
  logoutItem: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  mainContent: { flex: 1, width: "100%" },
  desktopMain: { paddingLeft: 10 },
  warningBox: {
    backgroundColor: "#fff3cd",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ffeeba",
  },
  warningTitle: {
    fontWeight: "700",
    color: "#856404",
    fontSize: 15,
    marginBottom: 4,
  },
  warningText: { color: "#856404", fontSize: 13, lineHeight: 18 },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    elevation: 2,
  },
  infoField: { paddingVertical: 10 },
  label: { fontSize: 13, color: "#888", marginBottom: 3 },
  value: { fontSize: 16, color: "#333", fontWeight: "500" },
  separator: { height: 1, backgroundColor: "#eee" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "90%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 25,
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  inputLabel: { fontSize: 14, color: "#666", marginBottom: 5, marginTop: 10 },
  input: {
    backgroundColor: "#f0f0f5",
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  modalButtons: { flexDirection: "row", gap: 10, marginTop: 30 },
  cancelBtn: { flex: 1, padding: 15, alignItems: "center" },
  saveBtn: {
    flex: 2,
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelText: { color: "#666", fontWeight: "600" },
  saveText: { color: "#fff", fontWeight: "bold" },
});
