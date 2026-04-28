# NextRest – Csomagszállítási Platform

<div align="center">

![NextRest](https://img.shields.io/badge/NextRest-v1.0.0-blue)
![Status](https://img.shields.io/badge/Status-Active-green)

**Gyors és megbízható logisztikai megoldás – egy iskolai vizsgaremek.**

</div>

## Áttekintés

A NextRest egy modern, webalapú és mobilbarát csomagszállítási ökoszisztéma, amely három különböző felhasználói szerepkört támogat:

* **Ügyfelek:** Csomagküldés egyszerű indítása, díjkalkuláció és valós idejű nyomon követés.
* **Futárok:** Hatékony csomagfelvétel, útvonal-menedzsment és státuszfrissítés.
* **Adminisztrátorok:** Teljes körű kontroll a felhasználók, a futárflotta és a rendszerfolyamatok felett.

### Technológiai Stack

* **Frontend:** React Native + Expo (Web, iOS és Android támogatással)
* **Backend:** Laravel 11 (PHP 8.2+)
* **Adatbázis:** MySQL
* **Autentikáció:** Laravel Sanctum (Bearer token alapú biztonság)
* **API:** RESTful architektúra

---

## Főbb Funkciók

### Csomagkezelés
* **Egyszerűsített feladás:** Fix méretkategóriák (S, M, L) az átlátható árazásért.
* **Valós idejű követés:** A csomag útja a felvételtől a kézbesítésig monitorozható.
* **Reklamációkezelés:** Beépített visszaküldési folyamat és hibajegy-kezelés.
* **Előzmények:** Részletes naplózás a korábbi szállításokról.

### Felhasználói élmény
* **Gyors regisztráció:** Egyszerűsített onboarding folyamat.
* **Profilkezelés:** Személyre szabható adatok és avatar feltöltési lehetőség.
* **Értesítések:** Státuszváltozások nyomon követése.

### Futár modul
* **Rendeléskezelés:** Futárhoz rendelt csomagok listázása és elfogadása.
* **Munkaállapot:** Online/Offline kapcsoló a munkavégzés jelzésére.
* **Járműkezelés:** Járműadatok (típus, rendszám) rögzítése a rendszerben.

### Adminisztrációs felület
* **Felhasználókezelés:** CRUD műveletek (létrehozás, módosítás, tiltás).
* **Statisztika:** Napi és összesített bevételi adatok, aktív rendelések száma.
* **Support Center:** Élő chat alapú ügyfélszolgálat és moderáció.

---

## Telepítés és Futtatás

### Rendszerkövetelmények
* **Frontend:** Node.js (16+), npm vagy yarn.
* **Backend:** PHP 8.2+, Composer, MySQL 8.0+.

### Fejlesztői környezet beállítása

1.  **Backend indítása:**
    ```bash
    cd Laravel-BackEnd
    composer install
    cp .env.example .env    # Konfiguráld az adatbázis elérhetőséget
    php artisan migrate --seed
    php artisan serve
    ```

2.  **Frontend indítása:**
    ```bash
    cd Expo-FrontEnd
    npm install
    npx expo start
    ```

---

## Biztonság és Adatvédelem

A rendszer fejlesztése során kiemelt figyelmet fordítottunk a biztonságra:
* **RBAC (Role-Based Access Control):** Szigorú szerepkör-alapú jogosultságkezelés.
* **Management Code:** Az adminisztrátori belépéshez egy extra biztonsági kód szükséges.
* **Adatvédelem:** BCrypt jelszó-hashing és automatizált SQL injection védelem (Eloquent ORM).
* **Validáció:** Szigorú szerveroldali bemeneti ellenőrzés minden API végponton.

---

## API Végpontok (Példa)

| Metódus | Végpont | Leírás |
| :--- | :--- | :--- |
| `POST` | `/api/login` | Bejelentkezés és token generálás |
| `POST` | `/api/orders` | Új csomagszállítás rögzítése |
| `GET` | `/api/user/tickets` | Felhasználó hibajegyeinek lekérése |
| `PUT` | `/api/orders/{id}` | Rendelés állapotának módosítása |

---

**Utolsó frissítés:** 2026. 04. 27.  
**Verzió:** 1.0.0  
