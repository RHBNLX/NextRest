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
  Image,
} from "react-native";
import { AntDesign, Feather, FontAwesome5 } from "@expo/vector-icons";
import { usePageTitle, useProtectedRoute } from "../../hooks";
import CustomNavbar from "../components/navbar";
import axiosInstance from "../../api/axiosInstance";

interface Order {
  id: number;
  pickup_address: string;
  dropoff_address: string;
  status: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  avatar_url?: string;
}

interface Courier {
  id: number;
  user_id: number;
  user?: User;
  license_plate: string;
  vehicle_type: string;
  status: "active" | "offline" | "busy";
  active_orders_list?: Order[];
}

export default function MgmtCouriers() {
  usePageTitle("Futárok");
  useProtectedRoute(["admin"]);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const numColumns = isMobile ? 1 : width > 1200 ? 3 : 2;

  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState<Courier | null>(null);

  useEffect(() => {
    fetchCouriers();
  }, []);

  const fetchCouriers = async () => {
    try {
      const response = await axiosInstance.get("/couriers");
      setCouriers(response.data);
    } catch (error) {
      console.error(error);
      Alert.alert("Hiba", "Nem sikerült lekérni a futárok adatait.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#34C759";
      case "busy":
        return "#FF9500";
      case "offline":
        return "#8E8E93";
      default:
        return "#8E8E93";
    }
  };

  const filteredCouriers = couriers.filter((c) => {
    const courierName = (c.user?.name || "").toLowerCase();
    const plate = (c.license_plate || "").toLowerCase();
    const query = search.toLowerCase();

    const matchesSearch = courierName.includes(query) || plate.includes(query);
    const matchesStatus = filterStatus === "all" || c.status === filterStatus;

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
      <CustomNavbar title="Futárok kezelése" />

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
            placeholder="Keresés név vagy rendszám alapján..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          {["all", "active", "busy", "offline"].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterChip,
                filterStatus === status && styles.filterChipActive,
              ]}
              onPress={() => setFilterStatus(status)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterStatus === status && styles.filterChipTextActive,
                ]}
              >
                {status === "all" ? "Összes" : status.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {filteredCouriers.map((courier) => {
            const name = courier.user?.name || "Ismeretlen";
            const email = courier.user?.email || "Nincs email";
            const avatar = courier.user?.avatar_url;

            return (
              <TouchableOpacity
                key={courier.id}
                style={[
                  styles.userCard,
                  { width: isMobile ? "100%" : `${100 / numColumns - 2}%` },
                ]}
                onPress={() => {
                  setSelectedCourier(courier);
                  setModalVisible(true);
                }}
              >
                <View style={styles.cardHeader}>
                  {avatar ? (
                    <Image source={{ uri: avatar }} style={styles.avatarImg} />
                  ) : (
                    <View
                      style={[
                        styles.avatarPlaceholder,
                        { backgroundColor: getStatusColor(courier.status) },
                      ]}
                    >
                      <Text style={styles.avatarText}>
                        {name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}

                  <View style={styles.headerText}>
                    <Text style={styles.userName} numberOfLines={1}>
                      {name}
                    </Text>
                    <Text style={styles.userEmail} numberOfLines={1}>
                      {courier.license_plate}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} color="#C7C7CC" />
                </View>

                <View style={styles.cardStats}>
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{courier.vehicle_type}</Text>
                    <Text style={styles.statLabel}>Jármű</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text
                      style={[
                        styles.statValue,
                        {
                          color:
                            (courier.active_orders_list?.length || 0) > 0
                              ? "#FF9500"
                              : "#1C1C1E",
                        },
                      ]}
                    >
                      {courier.active_orders_list?.length || 0} db
                    </Text>
                    <Text style={styles.statLabel}>Aktív fuvar</Text>
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
              <Text style={styles.modalTitle}>Futár adatlap</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {selectedCourier && (
              <ScrollView style={styles.modalBody}>
                <Text style={styles.sectionLabel}>Személyes adatok</Text>
                <View style={styles.detailBox}>
                  <Text style={styles.detailName}>
                    {selectedCourier.user?.name}
                  </Text>
                  <Text style={styles.detailEmail}>
                    {selectedCourier.user?.email}
                  </Text>
                </View>

                <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
                  Jármű és Státusz
                </Text>
                <View style={styles.detailRow}>
                  <View style={styles.infoPill}>
                    <FontAwesome5 name="car" size={12} color="#8E8E93" />
                    <Text style={styles.pillText}>
                      {selectedCourier.license_plate}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.infoPill,
                      {
                        backgroundColor:
                          getStatusColor(selectedCourier.status) + "20",
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        {
                          backgroundColor: getStatusColor(
                            selectedCourier.status,
                          ),
                        },
                      ]}
                    />
                    <Text
                      style={[
                        styles.pillText,
                        { color: getStatusColor(selectedCourier.status) },
                      ]}
                    >
                      {selectedCourier.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.sectionLabel, { marginTop: 20 }]}>
                  Aktív rendelések listája
                </Text>
                {selectedCourier.active_orders_list &&
                selectedCourier.active_orders_list.length > 0 ? (
                  selectedCourier.active_orders_list.map((order) => (
                    <View key={order.id} style={styles.orderItem}>
                      <Text style={styles.orderId}>#{order.id}</Text>
                      <Text style={styles.orderAddr} numberOfLines={1}>
                        {order.dropoff_address}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noOrders}>
                    Nincs folyamatban lévő kiszállítása.
                  </Text>
                )}
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

  userCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  avatarPlaceholder: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarImg: { width: 45, height: 45, borderRadius: 22.5, marginRight: 12 },
  avatarText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  headerText: { flex: 1 },
  userName: { fontSize: 16, fontWeight: "bold", color: "#1C1C1E" },
  userEmail: { fontSize: 13, color: "#8E8E93" },
  cardStats: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    paddingTop: 12,
  },
  statItem: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 12, fontWeight: "bold", color: "#1C1C1E" },
  statLabel: { fontSize: 10, color: "#8E8E93", marginTop: 2 },
  statDivider: { width: 1, height: "100%", backgroundColor: "#F2F2F7" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "90%",
    maxWidth: 450,
    borderRadius: 24,
    maxHeight: "80%",
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
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#8E8E93",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  detailBox: { backgroundColor: "#F2F2F7", padding: 12, borderRadius: 12 },
  detailName: { fontSize: 16, fontWeight: "bold", color: "#1C1C1E" },
  detailEmail: { fontSize: 14, color: "#48484A" },
  detailRow: { flexDirection: "row", gap: 10 },
  infoPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  pillText: { fontSize: 12, fontWeight: "700", color: "#48484A" },
  statusDot: { width: 6, height: 6, borderRadius: 3 },

  orderItem: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center",
  },
  orderId: { fontWeight: "800", color: "#007AFF", marginRight: 10 },
  orderAddr: { flex: 1, fontSize: 13, color: "#48484A" },
  noOrders: {
    textAlign: "center",
    color: "#8E8E93",
    fontSize: 13,
    marginTop: 10,
    fontStyle: "italic",
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
