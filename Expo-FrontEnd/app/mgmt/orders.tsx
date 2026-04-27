import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  useWindowDimensions,
} from "react-native";
import {
  AntDesign,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { usePageTitle, useProtectedRoute } from "../../hooks";
import CustomNavbar from "../components/navbar";
import axiosInstance from "../../api/axiosInstance";

interface Order {
  id: number;
  user_id: number;
  courier_id: number | null;
  pickup_address: string;
  dropoff_address: string;
  package_size: string;
  price: number;
  status: "pending" | "assigned" | "picked_up" | "delivered" | "cancelled";
  created_at: string;
  user?: { name: string };
  courier?: { user?: { name: string } };
  user_name?: string;
  courier_name?: string;
}

export default function MgmtOrders() {
  usePageTitle("Rendelések");
  useProtectedRoute(["admin"]);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const numColumns = isMobile ? 1 : width > 1200 ? 3 : 2;

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const statusColors: Record<string, string> = {
    pending: "#FFCC00",
    assigned: "#007AFF",
    picked_up: "#5856D6",
    delivered: "#34C759",
    cancelled: "#FF3B30",
  };

  const statusLabels: Record<string, string> = {
    pending: "Várakozik",
    assigned: "Kiosztva",
    picked_up: "Felvéve",
    delivered: "Kézbesítve",
    cancelled: "Törölve",
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get("/orders");
      setOrders(response.data);
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült lekérni a rendeléseket.");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const query = search.toLowerCase();
    const senderName = (o.user?.name || o.user_name || "").toLowerCase();
    const matchesSearch =
      o.id.toString().includes(query) ||
      o.pickup_address.toLowerCase().includes(query) ||
      o.dropoff_address.toLowerCase().includes(query) ||
      senderName.includes(query);

    const matchesStatus = filterStatus === "all" || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomNavbar title="Rendelések kezelése" />

      <View style={styles.toolbar}>
        <View style={styles.searchWrapper}>
          <AntDesign
            name="search"
            size={18}
            color="#8E8E93"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Keresés (cím, küldő, ID)..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterStatus === "all" && styles.filterChipActive,
            ]}
            onPress={() => setFilterStatus("all")}
          >
            <Text
              style={[
                styles.filterChipText,
                filterStatus === "all" && styles.filterChipTextActive,
              ]}
            >
              Összes
            </Text>
          </TouchableOpacity>

          {["pending", "assigned", "picked_up", "delivered", "cancelled"].map(
            (s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.filterChip,
                  filterStatus === s && styles.filterChipActive,
                ]}
                onPress={() => setFilterStatus(s)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    filterStatus === s && styles.filterChipTextActive,
                  ]}
                >
                  {statusLabels[s]}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {filteredOrders.map((order) => {
            const senderName =
              order.user?.name || order.user_name || "Ismeretlen";
            const courierName =
              order.courier?.user?.name ||
              order.courier_name ||
              "Nincs kiosztva";

            return (
              <TouchableOpacity
                key={order.id}
                style={[
                  styles.card,
                  { width: isMobile ? "100%" : `${100 / numColumns - 2}%` },
                ]}
                onPress={() => {
                  setSelectedOrder(order);
                  setModalVisible(true);
                }}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.idBadge}>
                    <Text style={styles.idText}>#{order.id}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: statusColors[order.status] + "20" },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: statusColors[order.status] },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: statusColors[order.status] },
                      ]}
                    >
                      {statusLabels[order.status]}
                    </Text>
                  </View>
                </View>

                <View style={styles.routeContainer}>
                  <View style={styles.routeStep}>
                    <View
                      style={[styles.routeDot, { backgroundColor: "#8E8E93" }]}
                    />
                    <View style={styles.routeTextContainer}>
                      <Text style={styles.routeLabel}>KÜLDŐ</Text>
                      <Text style={styles.routeAddress} numberOfLines={1}>
                        {order.pickup_address}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.routeConnector} />

                  <View style={styles.routeStep}>
                    <FontAwesome5
                      name="map-marker-alt"
                      size={12}
                      color="#FF3B30"
                      style={styles.markerIcon}
                    />
                    <View style={styles.routeTextContainer}>
                      <Text style={styles.routeLabel}>CÍMZETT</Text>
                      <Text style={styles.routeAddress} numberOfLines={1}>
                        {order.dropoff_address}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.footerItem}>
                    <Text style={styles.footerLabel}>Küldő neve</Text>
                    <Text style={styles.footerValue} numberOfLines={1}>
                      {senderName}
                    </Text>
                  </View>
                  <View style={styles.footerDivider} />
                  <View style={styles.footerItem}>
                    <Text style={styles.footerLabel}>Díj</Text>
                    <Text style={[styles.footerValue, { color: "#007AFF" }]}>
                      {order.price} Ft
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rendelés részletei</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {selectedOrder && (
              <ScrollView style={styles.modalBody}>
                <Text style={styles.sectionTitle}>Szállítási információk</Text>
                <View style={styles.detailCard}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Küldő (Honnan):</Text>
                    <Text style={styles.detailValue}>
                      {selectedOrder.pickup_address}
                    </Text>
                  </View>
                  <View style={[styles.detailRow, { marginTop: 12 }]}>
                    <Text style={styles.detailLabel}>Címzett (Hova):</Text>
                    <Text style={styles.detailValue}>
                      {selectedOrder.dropoff_address}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                  Szereplők és Csomag
                </Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoBox}>
                    <Text style={styles.detailLabel}>Küldő neve</Text>
                    <Text style={styles.detailValue}>
                      {selectedOrder.user?.name ||
                        selectedOrder.user_name ||
                        "N/A"}
                    </Text>
                  </View>
                  <View style={styles.infoBox}>
                    <Text style={styles.detailLabel}>Csomag mérete</Text>
                    <Text style={styles.detailValue}>
                      {selectedOrder.package_size}
                    </Text>
                  </View>
                </View>

                <View
                  style={[styles.infoBox, { marginTop: 10, width: "100%" }]}
                >
                  <Text style={styles.detailLabel}>Hozzárendelt Futár</Text>
                  <Text style={styles.detailValue}>
                    {selectedOrder.courier?.user?.name ||
                      selectedOrder.courier_name ||
                      "Még nincs futár kijelölve"}
                  </Text>
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeBtnText}>Bezárás</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  toolbar: {
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 40, fontSize: 16 },
  filterRow: { flexDirection: "row" },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    marginRight: 8,
  },
  filterChipActive: { backgroundColor: "#007AFF" },
  filterChipText: { color: "#8E8E93", fontWeight: "600", fontSize: 12 },
  filterChipTextActive: { color: "#fff" },

  scrollContent: { padding: 15 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  idBadge: {
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  idText: { fontWeight: "bold", color: "#1C1C1E", fontSize: 13 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  statusText: { fontSize: 10, fontWeight: "800", textTransform: "uppercase" },

  routeContainer: { marginBottom: 15, paddingLeft: 4 },
  routeStep: { flexDirection: "row", alignItems: "center" },
  routeDot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 },
  markerIcon: { marginRight: 10, marginLeft: -2 },
  routeConnector: {
    width: 1,
    height: 12,
    backgroundColor: "#E5E5EA",
    marginLeft: 3.5,
    marginVertical: 2,
  },
  routeTextContainer: { flex: 1 },
  routeLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: "#8E8E93",
    marginBottom: 2,
  },
  routeAddress: { fontSize: 14, color: "#1C1C1E", fontWeight: "500" },

  cardFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    paddingTop: 12,
  },
  footerItem: { flex: 1 },
  footerLabel: {
    fontSize: 10,
    color: "#8E8E93",
    textTransform: "uppercase",
    fontWeight: "600",
  },
  footerValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1C1C1E",
    marginTop: 2,
  },
  footerDivider: {
    width: 1,
    height: "100%",
    backgroundColor: "#F2F2F7",
    marginHorizontal: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "90%",
    maxWidth: 500,
    borderRadius: 24,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  modalTitle: { fontSize: 18, fontWeight: "bold" },
  modalBody: { padding: 20 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8E8E93",
    textTransform: "uppercase",
    marginBottom: 10,
  },
  detailCard: { backgroundColor: "#F2F2F7", borderRadius: 12, padding: 16 },
  detailRow: {},
  detailLabel: { fontSize: 12, color: "#8E8E93", marginBottom: 2 },
  detailValue: { fontSize: 15, fontWeight: "600", color: "#1C1C1E" },
  infoGrid: { flexDirection: "row", gap: 10 },
  infoBox: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 12,
  },
  modalFooter: { padding: 20, borderTopWidth: 1, borderTopColor: "#F2F2F7" },
  closeBtn: {
    backgroundColor: "#007AFF",
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
