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
import { AntDesign, Feather } from "@expo/vector-icons";
import { usePageTitle, useProtectedRoute } from "../../hooks";
import CustomNavbar from "../components/navbar";
import axiosInstance from "../../api/axiosInstance";

interface User {
  id: number;
  name: string;
  email: string;
  phone_number?: string;
  role: "admin" | "customer" | "courier";
  avatar_url?: string;
  created_at: string;
}

export default function MgmtUsers() {
  usePageTitle("Felhasználók");
  useProtectedRoute(["admin"]);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const numColumns = isMobile ? 1 : width > 1200 ? 3 : 2;

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/users");
      setUsers(response.data);
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült lekérni a felhasználókat.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    try {
      await axiosInstance.put(`/users/${selectedUser.id}`, {
        role: selectedUser.role,
        name: selectedUser.name,
      });
      setUsers(users.map((u) => (u.id === selectedUser.id ? selectedUser : u)));
      setModalVisible(false);
      Alert.alert("Siker", "Adatok frissítve.");
    } catch (error) {
      Alert.alert("Hiba", "Frissítés sikertelen.");
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
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
      <CustomNavbar title="Felhasználók kezelése" />

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
            placeholder="Keresés..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.roleFilters}
        >
          {["all", "admin", "customer", "courier"].map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.roleChip,
                filterRole === role && styles.roleChipActive,
              ]}
              onPress={() => setFilterRole(role)}
            >
              <Text
                style={[
                  styles.roleChipText,
                  filterRole === role && styles.roleChipTextActive,
                ]}
              >
                {role === "all" ? "Összes" : role.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {filteredUsers.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={[
                styles.userCard,
                { width: isMobile ? "100%" : `${100 / numColumns - 2}%` },
              ]}
              onPress={() => {
                setSelectedUser(user);
                setModalVisible(true);
              }}
            >
              <View style={styles.cardHeader}>
                {user.avatar_url ? (
                  <Image
                    source={{ uri: user.avatar_url }}
                    style={styles.avatarImg}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                  </View>
                )}

                <View style={styles.headerText}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {user.name}
                  </Text>
                  <Text style={styles.userEmail} numberOfLines={1}>
                    {user.email}
                  </Text>
                </View>
                <Feather name="edit-2" size={16} color="#007AFF" />
              </View>

              <View style={styles.cardStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {user.role.toUpperCase()}
                  </Text>
                  <Text style={styles.statLabel}>Szerep</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text
                    style={[
                      styles.statValue,
                      { color: user.phone_number ? "#1C1C1E" : "#FF3B30" },
                    ]}
                  >
                    {user.phone_number || "Hiányzik"}
                  </Text>
                  <Text style={styles.statLabel}>Telefon</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Modal visible={modalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Felhasználó adatlap</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <AntDesign name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            {selectedUser && (
              <ScrollView style={styles.modalBody}>
                <Text style={styles.inputLabel}>Név</Text>
                <TextInput
                  style={styles.input}
                  value={selectedUser.name}
                  onChangeText={(val) =>
                    setSelectedUser({ ...selectedUser, name: val })
                  }
                />

                <Text style={styles.inputLabel}>Jogosultság</Text>
                <View style={styles.roleSelector}>
                  {(["customer", "courier", "admin"] as const).map((r) => (
                    <TouchableOpacity
                      key={r}
                      style={[
                        styles.roleOption,
                        selectedUser.role === r && styles.roleOptionActive,
                      ]}
                      onPress={() =>
                        setSelectedUser({ ...selectedUser, role: r })
                      }
                    >
                      <Text
                        style={[
                          styles.roleOptionText,
                          selectedUser.role === r && { color: "#fff" },
                        ]}
                      >
                        {r.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleUpdateUser}
              >
                <AntDesign name="check" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Mentés</Text>
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
  roleFilters: { flexDirection: "row" },
  roleChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    marginRight: 8,
  },
  roleChipActive: { backgroundColor: "#007AFF" },
  roleChipText: { color: "#8E8E93", fontWeight: "600" },
  roleChipTextActive: { color: "#fff" },
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
    backgroundColor: "#007AFF",
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
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
    marginTop: 15,
  },
  input: {
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  roleSelector: { flexDirection: "row", gap: 8, marginTop: 10 },
  roleOption: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    alignItems: "center",
  },
  roleOptionActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  roleOptionText: { fontSize: 11, fontWeight: "bold", color: "#8E8E93" },
  modalFooter: { padding: 20, borderTopWidth: 1, borderTopColor: "#F2F2F7" },
  saveBtn: {
    backgroundColor: "#007AFF",
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
