import React, { useState, useEffect, useRef } from "react";
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
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { usePageTitle, useProtectedRoute } from "../../hooks";
import CustomNavbar from "../components/navbar";
import axiosInstance from "../../api/axiosInstance";

interface SupportTicket {
  id: number;
  order_id: number | null;
  user_id: number;
  user?: { name: string; email: string };
  subject: string;
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  created_at: string;
}

interface ChatMessage {
  id: number;
  user_id: number;
  message: string;
  created_at: string;
  user?: { name: string; role: string };
}

const statusMap = {
  all: "Összes",
  open: "Nyitott",
  in_progress: "Folyamatban",
  resolved: "Megoldva",
  closed: "Lezárva",
};

const THEME_GREEN = "#28a745";

export default function SupportTickets() {
  usePageTitle("Support Jegyek");
  useProtectedRoute(["admin"]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (selectedTicket) {
      fetchChatMessages(selectedTicket.id);
    }
  }, [selectedTicket]);

  const fetchTickets = async () => {
    try {
      const response = await axiosInstance.get("/support_tickets");
      setTickets(response.data);
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült lekérni a jegyeket.");
    } finally {
      setLoading(false);
    }
  };

  const fetchChatMessages = async (ticketId: number) => {
    try {
      const response = await axiosInstance.get(
        `/chat?support_ticket_id=${ticketId}`,
      );
      setChatMessages(response.data);
      setTimeout(
        () => scrollViewRef.current?.scrollToEnd({ animated: false }),
        100,
      );
    } catch (error) {
      console.error("Chat hiba:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;
    setSending(true);
    try {
      const response = await axiosInstance.post("/chat", {
        support_ticket_id: selectedTicket.id,
        message: newMessage,
      });
      setChatMessages((prev) => [...prev, response.data]);
      setNewMessage("");
      setTimeout(
        () => scrollViewRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült elküldeni az üzenetet.");
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!selectedTicket) return;
    try {
      await axiosInstance.put(`/support_tickets/${selectedTicket.id}`, {
        status: newStatus,
      });
      setTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id ? { ...t, status: newStatus as any } : t,
        ),
      );
      setSelectedTicket((prev) =>
        prev ? { ...prev, status: newStatus as any } : null,
      );
    } catch (error) {
      Alert.alert("Hiba", "Nem sikerült frissíteni a státuszt.");
    }
  };

  const filteredTickets =
    filterStatus === "all"
      ? tickets
      : tickets.filter((t) => t.status === filterStatus);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={THEME_GREEN} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomNavbar title="Ügyfélszolgálat" />

      <View style={styles.filterContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {Object.entries(statusMap).map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.filterBtn,
                filterStatus === key && styles.filterBtnActive,
              ]}
              onPress={() => setFilterStatus(key)}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  filterStatus === key && styles.filterBtnTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.ticketList}>
        {filteredTickets.map((ticket) => (
          <TouchableOpacity
            key={ticket.id}
            style={styles.ticketCard}
            onPress={() => setSelectedTicket(ticket)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.subjectText}>{ticket.subject}</Text>
              <View
                style={[
                  styles.statusBadge,
                  ticket.status === "open" ? styles.badgeRed : styles.badgeGray,
                ]}
              >
                <Text style={styles.statusText}>
                  {statusMap[ticket.status]}
                </Text>
              </View>
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.userNameText}>
                Ügyfél: {ticket.user?.name || "N/A"}
              </Text>
              <Text style={styles.dateText}>
                {new Date(ticket.created_at).toLocaleDateString("hu-HU")}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!selectedTicket} animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setSelectedTicket(null)}
                style={styles.backBtn}
              >
                <AntDesign name="arrow-left" size={24} color="black" />
              </TouchableOpacity>
              <View style={styles.headerInfo}>
                <Text style={styles.modalTitle}>{selectedTicket?.subject}</Text>
                <Text style={styles.modalSub}>
                  {selectedTicket?.user?.name}
                </Text>
              </View>
            </View>

            <View style={styles.statusRow}>
              {["open", "in_progress", "resolved", "closed"].map((s) => (
                <TouchableOpacity
                  key={s}
                  onPress={() => updateStatus(s)}
                  style={[
                    styles.statusActionBtn,
                    selectedTicket?.status === s &&
                      styles.statusActionBtnActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusActionText,
                      selectedTicket?.status === s &&
                        styles.statusActionTextActive,
                    ]}
                  >
                    {statusMap[s as keyof typeof statusMap]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <ScrollView ref={scrollViewRef} style={styles.chatArea}>
              <View style={styles.userInitialMessage}>
                <Text style={styles.initialMsgLabel}>Eredeti panasz:</Text>
                <Text style={styles.initialMsgText}>
                  {selectedTicket?.message}
                </Text>
              </View>

              {chatMessages.map((msg) => (
                <View
                  key={msg.id}
                  style={[
                    styles.msgWrapper,
                    msg.user?.role === "admin"
                      ? styles.adminWrapper
                      : styles.userWrapper,
                  ]}
                >
                  <View
                    style={[
                      styles.msgBubble,
                      msg.user?.role === "admin"
                        ? styles.adminBubble
                        : styles.userBubble,
                    ]}
                  >
                    {msg.user?.role !== "admin" && (
                      <Text style={styles.msgName}>{msg.user?.name}</Text>
                    )}
                    <Text
                      style={[
                        styles.msgText,
                        msg.user?.role === "admin" && { color: "#fff" },
                      ]}
                    >
                      {msg.message}
                    </Text>
                    <Text style={styles.msgDate}>
                      {new Date(msg.created_at).toLocaleTimeString("hu-HU", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputArea}>
              <TextInput
                style={styles.input}
                placeholder="Válasz írása..."
                value={newMessage}
                onChangeText={setNewMessage}
                multiline
              />
              <TouchableOpacity
                style={styles.sendBtn}
                onPress={handleSendMessage}
                disabled={sending}
              >
                {sending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <AntDesign name="send" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  filterContainer: {
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  filterScroll: { paddingHorizontal: 16 },
  filterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#F1F3F5",
  },
  filterBtnActive: { backgroundColor: "#28a745" },
  filterBtnText: { color: "#495057", fontWeight: "600" },
  filterBtnTextActive: { color: "#fff" },
  ticketList: { padding: 16 },
  ticketCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  subjectText: { fontSize: 16, fontWeight: "bold", flex: 1, color: "#212529" },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeRed: { backgroundColor: "#FF3B30" },
  badgeGray: { backgroundColor: "#8E8E93" },
  statusText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  cardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userNameText: { color: "#666", fontSize: 13 },
  dateText: { color: "#ADB5BD", fontSize: 12 },
  modalContainer: { flex: 1, backgroundColor: "#fff" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  backBtn: { marginRight: 15 },
  headerInfo: { flex: 1 },
  modalTitle: { fontSize: 16, fontWeight: "bold", color: "#212529" },
  modalSub: { fontSize: 12, color: "#666" },
  statusRow: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    backgroundColor: "#F8F9FA",
  },
  statusActionBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#DEE2E6",
    backgroundColor: "#fff",
  },
  statusActionBtnActive: { backgroundColor: "#28a745", borderColor: "#28a745" },
  statusActionText: { fontSize: 11, color: "#666", fontWeight: "600" },
  statusActionTextActive: { color: "#fff" },
  chatArea: { flex: 1, padding: 16 },
  userInitialMessage: {
    backgroundColor: "#FFF9DB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#FCC419",
  },
  initialMsgLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#868E96",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  initialMsgText: { fontSize: 14, color: "#495057", lineHeight: 20 },
  msgWrapper: { marginBottom: 12, width: "100%" },
  adminWrapper: { alignItems: "flex-end" },
  userWrapper: { alignItems: "flex-start" },
  msgBubble: { maxWidth: "85%", padding: 12, borderRadius: 18 },
  adminBubble: { backgroundColor: "#28a745", borderBottomRightRadius: 4 },
  userBubble: { backgroundColor: "#F1F3F5", borderBottomLeftRadius: 4 },
  msgName: {
    fontSize: 10,
    fontWeight: "800",
    marginBottom: 4,
    color: "#495057",
  },
  msgText: { fontSize: 15, lineHeight: 20 },
  msgDate: {
    fontSize: 9,
    color: "#ADB5BD",
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputArea: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    backgroundColor: "#F1F3F5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 15,
  },
  sendBtn: {
    backgroundColor: "#28a745",
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});
