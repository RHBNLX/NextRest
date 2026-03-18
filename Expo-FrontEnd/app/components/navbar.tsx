import AntDesign from "@expo/vector-icons/AntDesign";
import type { Href } from "expo-router";
import { router, usePathname } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface NavbarProps {
  title: string;
}
export default function CustomNavbar({ title }: NavbarProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const showMenu = !isMobile || menuOpen;
  const menuItems: { id: string; label: string; href: Href }[] = [
    { id: "home", label: "Home", href: "/" },
    { id: "register", label: "Register", href: "/auth/register" },
    { id: "login", label: "Login", href: "/auth/login" },
  ];

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>

        {isMobile && (
          <TouchableOpacity
            onPress={() => setMenuOpen((prev) => !prev)}
            activeOpacity={0.9}
          >
            <AntDesign name="menu" size={25} color="#007Aff" />
          </TouchableOpacity>
        )}

        {showMenu && (
          <View style={[styles.links, isMobile && styles.mobileMenu]}>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <TouchableOpacity
                  key={item.id}
                  disabled={isActive}
                  onPress={() => {
                    setMenuOpen(false);
                    router.push(item.href);
                  }}
                  activeOpacity={0.3}
                >
                  <Text style={[styles.link, isActive && styles.activeLink]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#ffffff",
    zIndex: 9999,
  },
  container: {
    height: 60,
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderBottomColor: "#DDDDDD",
  },
  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#007Aff",
  },
  links: {
    flexDirection: "row",
    gap: 30,
  },
  mobileMenu: {
    position: "absolute",
    top: 60,
    right: 15,

    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },

  link: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007Aff",
    paddingVertical: 6,
  },
  activeLink: {
    opacity: 0.4,
  },
});
