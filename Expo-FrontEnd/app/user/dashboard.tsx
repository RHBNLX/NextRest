import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from "react-native";
import CustomFooter from "../components/footer";
import CustomNavbar from "../components/navbar";

type Order = {
    id: number;
    user_id: number;
    courier_id: number | null;
    pickup_address: string;
    dropoff_address: string;
    status: string;
    price: number;
    created_at: string;
};

export default function Dashboard() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const router = useRouter();
    const [expandedParcelId, setExpandedParcelId] = useState<number | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const API_URL = "https://api.nextrest.hu/api";

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/orders`);
            const data = await res.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const OrderCard = ({ order }: { order: Order }) => (
        <View style={styles.parcelCard}>
            <View style={styles.parcelHeader}>
                <View style={{ flex: 1 }}>
                    <View style={styles.idRow}>
                        <Text style={styles.parcelIdText}>Rendelés #{order.id}</Text>
                        <View style={[styles.statusBadge, order.status === 'pending' ? styles.statusPending : styles.statusDone]}>
                            <Text style={styles.statusBadgeText}>{order.status}</Text>
                        </View>
                    </View>
                    <Text style={styles.parcelAddress}>
                        <Text style={styles.addressLabel}>Felvétel: </Text>{order.pickup_address}{"\n"}
                        <Text style={styles.addressLabel}>Kiszállítás: </Text>{order.dropoff_address}
                    </Text>
                    <Text style={styles.priceText}>{order.price} Ft</Text>
                </View>

                <TouchableOpacity
                    style={[styles.detailsButton, expandedParcelId === order.id && styles.detailsButtonActive]}
                    onPress={() => setExpandedParcelId(expandedParcelId === order.id ? null : order.id)}
                >
                    <AntDesign
                        name={expandedParcelId === order.id ? "up" : "down"}
                        size={14}
                        color={expandedParcelId === order.id ? "#fff" : "#007AFF"}
                    />
                </TouchableOpacity>
            </View>

            {expandedParcelId === order.id && (
                <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                        <AntDesign name="clock-circle" size={12} color="#888" />
                        <Text style={styles.detailText}>Dátum: {new Date(order.created_at).toLocaleString('hu-HU')}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <AntDesign name="car" size={12} color="#888" />
                        <Text style={styles.detailText}>Futár: {order.courier_id ? `ID #${order.courier_id}` : "Keresés..."}</Text>
                    </View>
                </View>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <CustomNavbar title="Vezérlőpult" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.mainRow, { flexDirection: isMobile ? "column" : "row" }]}>

                    {/* SIDEBAR: Műveletek kártya */}
                    <View style={[styles.sidebarCard, { width: isMobile ? "100%" : 280 }]}>
                        <View style={styles.sidebarSection}>
                            <Text style={styles.sidebarSectionTitle}>Csomagkezelés</Text>
                            <TouchableOpacity style={styles.mainActionBtn} onPress={() => router.push("/user/sendParcel")}>
                                <AntDesign name="plus" size={18} color="#fff" />
                                <Text style={styles.mainActionBtnText}>Új rendelés</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.secondaryActionBtn} onPress={() => router.push("/user/returnParcel")}>
                                <AntDesign name="rollback" size={18} color="#007AFF" />
                                <Text style={styles.secondaryActionBtnText}>Visszaküldés</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.divider} />

                        <View style={styles.sidebarSection}>
                            <Text style={styles.sidebarSectionTitle}>Fiók beállítások</Text>
                            <TouchableOpacity style={styles.navLink} onPress={() => router.push("/user/settings")}>
                                <AntDesign name="setting" size={18} color="#555" />
                                <Text style={styles.navLinkText}>Beállítások</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.navLink}>
                                <AntDesign name="logout" size={18} color="#FF3B30" />
                                <Text style={[styles.navLinkText, { color: "#FF3B30" }]}>Kijelentkezés</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* TARTALOM: Rendelések listája */}
                    <View style={styles.contentArea}>
                        <Text style={styles.pageTitle}>Aktív rendeléseim ({orders.length})</Text>

                        {loading ? (
                            <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
                        ) : orders.length > 0 ? (
                            orders.map(o => <OrderCard key={o.id} order={o} />)
                        ) : (
                            <View style={styles.emptyContainer}>
                                <AntDesign name="safety" size={60} color="#ddd" />
                                <Text style={styles.emptyText}>Jelenleg nincs aktív rendelésed.</Text>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>

            <CustomFooter />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F2F2F7" },
    scrollContent: { paddingBottom: 40 },
    mainRow: { padding: 20, gap: 24, maxWidth: 1200, alignSelf: 'center', width: '100%' },

    // Sidebar Card
    sidebarCard: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 24,
        gap: 20,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 5 }
    },
    sidebarSection: { gap: 12 },
    sidebarSectionTitle: { fontSize: 12, fontWeight: "800", color: "#A1A1A6", textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
    mainActionBtn: { backgroundColor: "#007AFF", borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: "center", gap: 10, justifyContent: 'center' },
    mainActionBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
    secondaryActionBtn: { backgroundColor: "#F2F2F7", borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: "center", gap: 10, justifyContent: 'center' },
    secondaryActionBtnText: { color: "#007AFF", fontWeight: "700", fontSize: 15 },
    divider: { height: 1, backgroundColor: "#F2F2F7", marginVertical: 5 },
    navLink: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
    navLinkText: { fontSize: 15, fontWeight: '600', color: '#444' },

    // Content Area
    contentArea: { flex: 1 },
    pageTitle: { fontSize: 26, fontWeight: "800", marginBottom: 20, color: "#1C1C1E" },

    // Order Card
    parcelCard: { backgroundColor: "#fff", borderRadius: 20, padding: 20, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 },
    parcelHeader: { flexDirection: 'row', justifyContent: 'space-between' },
    idRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    parcelIdText: { fontSize: 12, fontWeight: "800", color: "#8E8E93" },
    statusBadge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8 },
    statusPending: { backgroundColor: '#FFF9C4' },
    statusDone: { backgroundColor: '#C8E6C9' },
    statusBadgeText: { fontSize: 10, fontWeight: '900', color: '#856404', textTransform: 'uppercase' },
    parcelAddress: { fontSize: 15, color: "#1C1C1E", lineHeight: 22, marginBottom: 8 },
    addressLabel: { fontWeight: '700', color: '#3A3A3C' },
    priceText: { fontSize: 20, fontWeight: '800', color: '#007AFF' },
    detailsButton: { backgroundColor: "#F2F2F7", width: 36, height: 36, borderRadius: 12, alignItems: "center", justifyContent: "center" },
    detailsButtonActive: { backgroundColor: '#007AFF' },

    detailsContainer: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: "#F2F2F7", gap: 8 },
    detailItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    detailText: { fontSize: 13, color: "#636366", fontWeight: '500' },

    emptyContainer: { alignItems: 'center', marginTop: 60, gap: 15 },
    emptyText: { color: '#8E8E93', fontSize: 16, fontWeight: '500' }
});