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
  FlatList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { usePageTitle, useProtectedRoute } from "../../hooks";
import axiosInstance from "../../api/axiosInstance";

import CustomNavbar from "../components/navbar";
import CustomFooter from "../components/footer";

const showAlert = (title: string, message: string) => {
  if (typeof window !== "undefined") {
    window.alert(`${title}\n${message}`);
  }
};

const REASONS = [
  { id: "damaged", label: "Sérült termék", icon: " Faster" },
  { id: "wrong_item", label: "Hibás termék érkezett", icon: "closecircleo" },
  { id: "not_satisfied", label: "Nem felel meg a leírásnak", icon: "dislike2" },
  { id: "other", label: "Egyéb ok", icon: "questioncircleo" },
];

export default function ReturnParcelScreen() {
  usePageTitle("Csomag visszaküldése");
  useProtectedRoute(["customer"]);
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);

  const [showOrderSelect, setShowOrderSelect] = useState(false);
  const [showReasonSelect, setShowReasonSelect] = useState(false);

  const [formData, setFormData] = useState({
    user_id: "",
    order_id: "",
    pickup_address: "",
    dropoff_address: "",
    receiver_name: "",
    receiver_phone: "",
    reason: "damaged",
    reasonLabel: "Sérült termék",
    description: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({ ...prev, user_id: user.id.toString() }));
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await axiosInstance.get(`/orders/user/${user?.id}`);
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Hiba:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const parseNotes = (notes: string) => {
    if (!notes) return { name: "Nincs megadva", phone: "" };
    const nameMatch = notes.match(/Címzett:\s*([^|]+)/);
    const phoneMatch = notes.match(/Tel:\s*(.+)/);
    return {
      name: nameMatch ? nameMatch[1].trim() : "Nincs megadva",
      phone: phoneMatch ? phoneMatch[1].trim() : "",
    };
  };

  const handleSelectOrder = (order: any) => {
    const { name, phone } = parseNotes(order.notes);
    setFormData((prev) => ({
      ...prev,
      order_id: order.id.toString(),
      pickup_address: order.dropoff_address,
      dropoff_address: order.pickup_address,
      receiver_name: name,
      receiver_phone: phone,
    }));
    setShowOrderSelect(false);
  };

  const handleSelectReason = (item: (typeof REASONS)[0]) => {
    setFormData((prev) => ({
      ...prev,
      reason: item.id,
      reasonLabel: item.label,
    }));
    setShowReasonSelect(false);
  };

  const handleFinalSubmit = async () => {
    if (!formData.order_id) return;
    setLoading(true);
    try {
      await axiosInstance.post("/support_tickets", {
        user_id: Number(formData.user_id),
        order_id: Number(formData.order_id),
        subject: "Csomag visszaküldés",
        message: `Visszaküldési igény (#${formData.order_id})\nIndok: ${formData.reasonLabel}\nMegjegyzés: ${formData.description}`,
        status: "open",
      });
      showAlert("Siker", "Visszaküldési igény elküldve!");
      router.push("/user/dashboard");
    } catch (error) {
      showAlert("Hiba", "Nem sikerült a küldés.");
    } finally {
      setLoading(false);
    }
  };

  const selectedOrder = orders.find(
    (o) => o.id.toString() === formData.order_id,
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <CustomNavbar title="Visszaküldés" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.label}>Melyik csomagot küldöd vissza? *</Text>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setShowOrderSelect(true)}
          >
            <Text
              style={[styles.selectText, !selectedOrder && { color: "#999" }]}
              numberOfLines={1}
            >
              {selectedOrder
                ? `${parseNotes(selectedOrder.notes).name} - ${selectedOrder.dropoff_address}`
                : "Válassz ki egy rendelést..."}
            </Text>
            <AntDesign name="down" size={14} color="#666" />
          </TouchableOpacity>

          <Text style={styles.label}>Visszaküldés oka *</Text>
          <TouchableOpacity
            style={styles.selectBox}
            onPress={() => setShowReasonSelect(true)}
          >
            <Text style={styles.selectText}>{formData.reasonLabel}</Text>
            <AntDesign name="down" size={14} color="#666" />
          </TouchableOpacity>

          {selectedOrder && (
            <View style={styles.autoFields}>
              <Text style={styles.infoTitle}>Adatok ellenőrzése:</Text>
              <Text style={styles.infoSub}>
                Címzett:{" "}
                <Text style={{ fontWeight: "700" }}>
                  {formData.receiver_name}
                </Text>
              </Text>
              <Text style={styles.infoSub}>
                Felvétel helye:{" "}
                <Text style={{ fontWeight: "700" }}>
                  {formData.pickup_address}
                </Text>
              </Text>

              <Text style={styles.label}>Megjegyzés (opcionális)</Text>
              <TextInput
                style={styles.textArea}
                multiline
                placeholder="További részletek..."
                value={formData.description}
                onChangeText={(t) =>
                  setFormData({ ...formData, description: t })
                }
              />

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleFinalSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitBtnText}>
                    Visszaküldés beküldése
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={showOrderSelect} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rendeléseid</Text>
              <TouchableOpacity onPress={() => setShowOrderSelect(false)}>
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => handleSelectOrder(item)}
                >
                  <Text style={styles.listItemTitle}>
                    {parseNotes(item.notes).name}
                  </Text>
                  <Text style={styles.listItemSub}>{item.dropoff_address}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      <Modal visible={showReasonSelect} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { height: "auto", paddingBottom: 40 }]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Mi az indok?</Text>
              <TouchableOpacity onPress={() => setShowReasonSelect(false)}>
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {REASONS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.listItem}
                onPress={() => handleSelectReason(item)}
              >
                <AntDesign
                  name={item.icon as any}
                  size={18}
                  color="#007AFF"
                  style={{ marginRight: 15 }}
                />
                <Text style={styles.listItemTitle}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      <CustomFooter />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContent: { padding: 20, alignItems: "center" },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 500,
    borderRadius: 25,
    padding: 20,
    shadowOpacity: 0.1,
    elevation: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#636e72",
    marginBottom: 8,
    marginTop: 15,
    textTransform: "uppercase",
  },
  selectBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f1f2f6",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#dfe6e9",
  },
  selectText: { fontSize: 15, color: "#2d3436" },
  autoFields: {
    marginTop: 25,
    borderTopWidth: 1,
    borderTopColor: "#f1f2f6",
    paddingTop: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  infoSub: { fontSize: 14, color: "#666", marginBottom: 5 },
  textArea: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#dfe6e9",
    borderRadius: 12,
    padding: 15,
    height: 100,
    textAlignVertical: "top",
    marginTop: 5,
  },
  submitBtn: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 25,
  },
  submitBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    height: "60%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold" },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f2f6",
  },
  listItemTitle: { fontSize: 16, fontWeight: "600", color: "#2d3436" },
  listItemSub: { fontSize: 13, color: "#636e72", marginTop: 2 },
});
