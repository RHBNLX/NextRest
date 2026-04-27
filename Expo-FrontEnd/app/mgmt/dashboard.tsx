import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { usePageTitle, useProtectedRoute } from "../../hooks";
import CustomNavbar from "../components/navbar";
import axiosInstance from "../../api/axiosInstance";

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  pendingOrders: number;
  activeCouriers: number;
  openTickets: number;
  dailyRevenue: number;
  totalRevenue: number;
}

export default function MgmtDashboard() {
  usePageTitle("Admin Vezérlőpult");
  useProtectedRoute(["admin"]);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentTickets, setRecentTickets] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [ordersRes, ticketsRes, usersRes] = await Promise.all([
        axiosInstance.get("/orders"),
        axiosInstance.get("/support_tickets"),
        axiosInstance.get("/users"),
      ]);

      const allOrders = ordersRes.data || [];
      const allTickets = ticketsRes.data || [];
      const allUsers = usersRes.data || [];

      setStats({
        totalUsers: allUsers.length,
        activeUsers: allUsers.filter((u: any) => u.status === "active").length,
        totalOrders: allOrders.length,
        pendingOrders: allOrders.filter((o: any) => o.status === "pending")
          .length,
        activeCouriers: 0,
        openTickets: allTickets.filter((t: any) => t.status === "open").length,
        dailyRevenue: 0,
        totalRevenue: allOrders.reduce(
          (sum: number, o: any) => sum + (o.price || 0),
          0,
        ),
      });

      setRecentOrders(allOrders.slice(0, 5));
      setRecentTickets(allTickets.slice(0, 5));
    } catch (err) {
      console.error("Dashboard hiba:", err);
      Alert.alert("Hiba", "Nem sikerült a dashboard adatok betöltése.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const StatCard = ({ title, value, icon, color }: any) => (
    <View style={[styles.statCard, { width: isMobile ? "100%" : "23%" }]}>
      <View style={[styles.iconBox, { backgroundColor: color + "15" }]}>
        <AntDesign name={icon} size={24} color={color} />
      </View>
      <View>
        <Text style={styles.statLabel}>{title}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomNavbar title="Admin Vezérlőpult" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Rendszer Áttekintés</Text>

        <View style={styles.statsGrid}>
          <StatCard
            title="Összes Felhasználó"
            value={stats?.totalUsers}
            icon="user"
            color="#007AFF"
          />
          <StatCard
            title="Függő Rendelések"
            value={stats?.pendingOrders}
            icon="shoppingcart"
            color="#FF9500"
          />
          <StatCard
            title="Nyitott Jegyek"
            value={stats?.openTickets}
            icon="customerservice"
            color="#FF3B30"
          />
          <StatCard
            title="Összes Bevétel"
            value={`${stats?.totalRevenue.toLocaleString()} Ft`}
            icon="database"
            color="#34C759"
          />
        </View>

        <View style={isMobile ? styles.column : styles.row}>
          <View
            style={[
              styles.listSection,
              !isMobile && { flex: 1, marginRight: 15 },
            ]}
          >
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Legutóbbi Rendelések</Text>
              <TouchableOpacity onPress={() => router.push("/mgmt/orders")}>
                <Text style={styles.seeMore}>Összes</Text>
              </TouchableOpacity>
            </View>
            {recentOrders.map((order) => (
              <View key={order.id} style={styles.listItem}>
                <View>
                  <Text style={styles.itemMain}>
                    #{order.id} - {order.user?.name || "Vendég"}
                  </Text>
                  <Text style={styles.itemSub}>{order.pickup_address}</Text>
                </View>
                <Text style={styles.itemPrice}>{order.price} Ft</Text>
              </View>
            ))}
          </View>

          <View style={[styles.listSection, !isMobile && { flex: 1 }]}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>Friss Support Jegyek</Text>
              <TouchableOpacity onPress={() => router.push("/mgmt/tickets")}>
                <Text style={styles.seeMore}>Összes</Text>
              </TouchableOpacity>
            </View>
            {recentTickets.map((ticket) => (
              <View key={ticket.id} style={styles.listItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemMain}>{ticket.subject}</Text>
                  <Text style={styles.itemSub}>{ticket.user?.name}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        ticket.status === "open" ? "#FF3B30" : "#8E8E93",
                    },
                  ]}
                >
                  <Text style={styles.statusText}>{ticket.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  loadingCenter: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContainer: { padding: 20 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#1C1C1E",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 15,
  },
  statCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  statLabel: { fontSize: 13, color: "#8E8E93", marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#1C1C1E" },
  row: { flexDirection: "row" },
  column: { flexDirection: "column" },
  listSection: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  listTitle: { fontSize: 17, fontWeight: "bold" },
  seeMore: { color: "#007AFF", fontWeight: "600" },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  itemMain: { fontSize: 14, fontWeight: "600", color: "#1C1C1E" },
  itemSub: { fontSize: 12, color: "#8E8E93", marginTop: 2 },
  itemPrice: { fontWeight: "bold", color: "#1C1C1E" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});
