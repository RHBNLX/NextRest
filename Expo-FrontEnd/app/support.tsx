import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet, Text, TouchableOpacity, useWindowDimensions,
  View, TextInput, ScrollView, Alert, ActivityIndicator
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomFooter from "./components/footer";
import CustomNavbar from "./components/navbar";

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

  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const API_URL = "https://api.nextrest.hu/api";

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
      fetchTickets();
      fetchOrders();
    }
  };

  const fetchTickets = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const res = await fetch(`${API_URL}/user/tickets`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Hiba a jegyek lekérésekor:", e);
    }
  };

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");
      if (!userData || !token) return;

      const parsedUser = JSON.parse(userData);
      const userId = parsedUser.id;

      const res = await fetch(`${API_URL}/orders/user/${userId}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Hiba a rendelések lekérésekor:", e);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchChatMessages = async (ticketId: number) => {
    setIsLoadingChat(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/chat?support_ticket_id=${ticketId}`, {
        headers: { "Authorization": `Bearer ${token}`, "Accept": "application/json" }
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (e) {
      console.error("Chat lekérési hiba:", e);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleSendTicket = async () => {
    if (!subject || !message || !selectedOrderId) {
      Alert.alert("Hiba", "Válassz ki egy rendelést és töltsd ki a mezőket!");
      return;
    }
    setIsSending(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/support_tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          user_id: user?.id,
          subject,
          message,
          status: "open",
          order_id: selectedOrderId
        }),
      });

      if (response.ok) {
        Alert.alert("Siker", "Jegye elküldve!");
        setSubject("");
        setMessage("");
        setSelectedOrderId(null);
        fetchTickets();
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Hiba", "Nem sikerült elküldeni a hibajegyet.");
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !selectedTicketId) return;
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`, "Accept": "application/json" },
        body: JSON.stringify({ support_ticket_id: selectedTicketId, message: chatInput }),
      });
      if (response.ok) {
        setChatInput("");
        fetchChatMessages(selectedTicketId);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusStyle = (status: string) => {
    if (!status) return styles.statusPending;
    const s = status.toLowerCase();
    if (s === 'open' || s === 'nyitott') return styles.statusOpen;
    if (s === 'closed' || s === 'lezárt') return styles.statusClosed;
    return styles.statusPending;
  };

  return (
    <View style={styles.container}>
      <CustomNavbar title="Ügyfélszolgálat" />

      <ScrollView contentContainerStyle={[styles.mainLayout, { flexDirection: isMobile ? "column" : "row" }]}>

        {/* Sidebar */}
        <View style={[styles.sidebar, { width: isMobile ? "100%" : 320 }]}>
          <View style={styles.sidebarHeader}>
            <Text style={styles.sidebarTitle}>Jegyeim</Text>
            <TouchableOpacity onPress={() => setSelectedTicketId(null)} style={styles.newBtn}>
              <Text style={styles.newBtnText}>+ Új jegy</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.ticketScroll} showsVerticalScrollIndicator={false}>
            {tickets.length === 0 ? (
              <Text style={styles.emptyText}>Még nincs hibajegyed.</Text>
            ) : (
              tickets.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => setSelectedTicketId(t.id)}
                  style={[styles.ticketCard, selectedTicketId === t.id && styles.activeTicketCard]}
                >
                  <View style={styles.ticketCardHeader}>
                    <Text style={styles.ticketId}>#{t.id}</Text>
                    <View style={[styles.statusBadge, getStatusStyle(t.status)]}>
                      <Text style={styles.statusText}>{t.status.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={[styles.ticketSub, selectedTicketId === t.id && { color: '#fff' }]} numberOfLines={1}>
                    {t.subject}
                  </Text>
                  <Text style={[styles.ticketDate, selectedTicketId === t.id && { color: '#e0e0e0' }]}>
                    {new Date(t.created_at).toLocaleDateString('hu-HU')}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>

        {/* Fő Content*/}
        <View style={styles.mainContent}>
          {selectedTicketId ? (
            <View style={styles.card}>
              <View style={styles.chatHeader}>
                <TouchableOpacity onPress={() => setSelectedTicketId(null)}>
                  <Text style={{ color: '#007aff', fontWeight: 'bold' }}>← Vissza</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hibajegy: #{selectedTicketId}</Text>
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
            <View style={styles.card}>
              <Text style={styles.headerTitle}>Új csomag panasz beküldése</Text>
              {isLoggedIn ? (
                <>
                  <View style={styles.orderPicker}>
                    <Text style={styles.label}>Válassz érintett csomagot *</Text>
                    <View style={styles.pickerBox}>
                      {isLoadingOrders ? (
                        <ActivityIndicator style={{ padding: 20 }} />
                      ) : orders.length === 0 ? (
                        /* Ha nincs rendelés, ezt jelenítjük meg */
                        <Text style={{ padding: 15, color: '#888', fontStyle: 'italic', textAlign: 'center' }}>
                          Nincsenek aktív rendeléseid.
                        </Text>
                      ) : (
                        /* ScrollView-ba ágyazzuk, hogy ne folyjon ki és görgethető legyen */
                        <ScrollView nestedScrollEnabled={true} style={{ flex: 1 }}>
                          {orders.map((o) => (
                            <TouchableOpacity
                              key={o.id}
                              onPress={() => setSelectedOrderId(o.id)}
                              style={[
                                styles.orderItem,
                                selectedOrderId === o.id && styles.orderItemActive,
                              ]}
                            >
                              <Text style={{ fontSize: 13, color: selectedOrderId === o.id ? "#fff" : "#333" }}>
                                #{o.id} | {o.pickup_address.substring(0, 25)}...
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  </View>

                  <Text style={styles.label}>Tárgy</Text>
                  <TextInput style={styles.input} value={subject} onChangeText={setSubject} placeholder="Pl.: Sérült csomag..." />

                  <Text style={styles.label}>Leírás</Text>
                  <TextInput style={[styles.input, styles.textArea]} multiline value={message} onChangeText={setMessage} placeholder="Részletek..." />

                  <TouchableOpacity
                    style={[styles.mainSendBtn, (!selectedOrderId || !subject || !message) && { backgroundColor: "#ccc" }]}
                    onPress={handleSendTicket}
                    disabled={isSending || !selectedOrderId}
                  >
                    {isSending ? <ActivityIndicator color="#fff" /> : <Text style={styles.sendBtnText}>Hibajegy beküldése</Text>}
                  </TouchableOpacity>
                </>
              ) : <Text style={{ textAlign: "center", marginTop: 20 }}>Jelentkezz be a hibajegy küldéséhez.</Text>}
            </View>
          )}
        </View>
      </ScrollView>
      <CustomFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f9" },
  mainLayout: { padding: 20, gap: 20, maxWidth: 1100, alignSelf: 'center', width: '100%' },
  sidebar: { gap: 15 },
  sidebarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
  sidebarTitle: { fontSize: 22, fontWeight: '800', color: '#1a1a1a' },
  newBtn: { backgroundColor: '#007aff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  newBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  ticketScroll: { maxHeight: 600 },
  emptyText: { color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
  ticketCard: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, borderLeftWidth: 4, borderLeftColor: '#007aff' },
  activeTicketCard: { backgroundColor: '#007aff', borderLeftColor: '#0056b3' },
  ticketCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  ticketId: { fontSize: 12, fontWeight: '700', color: '#888' },
  ticketSub: { fontWeight: '700', fontSize: 15, color: '#1a1a1a', marginBottom: 4 },
  ticketDate: { fontSize: 11, color: '#999' },
  statusBadge: { paddingVertical: 3, paddingHorizontal: 8, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '900', color: '#fff' },
  statusOpen: { backgroundColor: '#28a745' },
  statusClosed: { backgroundColor: '#6c757d' },
  statusPending: { backgroundColor: '#ffc107' },
  mainContent: { flex: 1 },
  card: { backgroundColor: "#fff", padding: 24, borderRadius: 24, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 5, minHeight: 550 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1a1a1a', marginBottom: 20 },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#f0f0f0', paddingBottom: 15, marginBottom: 15 },
  chatArea: { flex: 1, marginBottom: 20 },
  bubble: { padding: 14, borderRadius: 20, marginBottom: 10, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#007aff', borderBottomRightRadius: 4 },
  adminBubble: { alignSelf: 'flex-start', backgroundColor: '#f0f2f5', borderBottomLeftRadius: 4 },
  userText: { color: '#fff' },
  adminText: { color: '#333' },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  inputRow: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  chatInput: { flex: 1, backgroundColor: '#f0f2f5', borderRadius: 25, paddingHorizontal: 20, height: 45, fontSize: 14 },
  sendBtn: { backgroundColor: '#007aff', paddingHorizontal: 20, height: 45, borderRadius: 25, justifyContent: 'center' },
  sendBtnText: { color: '#fff', fontWeight: 'bold' },
  label: { fontSize: 14, fontWeight: '700', color: '#444', marginTop: 15, marginBottom: 8 },
  orderPicker: { marginTop: 5 },
  pickerBox: { maxHeight: 180, borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 5, backgroundColor: '#fafafa' },
  orderItem: { padding: 12, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  orderItemActive: { backgroundColor: '#007aff', borderRadius: 8 },
  input: { backgroundColor: '#f9f9fb', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, fontSize: 14 },
  textArea: { height: 100, textAlignVertical: 'top' },
  mainSendBtn: { backgroundColor: '#007aff', padding: 16, borderRadius: 14, marginTop: 25, alignItems: 'center', shadowColor: "#007aff", shadowOpacity: 0.3, shadowRadius: 5 }
});