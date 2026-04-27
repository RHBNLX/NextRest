import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { usePageTitle, useProtectedRoute } from "../../hooks";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function OrderDetails() {
  usePageTitle("Rendelés Részletei");
  useProtectedRoute(["courier"]);
  const router = useRouter();
  const { user } = useAuth();
  const { orderId } = useLocalSearchParams();
  
  const [order, setOrder] = useState<any>(null);
  const [isCourierActive, setIsCourierActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [orderRes, courierRes] = await Promise.all([
        axiosInstance.get(`/orders`),
        axiosInstance.get(`/couriers`)
      ]);

      const foundOrder = orderRes.data.find((o: any) => o.id === Number(orderId));
      setOrder(foundOrder);

      const myProfile = courierRes.data.find((c: any) => c.user_id === user?.id);
      setIsCourierActive(myProfile?.status === "active");

    } catch (e) {
      Alert.alert("Hiba", "Adatok lekérése sikertelen.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    if (!isCourierActive) {
      Alert.alert("Figyelem", "Csak 'Online' állapotban vehetsz fel vagy kézbesíthetsz csomagot!");
      return;
    }

    let nextStatus = "";
    if (order.status === "assigned") nextStatus = "picked_up";
    else if (order.status === "picked_up") nextStatus = "delivered";
    else return;

    try {
      await axiosInstance.put(`/orders/${orderId}`, { status: nextStatus });
      Alert.alert("Siker", "Státusz frissítve!");
      router.back();
    } catch (e) {
      Alert.alert("Hiba", "Nem sikerült a frissítés.");
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />;
  if (!order) return <View style={styles.container}><Text>Rendelés nem található.</Text></View>;


  const getButtonColor = () => {
    if (!isCourierActive) return "#C7C7CC"; 
    return order.status === "assigned" ? "#007AFF" : "#34C759";
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rendelés #{order.id}</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.label}>AKTUÁLIS STÁTUSZ</Text>
          <View style={[styles.statusBadge, { backgroundColor: getButtonColor() + "20" }]}>
            <Text style={[styles.statusText, { color: getButtonColor() }]}>
              {order.status === "assigned" ? "Kiosztva - Felvételre vár" : "Nálad van - Kézbesítés alatt"}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.label}>FELVÉTELI CÍM</Text>
          <Text style={styles.addressText}>{order.pickup_address}</Text>
          
          <View style={styles.divider} />
          
          <Text style={styles.label}>KÉZBESÍTÉSI CÍM</Text>
          <Text style={styles.addressText}>{order.dropoff_address}</Text>
        </View>

        {!isCourierActive && (
          <View style={styles.warningBox}>
            <MaterialIcons name="cloud-off" size={20} color="#FF9500" />
            <Text style={styles.warningText}>
              A funkció használatához állítsd magad online állapotba!
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.mainBtn, { backgroundColor: getButtonColor() }]}
          onPress={updateStatus}
          disabled={!isCourierActive}
        >
          <FontAwesome5 
            name={order.status === "assigned" ? "box" : "check-circle"} 
            size={18} 
            color="#fff" 
            style={{ marginRight: 10 }} 
          />
          <Text style={styles.btnText}>
            {order.status === "assigned" ? "CSOMAG FELVÉTELE" : "KÉZBESÍTÉS BEFEJEZÉSE"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 20, 
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA"
  },
  backBtn: {
    padding: 8,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 15, color: "#1C1C1E" },
  content: { padding: 20 },
  infoCard: { backgroundColor: "#fff", borderRadius: 20, padding: 20, marginBottom: 20 },
  label: { fontSize: 11, color: "#8E8E93", fontWeight: "bold", marginBottom: 8 },
  statusBadge: { padding: 8, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 5 },
  statusText: { fontSize: 13, fontWeight: "700" },
  addressText: { fontSize: 16, color: "#1C1C1E", fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#F2F2F7", marginVertical: 15 },
  mainBtn: { 
    height: 65, 
    borderRadius: 18, 
    flexDirection: "row",
    justifyContent: "center", 
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3
  },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  warningBox: { 
    flexDirection: "row", 
    backgroundColor: "#FFF9E6", 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 20, 
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: "#FFD60A"
  },
  warningText: { color: "#8A6600", fontSize: 13, flex: 1, fontWeight: "500" }
});