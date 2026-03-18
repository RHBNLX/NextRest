import AntDesign from "@expo/vector-icons/AntDesign";
import { useEffect, useState } from "react";
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

type Parcel = {
    id: number;
    recipient: string;
    address: string;
    status: string;
    phone: string;
    email: string;
    size: string;
};

export default function Dashboard() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;


    const [expandedParcelId, setExpandedParcelId] = useState<number | null>(null);

    const toggleParcel = (id: number) => {
        setExpandedParcelId(expandedParcelId === id ? null : id);
    };
    const [pendingParcels, setPendingParcels] = useState<Parcel[]>([]);
    const [outgoingParcels, setOutgoingParcels] = useState<Parcel[]>([]);
    const [loading, setLoading] = useState(true);

    //mock
    const fetchParcels = async () => {
        setLoading(true);
        setTimeout(() => {
            setPendingParcels([
                {
                    id: 1,
                    recipient: "Alice",
                    address: "123 Main St",
                    status: "Incoming",
                    phone: "+123456789",
                    email: "alice@example.com",
                    size: "Medium",
                },
                {
                    id: 2,
                    recipient: "Bob",
                    address: "45 Oak Ave",
                    status: "Incoming",
                    phone: "+123456789",
                    email: "bob@example.com",
                    size: "Large",
                },
            ]);
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        fetchParcels();
    }, []);

    return (
        <View style={styles.container}>
            <CustomNavbar title="Dashboard" />
            <View style={styles.iconBackground}>
                <AntDesign name="dashboard" size={300} color="#000" />
            </View>

            <View style={[styles.mainRow, { flexDirection: isMobile ? "column" : "row" }]}>
                <View style={[styles.sidebar, { width: isMobile ? "100%" : 250 }]}>
                    <View style={styles.sidebarSection}>
                        <Text style={styles.sidebarTitle}>Sending a Parcel</Text>
                        <TouchableOpacity style={styles.sidebarButton}>
                            <Text style={styles.buttonText}>Send Parcel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sidebarButton}>
                            <Text style={styles.buttonText}>Return Parcel</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.sidebarSection}>
                        <Text style={styles.sidebarTitle}>Options</Text>
                        <TouchableOpacity style={styles.sidebarButton}>
                            <Text style={styles.buttonText}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.sidebarButton}>
                            <Text style={styles.buttonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.contentArea}>
                    <Text style={styles.mainContentTitle}>Your Parcels</Text>

                    <View style={[styles.parcelsRow, { flexDirection: isMobile ? "column" : "row" }]}>
                        <View style={styles.parcelsColumn}>
                            <Text style={styles.parcelsTitle}>Incoming Parcels</Text>
                            <ScrollView style={styles.parcelScroll}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="#007AFF" />
                                ) : Array.isArray(pendingParcels) && pendingParcels.length > 0 ? (
                                    pendingParcels.map((p) => (
                                        <View key={p.id} style={styles.parcelCard}>
                                            <View style={styles.parcelHeader}>
                                                <View>
                                                    <Text style={styles.parcelRecipient}>{p.recipient}</Text>
                                                    <Text style={styles.parcelAddress}>{p.address}</Text>
                                                </View>

                                                <TouchableOpacity
                                                    style={styles.detailsButton}
                                                    onPress={() => toggleParcel(p.id)}
                                                >
                                                    <Text style={styles.detailsButtonText}>
                                                        {expandedParcelId === p.id ? "Hide" : "Details"}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>

                                            {expandedParcelId === p.id && (
                                                <View style={styles.detailsContainer}>
                                                    <Text style={styles.detailText}>📞 {p.phone}</Text>
                                                    <Text style={styles.detailText}>✉️ {p.email}</Text>
                                                    <Text style={styles.detailText}>📦 Size: {p.size}</Text>
                                                </View>
                                            )}
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.emptyText}>No incoming parcels</Text>
                                )}
                            </ScrollView>
                        </View>

                        <View style={styles.parcelsColumn}>
                            <Text style={styles.parcelsTitle}>Outgoing Parcels</Text>
                            <ScrollView style={styles.parcelScroll}>
                                {loading ? (
                                    <ActivityIndicator size="small" color="#007AFF" />
                                ) : Array.isArray(outgoingParcels) && outgoingParcels.length > 0 ? (
                                    outgoingParcels.map((p) => (
                                        <View key={p.id} style={styles.parcelCard}>
                                            <Text style={styles.parcelRecipient}>{p.recipient}</Text>
                                            <Text style={styles.parcelAddress}>{p.address}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={styles.emptyText}>No outgoing parcels</Text>
                                )}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </View>
            <CustomFooter />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#efeff6" },

    iconBackground: {
        position: "absolute",
        top: "20%",
        alignSelf: "center",
        opacity: 0.05,
        zIndex: 0,
    },

    parcelHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    detailsButton: {
        backgroundColor: "#007AFF",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },

    detailsButtonText: {
        color: "#fff",
        fontWeight: "600",
    },

    detailsContainer: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        paddingTop: 8,
        gap: 4,
    },

    detailText: {
        fontSize: 14,
        color: "#333",
    },


    mainRow: { flex: 1 },

    sidebar: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 16,
        gap: 20,
        marginBottom: 16,
    },

    sidebarSection: { gap: 12 },

    sidebarTitle: { fontSize: 18, fontWeight: "700", color: "#007AFF" },

    sidebarButton: {
        backgroundColor: "#007AFF",
        borderRadius: 12,
        paddingVertical: 10,
        alignItems: "center",
    },

    buttonText: { color: "#fff", fontWeight: "600" },

    contentArea: {
        flex: 1,
        paddingLeft: 16,
        gap: 16,
    },

    mainContentTitle: {
        fontSize: 24,
        fontWeight: "700",
        color: "#007AFF",
        marginBottom: 12,
    },

    parcelsRow: { gap: 16 },

    parcelsColumn: {
        flex: 1,
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 16,
        maxHeight: 400,
    },

    parcelsTitle: {
        fontWeight: "700",
        fontSize: 18,
        marginBottom: 12,
        color: "#007AFF",
    },

    parcelScroll: {
        flexGrow: 0,
    },

    parcelCard: {
        backgroundColor: "#f0f0f0",
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
    },

    parcelRecipient: { fontWeight: "600", color: "#007AFF" },
    parcelAddress: { fontSize: 14, color: "#444" },

    emptyText: { fontSize: 14, color: "#666", fontStyle: "italic" },
});