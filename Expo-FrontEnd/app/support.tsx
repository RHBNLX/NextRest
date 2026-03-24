import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet, Text, TouchableOpacity, useWindowDimensions,
  View, TextInput, ScrollView, Alert, ActivityIndicator
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomFooter from "./components/footer";
import CustomNavbar from "./components/navbar";

// --- INTERFÉSZEK ---
interface Order {
  id: number;
  pickup_address: string;
  dropoff_address: string;
  price: number;
  status: string;
}

interface SupportTicket {
  id: number;
  subject: string;
  status: string;
  created_at: string;
}

interface Message {
  id: number;
  message: string;
  user_id: number;
  is_admin: boolean;
  created_at: string;
}

export default function SupportScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const scrollViewRef = useRef<ScrollView>(null);

  // Állapotok
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Kiválasztott ticket és Chat
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  // Új ticket Form állapotok
  const [ticketType, setTicketType] = useState("General Support");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (selectedTicketId) {
      fetchChatMessages(selectedTicketId);
    }
  }, [selectedTicketId]);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const userData = await AsyncStorage.getItem('userData');
    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoggedIn(true);
      fetchUserTickets(token);
      fetchUserOrders(parsedUser.id, token);
    }
  };

  const fetchUserTickets = async (token: string) => {
    try {
      const response = await fetch(`https://api.nextrest.hu/api/support_tickets`, {
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
      });
      if (response.ok) setTickets(await response.json());
    } catch (e) { console.error(e); }
  };

  const fetchUserOrders = async (userId: number, token: string) => {
    setIsLoadingOrders(true);
    try {
      const response = await fetch(`https://api.nextrest.hu/api/orders/user/${userId}`, {
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
      });
      if (response.ok) setOrders(await response.json());
    } finally { setIsLoadingOrders(false); }
  };

  const fetchChatMessages = async (ticketId: number) => {
    setIsLoadingChat(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`https://api.nextrest.hu/api/chat?ticket_id=${ticketId}`, {
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
      });
      if (response.ok) setMessages(await response.json());
    } finally { setIsLoadingChat(false); }
  };

  const handleSendTicket = async () => {
    if (!subject || !message) { Alert.alert("Hiba", "Töltsd ki a mezőket!"); return; }
    setIsSending(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch("https://api.nextrest.hu/api/support_tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          subject, message, status: "open",
          order_id: ticketType === "Parcel Issue" ? selectedOrderId : null
        }),
      });
      if (response.ok) {
        Alert.alert("Siker", "Jegye elküldve!");
        setSubject(""); setMessage(""); setSelectedOrderId(null);
        fetchUserTickets(token!);
      }
    } finally { setIsSending(false); }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedTicketId) return;
    const token = await AsyncStorage.getItem('userToken');
    const response = await fetch("https://api.nextrest.hu/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ ticket_id: selectedTicketId, message: chatInput }),
    });
    if (response.ok) {
      setChatInput("");
      fetchChatMessages(selectedTicketId);
    }
  };

  return (
    <View style={styles.container}>
      <CustomNavbar title="Ügyfélszolgálat" />

      <ScrollView contentContainerStyle={[styles.mainLayout, { flexDirection: isMobile ? "column" : "row" }]}>

        {/* SIDEBAR: Ticket lista */}
        <View style={[styles.sidebar, { width: isMobile ? "100%" : 320 }]}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Jegyeim</Text>
            <TouchableOpacity onPress={() => setSelectedTicketId(null)} style={styles.newBtn}>
              <Text style={styles.newBtnText}>+ Új</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.ticketScroll}>
            {tickets.map((t) => (
              <TouchableOpacity
                key={t.id}
                onPress={() => setSelectedTicketId(t.id)}
                style={[styles.ticketCard, selectedTicketId === t.id && styles.activeTicketCard]}
              >
                <Text style={[styles.ticketSub, selectedTicketId === t.id && { color: '#fff' }]} numberOfLines={1}>{t.subject}</Text>
                <Text style={[styles.ticketStat, selectedTicketId === t.id && { color: '#d1e9ff' }]}>#{t.id} • {t.status}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* MAIN CONTENT AREA */}
        <View style={styles.mainContent}>
          {selectedTicketId ? (
            /* --- CHAT FELÜLET --- */
            <View style={styles.card}>
              <View style={styles.chatHeader}>
                <TouchableOpacity onPress={() => setSelectedTicketId(null)}>
                  <Text style={{ color: '#007aff', fontWeight: 'bold' }}>← Vissza</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Support Ticket: {selectedTicketId}</Text>
              </View>

              <ScrollView
                style={styles.chatArea}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
              >
                {isLoadingChat ? <ActivityIndicator color="#007aff" /> :
                  messages.map((m) => (
                    <View key={m.id} style={[styles.bubble, m.is_admin ? styles.adminBubble : styles.userBubble]}>
                      <Text style={[styles.bubbleText, m.is_admin ? styles.adminText : styles.userText]}>{m.message}</Text>
                    </View>
                  ))
                }
              </ScrollView>

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.chatInput}
                  placeholder="Üzenet írása..."
                  value={chatInput}
                  onChangeText={setChatInput}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleSendMessage}>
                  <Text style={styles.sendBtnText}>Küldés</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            /* --- EREDETI SUPPORT FORM --- */
            <View style={styles.card}>
              <Text style={styles.headerTitle}>Új hibajegy beküldése</Text>

              <Text style={styles.label}>Kategória</Text>
              <View style={styles.selectionRow}>
                {["Parcel Issue", "General Support"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    disabled={type === "Parcel Issue" && !isLoggedIn}
                    style={[styles.chip, ticketType === type && styles.chipActive, (type === "Parcel Issue" && !isLoggedIn) && styles.chipDisabled]}
                    onPress={() => setTicketType(type)}
                  >
                    <Text style={[styles.chipText, ticketType === type && styles.chipTextActive]}>
                      {type === "Parcel Issue" ? "Csomag panasz" : "Általános"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {ticketType === "Parcel Issue" && isLoggedIn && (
                <View style={styles.orderPicker}>
                  <Text style={styles.label}>Válassz csomagot</Text>
                  <View style={styles.pickerBox}>
                    {isLoadingOrders ? <ActivityIndicator /> :
                      orders.map(o => (
                        <TouchableOpacity key={o.id} onPress={() => setSelectedOrderId(o.id)} style={[styles.orderItem, selectedOrderId === o.id && styles.orderItemActive]}>
                          <Text style={{ fontSize: 12, color: selectedOrderId === o.id ? '#fff' : '#333' }}>#{o.id} | {o.pickup_address.substring(0, 15)}...</Text>
                        </TouchableOpacity>
                      ))
                    }
                  </View>
                </View>
              )}

              <Text style={styles.label}>Tárgy</Text>
              <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="Mi a probléma?" />

              <Text style={styles.label}>Leírás</Text>
              <TextInput style={[styles.input, styles.textArea]} multiline value={message} onChangeText={setMessage} placeholder="Részletek..." />

              <TouchableOpacity style={styles.mainSendBtn} onPress={handleSendTicket} disabled={isSending}>
                {isSending ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendBtnText}>Hibajegy beküldése</Text>}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <CustomFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f5" },
  mainLayout: { padding: 20, gap: 20, maxWidth: 1100, alignSelf: 'center', width: '100%' },
  sidebar: { gap: 10 },
  sidebarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sidebarTitle: { fontSize: 20, fontWeight: 'bold' },
  newBtn: { backgroundColor: '#007aff', padding: 8, borderRadius: 8 },
  newBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  ticketScroll: { maxHeight: 500 },
  ticketCard: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 8, elevation: 2 },
  activeTicketCard: { backgroundColor: '#007aff' },
  ticketSub: { fontWeight: '600', fontSize: 14 },
  ticketStat: { fontSize: 11, color: '#888', marginTop: 4 },

  mainContent: { flex: 1 },
  card: { backgroundColor: "#fff", padding: 20, borderRadius: 20, elevation: 3, minHeight: 500 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },

  // Chat stílusok
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#eee', pb: 10, mb: 10 },
  chatArea: { flex: 1, marginBottom: 15 },
  bubble: { padding: 12, borderRadius: 15, marginBottom: 8, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007aff' },
  adminBubble: { alignSelf: 'flex-start', backgroundColor: '#f0f0f0' },
  userText: { color: '#fff' },
  adminText: { color: '#333' },
  bubbleText: { fontSize: 14 },
  inputRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  chatInput: { flex: 1, backgroundColor: '#f0f0f5', borderRadius: 20, paddingHorizontal: 15, height: 40 },
  sendBtn: { backgroundColor: '#007aff', paddingHorizontal: 15, height: 40, borderRadius: 20, justifyContent: 'center' },
  sendBtnText: { color: '#fff', fontWeight: 'bold' },

  // Form stílusok
  label: { fontSize: 13, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  selectionRow: { flexDirection: 'row', gap: 10 },
  chip: { padding: 8, borderRadius: 15, borderWidth: 1, borderColor: '#007aff' },
  chipActive: { backgroundColor: '#007aff' },
  chipDisabled: { borderColor: '#ccc' },
  chipText: { color: '#007aff', fontSize: 12 },
  chipTextActive: { color: '#fff' },
  orderPicker: { marginTop: 10 },
  pickerBox: { maxHeight: 100, borderWidth: 1, borderColor: '#eee', borderRadius: 10, padding: 5 },
  orderItem: { padding: 8, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  orderItemActive: { backgroundColor: '#007aff' },
  input: { backgroundColor: '#f9f9fb', borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 10 },
  textArea: { height: 80, textAlignVertical: 'top' },
  mainSendBtn: { backgroundColor: '#007aff', padding: 15, borderRadius: 10, marginTop: 20, alignItems: 'center' }
});