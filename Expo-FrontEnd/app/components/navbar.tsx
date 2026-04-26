import AntDesign from "@expo/vector-icons/AntDesign";
import { router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext";
import { Image } from "react-native";

interface NavbarProps {
  title: string;
}

export default function CustomNavbar({ title }: NavbarProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const pathname = usePathname();
  const { user, isLoggedIn, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // ADMIN ELLENŐRZÉS ÉS DINAMIKUS SZÍN
  const isAdmin = isLoggedIn && (user as any)?.role === 'admin';
  const activeColor = isAdmin ? "#34C759" : "#007Aff";

  // DINAMIKUS NAVLINKEK
  const menuItems = isAdmin 
    ? [
        { id: "Vezérlőpult", label: "Vezérlőpult", href: "/mgmt/dashboard" },
        { id: "Futárok", label: "Futárok", href: "/mgmt/couriers" },
        { id: "Felhasználók", label: "Felhasználók", href: "/mgmt/users" },
        { id: "Csomagok", label: "Csomagok", href: "/mgmt/packages" },
        { id: "Support jegyek", label: "Support jegyek", href: "/mgmt/tickets" },
      ]
    : [
        { id: "Főoldal", label: "Főoldal", href: "/" },
        { id: "Support", label: "Support", href: "/support" },
        ...(isLoggedIn
          ? [{ id: "Vezérlőpult", label: "Vezérlőpult", href: "/user/dashboard" }]
          : [
              { id: "Regisztráció", label: "Regisztráció", href: "/auth/register" },
              { id: "Bejelentkezés", label: "Bejelentkezés", href: "/auth/login" },
            ]),
      ];

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo színét az activeColor határozza meg */}
        <Text style={[styles.title, { color: activeColor }]}>{title}</Text>

        <View style={styles.navSection}>
          {!isMobile && (
            <View style={styles.links}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => router.push(item.href as any)}
                >
                  <Text
                    style={[
                      styles.link,
                      pathname === item.href && { color: activeColor, fontWeight: "700" },
                    ]}
                  >
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
                  style={[styles.profileTrigger, isAdmin && { backgroundColor: "#f0fff4" }]}
                  onPress={() => setUserMenuOpen(!userMenuOpen)}
                >
                  {user.avatar_url ? (
                    <Image
                      source={{ uri: user.avatar_url }}
                      style={styles.navAvatar}
                    />
                  ) : (
                    <View
                      style={[
                        styles.navAvatar,
                        {
                          backgroundColor: activeColor,
                          justifyContent: "center",
                          alignItems: "center",
                        },
                      ]}
                    >
                      <Text style={{ color: "#fff", fontSize: 10 }}>
                        {user.name[0]}
                      </Text>
                    </View>
                  )}
                  <Text style={[styles.userName, { color: activeColor }]}>{user.name} </Text>
                  <AntDesign
                    name={userMenuOpen ? "up" : "down"}
                    size={12}
                    color={activeColor}
                  />
                </TouchableOpacity>

                {/* MODAL a kívülre kattintás becsukásához */}
                <Modal transparent visible={userMenuOpen} animationType="none" onRequestClose={() => setUserMenuOpen(false)}>
                  <TouchableWithoutFeedback onPress={() => setUserMenuOpen(false)}>
                    <View style={styles.modalOverlay}>
                      <View style={[styles.dropdown, { top: 60, right: 15 }]}>
                        {isMobile &&
                          menuItems.map((item) => (
                            <TouchableOpacity
                              key={item.id}
                              style={styles.dropdownItem}
                              onPress={() => {
                                setUserMenuOpen(false);
                                router.push(item.href as any);
                              }}
                            >
                              <Text
                                style={[
                                  styles.dropdownText,
                                  pathname === item.href && { color: activeColor, fontWeight: "700" },
                                ]}
                              >
                                {item.label}
                              </Text>
                            </TouchableOpacity>
                          ))}

                        {isMobile && <View style={styles.separator} />}

                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            setUserMenuOpen(false);
                            router.push("/user/settings" as any);
                          }}
                        >
                          <AntDesign name="setting" size={16} color="#444" />
                          <Text style={styles.dropdownText}>Beállítások</Text>
                        </TouchableOpacity>

                        <View style={styles.separator} />

                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={handleLogout}
                        >
                          <AntDesign name="logout" size={16} color="#ff3b30" />
                          <Text style={[styles.dropdownText, { color: "#ff3b30" }]}>
                            Kijelentkezés
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              </View>
            ) : (
              isMobile && (
                <TouchableOpacity onPress={() => setMenuOpen(!menuOpen)}>
                  <AntDesign
                    name={menuOpen ? "close" : "menu"}
                    size={28}
                    color={activeColor}
                  />
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
                onPress={() => {
                  setMenuOpen(false);
                  router.push(item.href as any);
                }}
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
  navAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#fff",
  },
  rightActions: { marginLeft: 5 },
  title: { fontSize: 18, fontWeight: "bold" },
  navSection: { flexDirection: "row", alignItems: "center" },
  links: { flexDirection: "row", gap: 15 },
  link: { fontSize: 15, fontWeight: "600", color: "#444" },
  profileTrigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f7ff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  userName: { fontWeight: "700", fontSize: 14 },
  dropdown: {
    position: "absolute",
    backgroundColor: "#fff",
    width: 200,
    borderRadius: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    zIndex: 20000,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 10,
  },
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
});