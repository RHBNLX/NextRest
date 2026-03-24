import AntDesign from "@expo/vector-icons/AntDesign";
import { router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NavbarProps {
  title: string;
}

export default function CustomNavbar({ title }: NavbarProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };
    checkUser();
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const menuItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "support", label: "Support", href: "/support" },
    ...(user ? [{ id: "dashboard", label: "Dashboard", href: "/userInterface/dashboard" }] : [
      { id: "register", label: "Register", href: "/auth/register" },
      { id: "login", label: "Login", href: "/auth/login" }
    ])
  ];

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['userToken', 'userData']);
    setUser(null);
    setUserMenuOpen(false);
    router.replace("/auth/login");
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.navSection}>
          {!isMobile && (
            <View style={styles.links}>
              {menuItems.map((item) => (
                <TouchableOpacity key={item.id} onPress={() => router.push(item.href as any)}>
                  <Text style={[styles.link, pathname === item.href && styles.activeLink]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.rightActions}>
            {user ? (
              <View>
                <TouchableOpacity
                  style={styles.profileTrigger}
                  onPress={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <Text style={styles.userName}>{user.name} </Text>
                  <AntDesign name={userMenuOpen ? "up" : "down"} size={12} color="#007Aff" />
                </TouchableOpacity>

                {userMenuOpen && (
                  <View style={styles.dropdown}>
                    {isMobile && menuItems.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.dropdownItem}
                        onPress={() => { setUserMenuOpen(false); router.push(item.href as any); }}
                      >
                        <Text style={[styles.dropdownText, pathname === item.href && styles.activeLink]}>
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    ))}

                    {isMobile && <View style={styles.separator} />}

                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => { setUserMenuOpen(false); router.push("/components/settings" as any); }}
                    >
                      <AntDesign name="setting" size={16} color="#444" />
                      <Text style={styles.dropdownText}>Settings</Text>
                    </TouchableOpacity>

                    <View style={styles.separator} />

                    <TouchableOpacity style={styles.dropdownItem} onPress={handleLogout}>
                      <AntDesign name="logout" size={16} color="#ff3b30" />
                      <Text style={[styles.dropdownText, { color: "#ff3b30" }]}>Logout</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              isMobile && (
                <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
                  <AntDesign name={menuOpen ? "close" : "menu"} size={28} color="#007Aff" />
                </TouchableOpacity>
              )
            )}
          </View>
        </View>

        {isMobile && menuOpen && !user && (
          <View style={styles.mobileMenu}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={{ paddingVertical: 15 }}
                onPress={() => { setMenuOpen(false); router.push(item.href as any); }}
              >
                <Text style={styles.link}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: "#fff", zIndex: 1000 },
  container: {
    height: 65,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  rightActions: { marginLeft: 5 },
  title: { fontSize: 18, fontWeight: "bold", color: "#007Aff" },
  navSection: { flexDirection: "row", alignItems: "center" },
  links: { flexDirection: "row", gap: 15 },
  link: { fontSize: 15, fontWeight: "600", color: "#444" },
  activeLink: { color: "#007Aff", fontWeight: "700" },
  profileTrigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f7ff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  userName: { color: "#007Aff", fontWeight: "700", fontSize: 14 },
  dropdown: {
    position: "absolute",
    top: 50,
    right: 0,
    backgroundColor: "#fff",
    width: 200, // Kicsit szélesebb a több infó miatt
    borderRadius: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    zIndex: 20000,
  },
  dropdownItem: { flexDirection: "row", alignItems: "center", padding: 15, gap: 10 },
  dropdownText: { fontSize: 15, color: "#333" },
  separator: { height: 1, backgroundColor: "#eee", marginHorizontal: 10 },
  mobileMenu: {
    position: "absolute",
    top: 65,
    right: 0,
    left: 0,
    backgroundColor: "#fff",
    padding: 20,
    zIndex: 10000,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  }
});