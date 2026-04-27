import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { usePageTitle, useProtectedRoute } from "../../hooks";
import axiosInstance from "../../api/axiosInstance";

import CustomNavbar from "../components/navbar";
import CustomFooter from "../components/footer";

const AddressField = ({
  title,
  prefix,
  formData,
  setFormData,
}: {
  title: string;
  prefix: "p" | "d";
  formData: any;
  setFormData: any;
}) => (
  <View style={styles.addressBlock}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.row}>
      <TextInput
        style={[styles.input, { flex: 1, marginRight: 8 }]}
        placeholder="IRSZ *"
        keyboardType="numeric"
        maxLength={4}
        value={formData[`${prefix}_zip`]}
        onChangeText={(t) =>
          setFormData({
            ...formData,
            [`${prefix}_zip`]: t.replace(/[^0-9]/g, ""),
          })
        }
      />
      <TextInput
        style={[styles.input, { flex: 2 }]}
        placeholder="Város *"
        value={formData[`${prefix}_city`]}
        onChangeText={(t) =>
          setFormData({ ...formData, [`${prefix}_city`]: t })
        }
      />
    </View>
    <TextInput
      style={[styles.input, { marginTop: 8 }]}
      placeholder="Utca, házszám, emelet/ajtó *"
      value={formData[`${prefix}_address`]}
      onChangeText={(t) =>
        setFormData({ ...formData, [`${prefix}_address`]: t })
      }
    />
  </View>
);

const showAlert = (
  title: string,
  message: string,
  options?: { text: string; onPress?: () => void }[],
) => {
  if (Platform.OS === "web") {
    window.alert(`${title}\n${message}`);
    if (options?.[0]?.onPress) options[0].onPress();
  } else {
    Alert.alert(title, message, options);
  }
};

export default function SendParcelScreen() {
  usePageTitle("Csomagküldés");
  useProtectedRoute(["customer"]);
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const sizeMapping: {
    [key: string]: { apiValue: string; price: number; courierId: number };
  } = {
    S: { apiValue: "small", price: 990, courierId: 1 },
    M: { apiValue: "medium", price: 1490, courierId: 2 },
    L: { apiValue: "large", price: 2190, courierId: 3 },
  };

  const [formData, setFormData] = useState({
    user_id: "",
    courier_id: sizeMapping["S"].courierId,
    p_zip: "",
    p_city: "",
    p_address: "",
    d_zip: "",
    d_city: "",
    d_address: "",
    package_size: "S",
    price: sizeMapping["S"].price,
    status: "pending",
    receiver_name: "",
    receiver_phone: "",
    description: "",
  });

  useEffect(() => {
    if (user) setFormData((prev) => ({ ...prev, user_id: user.id.toString() }));
  }, [user]);

  const validate = () => {
    const {
      p_zip,
      p_city,
      p_address,
      d_zip,
      d_city,
      d_address,
      receiver_name,
      receiver_phone,
    } = formData;

    if (
      !p_zip.trim() ||
      !p_city.trim() ||
      !p_address.trim() ||
      !d_zip.trim() ||
      !d_city.trim() ||
      !d_address.trim() ||
      !receiver_name.trim() ||
      !receiver_phone.trim()
    ) {
      showAlert(
        "Hiba",
        "Minden csillaggal (*) jelölt mezőt kötelező kitölteni!",
      );
      return false;
    }

    if (p_zip.length !== 4 || d_zip.length !== 4) {
      showAlert("Hiba", "Az irányítószámnak 4 számjegyből kell állnia!");
      return false;
    }

    const cleanedPhone = receiver_phone.replace(/[\s\-\(\)]/g, "");

    const phoneRegex = /^(\+36|06|36)?(20|30|31|70|1|[2-9][0-9])\d{6,7}$/;

    if (!phoneRegex.test(cleanedPhone)) {
      showAlert(
        "Hiba",
        "Érvénytelen telefonszám! Kérlek valódi magyar telefonszámot adj meg (pl. +36301234567).",
      );
      return false;
    }

    if (p_address.length < 5 || d_address.length < 5) {
      showAlert("Hiba", "Kérlek adj meg pontosabb címet (utca, házszám)!");
      return false;
    }

    return true;
  };

  const handleFinalSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    const fullPickup = `${formData.p_zip} ${formData.p_city}, ${formData.p_address}`;
    const fullDropoff = `${formData.d_zip} ${formData.d_city}, ${formData.d_address}`;

    try {
      const notesParts = [
        `Címzett: ${formData.receiver_name}`,
        `Tel: ${formData.receiver_phone}`,
        formData.description ? `Megj: ${formData.description}` : null,
      ].filter(Boolean);

      const payload = {
        user_id: Number(formData.user_id),
        courier_id: formData.courier_id,
        pickup_address: fullPickup,
        dropoff_address: fullDropoff,
        package_size: sizeMapping[formData.package_size].apiValue,
        price: formData.price,
        status: formData.status,
        notes: notesParts.join(" | "),
      };

      await axiosInstance.post("/orders", payload);
      showAlert("Siker", "Csomagküldés rögzítve!", [
        { text: "Dashboard", onPress: () => router.push("/user/dashboard") },
      ]);
    } catch (error: any) {
      showAlert(
        "Hiba",
        error.response?.data?.message || "Hiba történt a mentés során.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <CustomNavbar title="Csomagküldés" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <AddressField
            title="Felvételi adatok"
            prefix="p"
            formData={formData}
            setFormData={setFormData}
          />

          <View style={styles.divider} />

          <AddressField
            title="Kézbesítési adatok"
            prefix="d"
            formData={formData}
            setFormData={setFormData}
          />

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Címzett & Csomag</Text>

          <Text style={styles.label}>Címzett neve *</Text>
          <TextInput
            style={styles.input}
            placeholder="Kovács János"
            value={formData.receiver_name}
            onChangeText={(t) => setFormData({ ...formData, receiver_name: t })}
          />

          <Text style={styles.label}>Címzett telefonja *</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            placeholder="+36 30 123 4567"
            value={formData.receiver_phone}
            onChangeText={(t) =>
              setFormData({ ...formData, receiver_phone: t })
            }
          />

          <Text style={styles.label}>Csomag mérete</Text>
          <View style={styles.sizePicker}>
            {["S", "M", "L"].map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.sizeBtn,
                  formData.package_size === s && styles.sizeBtnActive,
                ]}
                onPress={() =>
                  setFormData({
                    ...formData,
                    package_size: s,
                    price: sizeMapping[s].price,
                    courier_id: sizeMapping[s].courierId,
                  })
                }
              >
                <Text
                  style={[
                    styles.sizeText,
                    formData.package_size === s && styles.sizeTextActive,
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Megjegyzés</Text>
          <TextInput
            style={[styles.input, { height: 60, textAlignVertical: "top" }]}
            multiline
            placeholder="Kapukód, egyéb infó..."
            value={formData.description}
            onChangeText={(t) => setFormData({ ...formData, description: t })}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={() => validate() && setShowConfirmModal(true)}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>
                  Küldés ({formData.price} Ft)
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <AntDesign name="check-circle" size={45} color="#007AFF" />
            <Text style={styles.modalTitle}>Megerősítés</Text>
            <Text style={styles.modalText}>
              Fizetendő:{" "}
              <Text style={{ fontWeight: "bold" }}>{formData.price} Ft</Text>
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={{ color: "#888" }}>Módosít</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirm}
                onPress={handleFinalSubmit}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Rendelés
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <CustomFooter />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#efeff6" },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 500,
    borderRadius: 20,
    padding: 20,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#333",
    marginBottom: 12,
  },
  addressBlock: { marginBottom: 10 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#777",
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#fdfdfd",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
  },
  row: { flexDirection: "row" },
  divider: { height: 1, backgroundColor: "#f0f0f0", marginVertical: 20 },
  sizePicker: { flexDirection: "row", gap: 8 },
  sizeBtn: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  sizeBtnActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  sizeText: { fontWeight: "bold", color: "#666" },
  sizeTextActive: { color: "#fff" },
  buttonContainer: { marginTop: 25 },
  submitBtn: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    width: "85%",
    maxWidth: 400,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 15 },
  modalText: { fontSize: 16, marginBottom: 20 },
  modalButtons: { flexDirection: "row", gap: 10, width: "100%" },
  modalCancel: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  modalConfirm: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
});
