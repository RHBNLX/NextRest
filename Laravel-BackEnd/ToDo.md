> # Egy kis help
>
>1,  composer create-project laravel/laravel notes //létrehozzuk
>
>(.env) :
>DB_CONNECTION=mysql //ez alapból sqlite, de mi mysql-t használunk, 
>DB_DATABASE=notes_db ->  //ez alapból laravel, de mi nem úgy szeretnénk elnevezni az adatbázist
>
> 2, cd notes // cd->Change Directory
>
> 3, php artisan install:api
>
> 4, composer update //ha nem frissítette magát automatikusan
>
> 5, php artisan make:migration create_notes_table //a notes többesszám! -> a laravel felismeri a többesszámot és a modellel később így kapcsolja össze a tábla nevét
>
> 6, php artisan migrate -> megcsinalja a le-nem futtatott migrationoket
>
> 7,  php artisan make:model Note
>
> 8, php artisan make:controller NoteController --api -> --api létrehozza a funkciókat benne, ki is lehet hagyni
>
>9, php artisan migrate:fresh //Szükség esetén, ha csináltunk még migration-t
>
>10, php artisan serve //elinditja a szervert a terminalban megjelenitett porton, oda kuldjuk a postot/getet/updatet, ->http://127.0.0.1:8000/api/notes

## jelenleg az első migration-t csinálod a courier-t

kész a couriers miration // Még van egy két dolog amit át kell dumálni

kész a orders migration // a csomag feladás és érkezés dátumma kell-e?

kész a order_status_history migration

## A modeleket írom: User, Courier, Order, Order_Status_History, Rating, Support_Ticket

Készek a modelek kb. majd azért nézd át őket

#### Következő munkák:

- Emperor-ral megbeszélni a dolgokat (done)
- Emperor-ral újra kéne brainstormingolni 
- Controllerek megírása (az alap feladatok megvannak (index, store, destroy (a put és a show még kérdéses, de valszeg fognak kelleni)), de még nincs benne semmi kavarás specko szabály rájuk ugymond)
. 
- github használat 


- enum-ok külön táblába írása KÉSZ VAN GECCOO (done) Kajak készen vannak
- ratingsben pivot tábla   (folyamatban) (UI.: ChatGPT szerint nem kell pivottá tenni, ezt mihamarabb dumáld le Emperoral. meg a Courier-ben van rating mező szóval kérdőjeles a a Rating-ben a courier_id jelenléte)
- api útvonalak (Kész az összes de még majd át kell dumálni, hogy mi kelljen és mi mehet kukába)
- factories megírása (A Rating-en kívül minden megvan)
- seeders megírása
