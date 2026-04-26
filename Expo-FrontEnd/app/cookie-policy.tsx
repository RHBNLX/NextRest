import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import CustomNavbar from './components/navbar';
import CustomFooter from './components/footer';

export default function CookiePolicy() {
  return (
    <View style={styles.container}>
      <CustomNavbar title="Cookie Irányelvek" />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Cookie (Süti) és Adatkezelési Tájékoztató</Text>
        <Text style={styles.date}>Utoljára frissítve: 2024.05.20.</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Mik azok a sütik?</Text>
          <Text style={styles.text}>
            A sütik (cookie-k) kisméretű adatfájlok, amelyek a webhely böngészése során kerülnek az Ön eszközére. 
            Segítenek a felhasználói élmény javításában és a bejelentkezési munkamenet fenntartásában.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Hogyan használjuk a hitelesítést?</Text>
          <Text style={styles.text}>
            Alkalmazásunk úgynevezett <Text style={{fontWeight: '700'}}>Bearer Token</Text> alapú hitelesítést használ. 
            Sikeres bejelentkezés után egy titkosított azonosítót tárolunk el az Ön böngészőjében (LocalStorage vagy SecureStore), 
            amely lehetővé teszi, hogy minden kérésnél azonosítsuk Önt anélkül, hogy újra be kellene jelentkeznie.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Használt technológiák</Text>
          <View style={styles.bulletPoint}>
            <Text style={styles.text}>• <Text style={{fontWeight: 'bold'}}>Munkamenet sütik:</Text> Szükségesek a rendszer alapvető működéséhez.</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.text}>• <Text style={{fontWeight: 'bold'}}>Token tárolás:</Text> A bejelentkezési adatok biztonságos, JWT (JSON Web Token) alapú kezelése.</Text>
          </View>
          <View style={styles.bulletPoint}>
            <Text style={styles.text}>• <Text style={{fontWeight: 'bold'}}>Funkcionális adatok:</Text> Az Ön által választott beállítások megjegyzése.</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Az adatok biztonsága</Text>
          <Text style={styles.text}>
            A projekt iskolai keretek között készül, az adatokat harmadik félnek nem adjuk át. 
            A Bearer tokent kizárólag az API kommunikációhoz használjuk fel, SSL titkosításon keresztül.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. A sütik kezelése</Text>
          <Text style={styles.text}>
            Ön bármikor törölheti a böngészőjében tárolt adatokat a "Kijelentkezés" gombbal vagy a böngésző 
            beállításaiban a gyorsítótár ürítésével. Ebben az esetben a hitelesítési token elveszik, és újra be kell jelentkeznie.
          </Text>
        </View>

      </ScrollView>
      <CustomFooter />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 30, maxWidth: 800, alignSelf: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10, color: '#1a1a1a' },
  date: { fontSize: 14, color: '#666', marginBottom: 30 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10, color: '#007aff' },
  text: { fontSize: 16, lineHeight: 24, color: '#444', textAlign: 'justify' },
  bulletPoint: { marginLeft: 10, marginTop: 5 }
});