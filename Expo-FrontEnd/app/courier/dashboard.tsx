import React, { useState, useEffect } from "react";
import { Platform } from "react-native"; 

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { usePageTitle, useProtectedRoute } from "../../hooks";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function CourierDashboard() {
  usePageTitle("Futár Vezérlőpult");
  useProtectedRoute(["courier"]);
  const router = useRouter();
  const { user, logout } = useAuth();

  const [orders, setOrders] = useState([]);
  const [courierProfile, setCourierProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isActive, setIsActive] = useState(false);
  const [vehicle, setVehicle] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [ordersRes, couriersRes] = await Promise.all([
        axiosInstance.get("/orders"),
        axiosInstance.get("/couriers"),
      ]);

      const filteredOrders = ordersRes.data
        .filter((o: any) => o.status === "assigned" || o.status === "picked_up")
        .sort((a: any, b: any) => (a.status === "picked_up" ? -1 : 1));

      setOrders(filteredOrders);

      const myProfile = couriersRes.data.find((c: any) => c.user_id === user?.id);
      if (myProfile) {
        setCourierProfile(myProfile);
        setIsActive(myProfile.status === "active");
        setVehicle(myProfile.vehicle_type);
      }
    } catch (e) {
      console.error("Dashboard betöltési hiba:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutPress = async () => {
  const logoutLogic = async () => {
    try {
      await logout();
      if (Platform.OS === 'web') {
        window.location.href = '/auth/login';
      }
    } catch (err) {
      console.error("Logout hiba:", err);
    }
  };

  if (Platform.OS === 'web') {
    if (window.confirm("Biztosan ki szeretnél jelentkezni?")) {
      await logoutLogic();
    }
  } else {
    Alert.alert(
      "Kijelentkezés",
      "Biztosan ki szeretnél jelentkezni?",
      [
        { text: "Mégse", style: "cancel" },
        { text: "Kijelentkezés", style: "destructive", onPress: logoutLogic }
      ]
    );
  }
};

  const syncCourierData = async (data: object) => {
    if (!courierProfile?.id) return;
    try {
      await axiosInstance.put(`/couriers/${courierProfile.id}`, data);
    } catch (e) {
      Alert.alert("Hiba", "Nem sikerült menteni a változtatásokat.");
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Üdvözlünk,</Text>
          <Text style={styles.userName}>{user?.name || "Futár"}</Text>
        </View>
        <TouchableOpacity 
          style={styles.logoutCircle} 
          onPress={handleLogoutPress}
          activeOpacity={0.6}
        >
          <Ionicons name="power" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <View style={styles.settingsCard}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <View style={[styles.statusDot, { backgroundColor: isActive ? "#34C759" : "#8E8E93" }]} />
            <Text style={styles.settingLabel}>{isActive ? "Online" : "Offline"}</Text>
          </View>
          <Switch
            value={isActive}
            onValueChange={(val) => {
              setIsActive(val);
              syncCourierData({ status: val ? "active" : "offline" });
            }}
            trackColor={{ false: "#D1D1D6", true: "#34C759" }}
          />
        </View>

        <View style={styles.divider} />

        <Text style={styles.subLabel}>VÁLASZTOTT JÁRMŰ</Text>
        <View style={styles.vehicleRow}>
          {[
            { id: "bike", icon: "bicycle" },
            { id: "scooter", icon: "moped" },
            { id: "car", icon: "car" },
            { id: "van", icon: "truck" },
          ].map((v) => (
            <TouchableOpacity
              key={v.id}
              style={[styles.vehicleBtn, vehicle === v.id && styles.activeVehicle]}
              onPress={() => {
                setVehicle(v.id);
                syncCourierData({ vehicle_type: v.id });
              }}
            >
              <MaterialCommunityIcons
                name={v.icon as any}
                size={22}
                color={vehicle === v.id ? "#fff" : "#8E8E93"}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Aktuális feladatok</Text>
        <View style={styles.countBadge}><Text style={styles.countText}>{orders.length}</Text></View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        {orders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="clipboard-check-outline" size={48} color="#D1D1D6" />
            <Text style={styles.emptyText}>Jelenleg nincs kiosztott munkád.</Text>
          </View>
        ) : (
          orders.map((order: any) => {
            const isPickedUp = order.status === "picked_up";
            return (
              <TouchableOpacity
                key={order.id}
                style={[styles.card, isPickedUp && styles.activeCard]}
                onPress={() => router.push({ pathname: "/courier/orderDetails", params: { orderId: order.id } })}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.orderId, isPickedUp && { color: "#fff" }]}>#{order.id}</Text>
                  <View style={[styles.badge, { backgroundColor: isPickedUp ? "rgba(255,255,255,0.2)" : "#E5F1FF" }]}>
                    <Text style={[styles.badgeText, { color: isPickedUp ? "#fff" : "#007AFF" }]}>
                      {isPickedUp ? "NÁLAD VAN" : "KIOSZTVA"}
                    </Text>
                  </View>
                </View>
                <View style={styles.addressRow}>
                  <FontAwesome5 name="map-marker-alt" size={14} color={isPickedUp ? "#fff" : "#8E8E93"} />
                  <Text style={[styles.address, isPickedUp && { color: "#fff" }]} numberOfLines={1}>
                    {isPickedUp ? order.dropoff_address : order.pickup_address}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB", padding: 20, paddingTop: 60 },
  topHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 25 },
  welcomeContainer: { flex: 1 },
  welcomeText: { fontSize: 14, color: "#8E8E93" },
  userName: { fontSize: 22, fontWeight: "bold", color: "#1C1C1E" },
  logoutCircle: { width: 45, height: 45, borderRadius: 23, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5 },
  settingsCard: { backgroundColor: "#fff", borderRadius: 24, padding: 20, marginBottom: 25, elevation: 4, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10 },
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  settingInfo: { flexDirection: "row", alignItems: "center", gap: 10 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  settingLabel: { fontSize: 18, fontWeight: "600", color: "#1C1C1E" },
  divider: { height: 1, backgroundColor: "#F2F2F7", marginVertical: 18 },
  subLabel: { fontSize: 11, color: "#8E8E93", fontWeight: "800", marginBottom: 12, letterSpacing: 0.5 },
  vehicleRow: { flexDirection: "row", gap: 12 },
  vehicleBtn: { flex: 1, height: 50, backgroundColor: "#F2F2F7", borderRadius: 14, justifyContent: "center", alignItems: "center" },
  activeVehicle: { backgroundColor: "#007AFF" },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1C1C1E" },
  countBadge: { backgroundColor: "#E5E5EA", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  countText: { fontSize: 12, fontWeight: "bold", color: "#8E8E93" },
  list: { gap: 12, paddingBottom: 30 },
  card: { backgroundColor: "#fff", borderRadius: 20, padding: 18, elevation: 2, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 5 },
  activeCard: { backgroundColor: "#34C759" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  orderId: { fontWeight: "bold", fontSize: 17, color: "#1C1C1E" },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: "bold" },
  addressRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  address: { color: "#3A3A3C", fontSize: 15, flex: 1 },
  emptyContainer: { alignItems: "center", marginTop: 40, gap: 10 },
  emptyText: { color: "#8E8E93", fontSize: 16 },
});