# NextRest - Csomagszállítási Platform

<div align="center">

![NextRest](https://img.shields.io/badge/NextRest-v1.0.0-blue)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

**A gyors, megbízható csomagszállítási platform - egy iskolai projektből amit majdnem elvetettünk**

[Jellemzők](#jellemzők) • [Telepítés](#telepítés) • [Felhasználás](#felhasználás) • [API Dokumentáció](#api-dokumentáció)

</div>

---

## 📋 Tartalomjegyzék

- [Áttekintés](#áttekintés)
- [Jellemzők](#jellemzők)
- [Rendszer Követelmények](#rendszer-követelmények)
- [Telepítés](#telepítés)
- [Felhasználási Útmutató](#felhasználási-útmutató)
- [Admin Panel Útmutató](#admin-panel-útmutató)
- [Futár Útmutató](#futár-útmutató)
- [Felhasználó Útmutató](#felhasználó-útmutató)
- [API Dokumentáció](#api-dokumentáció)
- [Biztonsági Információk](#biztonsági-információk)
- [Fejlesztőknek](#fejlesztőknek)

---

## 🎯 Áttekintés

**NextRest** egy modern, webalapú csomagszállítási platform, amely három fő szereplőt támogat:

- **🛡️ Adminisztrátorok** - Teljes felügyeletet biztosít felhasználók, futárok és rendelések felett
- **🚚 Futárok** - Csomagok felvétele, szállítása és kézbesítése
- **👤 Felhasználók** - Csomagok küldése és rendelések nyomon követése

### Technológiai Stack

- **Frontend:** React Native + Expo (Web, iOS, Android)
- **Backend:** Laravel 11
- **Adatbázis:** MySQL
- **Autentifikáció:** Laravel Sanctum (Bearer Tokens)
- **API:** RESTful

---

## ✨ Jellemzők

### 📦 Csomagkezelés
- Csomagok küldésének kezdeményezése (S, M, L méretek)
- Rendelések nyomon követése valós időben
- Csomagok visszaküldésének kezelése
- Rendelés előzmények megtekintése

### 👥 Felhasználókezelés
- Regisztráció és bejelentkezés
- Felhasználói profil szerkesztése
- Avatar feltöltés
- Telefonszám módosítás

### 🚀 Futár Funkcionalitás
- Rendelések felvétele
- Státusz frissítés (Felvéve → Szállítás alatt → Kézbesítve)
- Járműadatok kezelése
- Online/Offline státusz management

### 🛠️ Admin Felügyelet
- Felhasználók kezelése (létrehozás, szerkesztés, törlés)
- Futárok kezelése
- Rendelések monitorozása
- Support jegyek kezelése
- Statisztikák és jelentések
- Support chat moderálás

### 💬 Support Rendszer
- Hibajegyek létrehozása
- Élő chat támogatás
- Rendszer moderálása (admin)
- Jegyek státusza: Nyitott, Folyamatban, Megoldva, Lezárva

### 🔐 Biztonsági Funkciók
- Szerep-alapú hozzáférés-vezérlés (RBAC)
- Admin kódolású belépés
- Bearer token alapú autentifikáció
- Szenzitív adatok titkosítása
- HTTPS kommunikáció

---

## 💻 Rendszer Követelmények

### Frontend (Expo)
- Node.js 16+
- npm vagy yarn
- Android Studio / Xcode (mobil fejlesztéshez)

### Backend (Laravel)
- PHP 8.2+
- Composer
- MySQL 8.0+
- Git

---

## 🚀 Telepítés

### Frontend Telepítése

```bash
# Klónozás
git clone https://github.com/yourusername/NextRest.git
cd NextRest/Expo-FrontEnd

# Függőségek telepítése
npm install

# Környezeti változók beállítása
cp .env.example .env.local
# Szerkessze a .env.local fájlt az API URL-el:
# EXPO_PUBLIC_API_URL=https://api.nextrest.hu/api

# Fejlesztési szerver indítása
npm start
# Web: npx expo start
```

### Backend Telepítése

```bash
# Klónozás
cd NextRest/Laravel-BackEnd

# Függőségek telepítése
composer install

# Környezeti változók beállítása
cp .env.example .env
php artisan key:generate

# Adatbázis migrálása és seedering
php artisan migrate:fresh --seed

# Admin felhasználó létrehozása (opcionális)
php artisan tinker
# Majd a tinker shellben:
# User::create(['name' => 'Admin', 'email' => 'admin@nextrest.hu', 'password' => Hash::make('password'), 'role' => 'admin']);

# Fejlesztési szerver indítása
php artisan serve
```

---

## 📖 Felhasználási Útmutató

### 🔑 Bejelentkezés / Regisztráció

#### Regisztráció (Első lépés)

1. Nyissa meg az alkalmazást
2. Kattintson a **"Regisztráció"** gombra a főoldalon
3. Töltse ki az alábbi adatokat:
   - **Teljes név:** Az Ön valós neve
   - **Email cím:** Érvényes email cím
   - **Jelszó:** Minimum 8 karakter
   - **Telefonszám:** Érvényes magyar telefonszám (+36, 06, 0036 formátumok)

4. Kattintson a **"Regisztráció"** gombra
5. Az adatok validálása után automatikusan átirányítjuk a bejelentkezési oldalra

#### Bejelentkezés

1. Nyissa meg az alkalmazást
2. Válassza a **"Bejelentkezés"** lehetőséget
3. Adja meg email és jelszó:
   - **Email cím:** Regisztrációkor használt email
   - **Jelszó:** Regisztrációkor beállított jelszó

4. Kattintson a **"Belépés"** gombra

**⚠️ Admin Belépés:** Ha admin fiók van (különleges menedzsment kóddal), egy extra lépésben meg kell adnia a menedzsment kódot.

---

## 👤 Felhasználó Útmutató

### Főoldal Funkcionalitása

Az alkalmazás nyitóoldala 3 fő szekciót tartalmaz:

#### 1. **Árazási Opcók**
- **S (Kicsi):** 990 Ft - Max 5 kg
- **M (Közepes):** 1,490 Ft - Max 15 kg (AJÁNLOTT)
- **L (Nagy):** 2,190 Ft - Max 30 kg

#### 2. **Vezérlőpult**
Az "Vezérlőpult" menüre kattintva megtalálható:
- Az Ön összes szállítási rendelése
- Rendelés státusza
- Szállítási címek
- Ár és követésszám

### 📦 Csomagküldés Folyamata

#### 1. Lépés: Csomagküldés Kezdeményezése

```
1. Kattintson a főoldalon a "Csomagküldés" gombra
2. Vagy válassza a felső menüben a "Csomagküldés" opciót
```

#### 2. Lépés: Szállítási Adatok Megadása

Kitöltendő adatok:

**FELVÉTELI CÍM:**
- Irányítószám (4 számjegy)
- Város/Község
- Utca és házszám
- Emelet/Ajtó (opcionális)

**SZÁLLÍTÁSI CÍM:**
- Irányítószám (4 számjegy)
- Város/Község
- Utca és házszám
- Emelet/Ajtó (opcionális)

#### 3. Lépés: Csomag Méretének Kiválasztása

Válassza a méreteket az árazás alapján:
- S, M vagy L

#### 4. Lépés: Rendelés Megerősítése

- Ellenőrizze az adatokat
- Kattintson a "Rendelés létrehozása" gombra
- Az Ön rendelésszáma a Vezérlőpulton jelenik meg

### 🔄 Csomagok Nyomon Követése

A **Vezérlőpulton** láthatók az összes rendelések:

```
Rendelés Státusza:
- 📋 Feldolgozás alatt: Az admin még nem rendelt futárt
- 🚗 Úton: A futár már felvette a csomagot
- ✅ Kiszállítva: Sikeresen leszállították
```

### ↩️ Csomag Visszaküldése

Ha nem elégedett a szállítmánnyal:

1. Nyissa meg a **"Csomag visszaküldése"** menüt
2. Válassza ki a visszaküldeni kívánt rendelést
3. Jelölje meg a visszaküldés okát:
   - Sérült termék
   - Hibás termék érkezett
   - Nem felel meg a leírásnak
   - Egyéb ok

4. Kattintson a **"Visszaküldés kérelmezése"** gombra
5. Egy admin majd feldolgozza a kérelmet

### ⚙️ Beállítások és Profil

A **"Beállítások"** oldalon módosítható:
- Teljes név
- Telefonszám
- Avatar (profilkép)
- Email cím (csak megtekintés)

---

## 🚚 Futár Útmutató

### Bejelentkezés

1. Válassza a futár email-cím és jelszó megadása
2. Az alkalmazás automatikusan átirányít a futár vezérlőpultra

### 📊 Futár Vezérlőpult

#### Rendelések Megtekintése

A vezérlőpulton láthatók az Ön felé rendelt szállítások:

```
Státusz szerint szűrve:
- 📍 Felvétel: A csomag felvételre vár
- 🚚 Szállítás alatt: Már felvette, szállítás alatt
- ✅ Kézbesítve: Már kézbesített
```

#### Járműadatok Kezelése

Beállíthatja:
- **Járműtípus:** Kerékpár, Motor, Autó, Teherautó
- **Rendszám:** Járműve rendszáma
- **Státusz:** Online/Offline

### 🚀 Szállítási Folyamat

#### 1. Rendelés Felvétele

```
1. Válassza ki a rendelést a listából
2. Ellenőrizze a felvételi és szállítási adatokat
3. Kattintson a "Felvétel" gombra
4. A státusz: Feldolgozás alatt → Felvett
```

#### 2. Szállítás alatt Státusz

```
1. Az alkalmazás a "Szállítás alatt" státuszba helyezi
2. A felhasználó nyomon követheti az Ön helyzetét
3. Ő azonosítja az Ön helyzetét a térképen
```

#### 3. Kézbesítés

```
1. A szállítási helyre érkezés után
2. Kattintson a "Kézbesítve" gombra
3. Az ügyfél megerősítésre szólít fel
4. Státusz: ✅ Kézbesítve
```

### 📱 Online/Offline Kezelés

Az **"Aktív/Offline"** kapcsolóval:
- **Aktív (zöld):** Fogadhat új rendeléseket
- **Offline (szürke):** Nem fogadhat új rendeléseket

### 💬 Support Chat

Ha problémájuk van:
1. Kattintson a **"Támogatás"** menüre
2. Vagy nyisson egy új support jegyet az adminnak
3. Az admin válaszolhat a chat-en keresztül

---

## 🛡️ Admin Panel Útmutató

### 🔐 Admin Bejelentkezés

```
1. Email és jelszó megadása
2. Menedzsment kód megadása (extra biztonsági lépés)
3. Automatikus átirányítás az admin vezérlőpultra
```

### 📊 Admin Vezérlőpult

Az admin vezérlőpult áttekintést nyújt:

```
Statisztikák:
- 👥 Összes felhasználó: Az összes regisztrált felhasználó
- 🟢 Aktív felhasználók: Az elmúlt 30 napban bejelentkezett
- 📦 Összes rendelés: Rendszer összes rendelése
- ⏳ Függőben lévő rendelések: Még fel nem vett
- 🚗 Aktív futárok: Online futárok
- 💬 Nyitott support jegyek: Feldolgozásra vár
- 💰 Napi bevétel: Mai napra
- 💸 Összes bevétel: Teljes bevétel
```

### 👥 Felhasználók Kezelése

#### Felhasználók Listája

```
1. Kattintson a "Felhasználók kezelése" menüre
2. Keresés: Név vagy email alapján szűrhetők
3. Szűrés: Szerep alapján (Admin, Futár, Ügyfél)
```

#### Felhasználó Szerkesztése

```
1. Kattintson a felhasználó neve mellett a szerkesztés ikonra
2. Módosítható: Név, szerep
3. Kattintson a "Mentés" gombra
```

#### Felhasználó Törlése

```
1. Kattintson a felhasználó neve mellett a törlés ikonra
2. Megerősítés a törlésre
3. A felhasználó és adatai törlésre kerülnek
```

### 🚚 Futárok Kezelése

#### Futár Profil Megtekintése

```
1. Nyissa meg a "Futárok kezelése" menüt
2. Látható: Név, státusz, járműtípus, aktív rendelések
```

#### Futár Hozzáadása

```
1. Kattintson a "Futár hozzáadása" gombra
2. Válassza ki az ügyfelet, aki futár lesz
3. Adja meg a járműadatokat
4. Kattintson a "Mentés" gombra
```

### 📦 Rendelések Kezelése

#### Rendelések Szűrése

```
Státusz szerint:
- ⏳ Függőben: Futár felé nem rendelt
- 🎯 Rendelt: Futár felé rendelt, de nem vette fel
- 📍 Felvéve: Futár már felvette
- 🚚 Szállítás alatt: Szállítás alatt van
- ✅ Kézbesítve: Kézbesítésre került
- ❌ Törölve: Törölt rendelések
```

#### Rendelés Szerkesztése

```
1. Kattintson a rendelés ID-jára
2. Módosítható adatok: Státusz, futár hozzárendelés
3. Kattintson a "Frissítés" gombra
```

### 💬 Support Jegyek Kezelése

#### Jegy Megtekintése és Megválaszolása

```
1. Nyissa meg a "Support jegyek" menüt
2. Válassza ki a jegyet
3. Olvassa el az ügyfél üzeneteit
4. Írjon választ a chat-be
5. Kattintson a "Küldés" gombra
```

#### Jegy Státusza

```
- 🔴 Nyitott: Feldolgozásra vár
- 🟡 Folyamatban: Admin dolgozik rajta
- 🟢 Megoldva: Probléma megoldódott
- ⚪ Lezárva: Ügyfél lezárta
```

#### Jegy Lezárása

```
1. A jegy párbeszédében
2. Kattintson a "Jegy lezárása" gombra
3. A jegy már nem fogad üzeneteket
```

### 📈 Statisztikák és Jelentések

#### Rendelés Statisztika

```
- Összes rendelés: Napi, heti, havi lebontás
- Átlagos ár: Rendelések átlagos értéke
- Sikeres kézbesítések: Százalékos arány
- Törölt rendelések: Feldolgozás nélküli rendelések
```

#### Felhasználó Statisztika

```
- Új felhasználók: Napi/heti/havi
- Aktív felhasználók: Bejelentkezett felhasználók
- Deaktivált fiókok: Törölt felhasználók
```

---

## 🔌 API Dokumentáció

### 🔑 Autentifikáció

Összes API kérésnek tartalmaznia kell az **Authorization** headert:

```bash
Authorization: Bearer {access_token}
```

### 📝 API Végpontok

#### Autentifikáció

```
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "mgmt_code": "optional_for_admin"
}

Response:
{
  "access_token": "token_string",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "customer",
    "avatar_url": "url_or_null"
  }
}
```

#### Felhasználó Registráció

```
POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "phone_number": "+36301234567",
  "role": "customer"
}
```

#### Rendelések Kezelése

```
GET /api/orders/user/{userId}
- Felhasználó rendeléseit lekéri
- Szükséges: Autentifikáció

POST /api/orders
- Új rendelés létrehozása
- Body: { user_id, courier_id, pickup_address, dropoff_address, package_size, price }

GET /api/orders
- Összes rendelés (admin csak)

PUT /api/orders/{id}
- Rendelés módosítása

DELETE /api/orders/{id}
- Rendelés törlése
```

#### Support Jegyek

```
GET /api/user/tickets
- Felhasználó support jegyei

POST /api/support_tickets
- Új support jegy létrehozása

GET /api/support_tickets
- Összes jegy (admin csak)

PUT /api/support_tickets/{id}
- Jegy módosítása (státusz)

GET /api/chat
- Chat üzenetek

POST /api/chat
- Üzenet küldése
```

---

## 🔐 Biztonsági Információk

### ✅ Megvalósított Biztonsági Funkciók

1. **Szerep-Alapú Hozzáférés-Vezérlés (RBAC)**
   - Admin, Futár, Felhasználó szerepek
   - Frontend route protection
   - Backend API protection

2. **Autentifikáció & Autorizáció**
   - Laravel Sanctum Bearer tokens
   - Admin kódolású belépés
   - Token blacklisting on logout

3. **Adatbiztonság**
   - Jelszó hash (bcrypt)
   - HTTPS kommunikáció
   - Szenzitív adatok titkosítása

4. **API Biztonság**
   - CORS konfigurálva
   - Input validáció
   - SQL injection védelem (Eloquent ORM)

### ⚠️ Biztonsági Javaslatok

1. **Jelszó Kezelés**
   - Minimum 8 karakter hossz
   - Összetett jelszavak ajánlottak
   - Rendszeres jelszó módosítás

2. **Biztonsági Kódok**
   - Admin kód biztonságban tartása
   - Rendszeres megváltoztatás
   - Csak szükséges személyeknek ismert

3. **Szülői Monitoring**
   - Support jegyek és chat üzenetek mentése
   - Felhasználói magatartás nyomon követése
   - Gyanús tevékenység jelentése

---

## 👨‍💻 Fejlesztőknek

### Projekt Struktúra

```
NextRest/
├── Expo-FrontEnd/
│   ├── app/                    # Expo Router pages
│   │   ├── auth/               # Bejelentkezés/Regisztráció
│   │   ├── user/               # Ügyfél oldalak
│   │   ├── courier/            # Futár oldalak
│   │   ├── mgmt/               # Admin oldalak
│   │   └── components/         # Újrahasználható komponensek
│   ├── context/                # React Context (Auth)
│   ├── api/                    # API hívások (Axios)
│   ├── hooks/                  # Custom hooks
│   └── package.json
│
├── Laravel-BackEnd/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/    # Kontroller osztályok
│   │   │   ├── Middleware/     # Middleware (RBAC)
│   │   │   └── Requests/       # Request validáció
│   │   ├── Models/             # Adatbázis modellek
│   │   └── Enums/              # Felhasználási státuszok
│   ├── routes/
│   │   ├── api.php             # API routes
│   │   └── web.php             # Web routes
│   ├── database/
│   │   ├── migrations/         # Adatbázis táblák
│   │   └── seeders/            # Test adatok
│   └── composer.json
│
└── README.md (ez a fájl)
```

### Fejlesztési Szerver Indítása

```bash
# Terminal 1 - Frontend
cd Expo-FrontEnd
npm start

# Terminal 2 - Backend
cd Laravel-BackEnd
php artisan serve

# Optional Terminal 3 - Cloudflared túnel
# c Cloudflared-BackEnd
cloudflared tunnel run nextrest
```

### Kulcs Fájlok és Mappák

- **Frontend Route Protection:** `Expo-FrontEnd/hooks/useProtectedRoute.ts`
- **Frontend Page Titles:** `Expo-FrontEnd/hooks/usePageTitle.ts`
- **Backend RBAC Middleware:** `Laravel-BackEnd/app/Http/Middleware/CheckRole.php`
- **API Routes:** `Laravel-BackEnd/routes/api.php`

### Hozzájárulás

Szívesen elfogadunk pull requesteket! Kérjük, hogy:

1. Fork-olja a projektet
2. Hozzon létre egy feature branch-et (`git checkout -b feature/AmazingFeature`)
3. Commitolja a módosítást (`git commit -m 'Add some AmazingFeature'`)
4. Pushol-ja a branch-et (`git push origin feature/AmazingFeature`)
5. Nyisson egy Pull Request

---

## 📞 Támogatás & Kapcsolat

- **Email:** support@nextrest.hu
- **Support Platform:** Az alkalmazáson belüli support rendszer
- **Issues:** GitHub Issues

---

## 📄 Licenc

Ez a projekt MIT licenc alatt van. Lásd a [LICENSE](LICENSE) fájlt további információért.

---

## 🙏 Köszönetnyilvánítás

Köszönöm a NextRest csapatnak:
- Kiss Imre Marcell
- Miklós Ilián Richárd

Garantáljuk, hogy a csomagod épségben célba ér! 🎁

---

**Utolsó frissítés:** 2026-04-27  
**Verzió:** 1.0.0  
**Status:** Aktív fejlesztés alatt
