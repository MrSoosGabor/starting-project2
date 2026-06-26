# TinyNotes - SPEC

## 1. Cel es hatokor

Ez a dokumentum a TinyNotes alkalmazas fejlesztesi specifikacioja.

Kotelezo technologia:
- Bun
- TypeScript
- Next.js (App Router)
- TailwindCSS
- TipTap (rich text editor)
- better-auth (hitelesites)
- SQLite (fajl alapu adatbazis)

Funkcionalis cel:
- Felhasznalok regisztracioja es bejelentkezese
- Jegyzetek letrehozasa, szerkesztese, torlese, listazasa
- Jegyzet publikus megosztasa tokenes linken
- Megosztas letiltasa a letrehozo altal
- Nem hitelesitett felhasznalok olvashatjak az aktivan megosztott jegyzeteket

Megjegyzes:
- Nincs jelszo-visszaallitas
- Nincs email megerosites
- Nincs email kuldes
- Nincs fajltarolas (kep/fajl feltoltes)

## 2. Fogalmak

- Tulajdonos: aki a jegyzetet letrehozta.
- Megosztott jegyzet: olyan jegyzet, amelyhez aktiv publikus token tartozik.
- Aktiv megosztas: a token ervenyes, a jegyzet olvashato publikusan.
- Letiltott megosztas: a tokenhez tartozo publikacio inaktiv.

## 3. Fobb use case-ek

1. Regisztracio email + jelszo alapon.
2. Bejelentkezes email + jelszo alapon.
3. Auth user uj jegyzetet hoz letre.
4. Auth user szerkeszti a jegyzet cimet es rich text tartalmat.
5. Auth user torli a sajat jegyzetet.
6. Auth user aktiv megosztast kapcsol egy jegyzethez.
7. Auth user letiltja a megosztast.
8. Vendeg user megnyitja a /s/[token] oldalt es olvas.
9. Ervenytelen/letiltott tokennel 404 jelenik meg.

## 4. Oldalterkep es routing

Publikus route-ok:
- /login
- /register
- /s/[token]

Authot igenylo route-ok:
- /notes
- /notes/new
- /notes/[id]

Gyoker route:
- / -> ha van session: /notes, kulonben: /login

Hibaoldalak:
- Egyedi 404 oldal kotelezo

## 5. Jogosultsag es hozzaferes

Alapszabalyok:
- Egy jegyzetet csak a tulajdonos listazhat, szerkeszthet, torolhet, oszthat meg vagy tilthat le.
- A publikus /s/[token] oldalon csak aktiv megosztasu jegyzet erheto el.
- Auth nelkuli user nem erheti el a /notes alatti route-okat.

Elvart viselkedes:
- /notes* auth nelkul -> redirect /login
- Nem sajat note id elerese auth userkent -> 404 vagy forbidden-szeru altalanos hiba (ne szivarogjon informacio)

## 6. Rich text modell (TipTap)

Editor:
- TipTap StarterKit hasznalata
- Link extension engedelyezett
- Csak http/https link protokollok engedelyezettek

Tarolas:
- A jegyzet tartalma TipTap JSON formatumban tarolodik (TEXT oszlopban serializalva)
- Max payload meret: 256 KB / jegyzet tartalom

Megjelenites:
- Szerveren: TipTap JSON -> HTML
- A HTML minden esetben sanitize-olva legyen, kulonosen publikus nezetben

Minimalis engedelyezett HTML elemek:
- p, br, strong, em, u, s, a, h1, h2, h3, ul, ol, li, blockquote, pre, code

Minimalis engedelyezett attributumok:
- a[href, target, rel]

## 7. Adatbazis es schema (SQLite)

Megvalositasi elv:
- Raw SQL (nem ORM)
- Migracios SQL fajlok
- Kulon migraciofuttato script

### 7.1 better-auth tablakszerkezet

A better-auth altal elvart tablakat hozni kell:
- user
- session
- account
- verification

Megjegyzes:
- A pontos mezoket a better-auth aktualis SQLite schemaja szerint kell generalni.
- A projekt indulaskor a csapat rögzitse a konkret verziohoz tartozo schema snapshotot.

### 7.2 Alkalmazas tablak

Tabla: note
- id TEXT PRIMARY KEY
- user_id TEXT NOT NULL (FK -> user.id ON DELETE CASCADE)
- title TEXT NOT NULL DEFAULT ''
- content_json TEXT NOT NULL
- share_enabled INTEGER NOT NULL DEFAULT 0
- created_at TEXT NOT NULL
- updated_at TEXT NOT NULL

Index:
- (user_id, updated_at DESC)

Tabla: note_share
- id TEXT PRIMARY KEY
- note_id TEXT NOT NULL (FK -> note.id ON DELETE CASCADE)
- token_hash TEXT NOT NULL UNIQUE
- enabled INTEGER NOT NULL DEFAULT 1
- created_at TEXT NOT NULL
- disabled_at TEXT NULL

Index:
- (note_id)

Tabla: schema_migrations
- version TEXT PRIMARY KEY
- applied_at TEXT NOT NULL

### 7.3 Tokenkezeles

- Publikus token generalasa: kriptografiai erossegu random ertek
- Tarolas: csak token_hash (pl. SHA-256)
- Kliensnek egyszer a nyers tokenes URL adodik vissza
- Feloldas: bejovo token hash-elese es hash alapjan kereses

## 7.4 Migrations

### Folder layout

* `migrations/0001_init.sql`, `0002_notes.sql`, etc.
* `scripts/migrate.ts`:

  * Ensures `schema_migrations` exists.
  * Reads migration files sorted by filename.
  * Applies each within a transaction.
  * Records applied version (filename) with timestamp.
  * On failure: rollback and exit non-zero.

### Migration content

* 0001: better-auth tables + indexes.
* 0002: `note`, `note_share`, indexes.


## 8. Alkalmazas retegzes

Javasolt mappaszint (iranyelv):
- app/ (oldalak)
- lib/auth/ (better-auth konfiguracio, session helper)
- lib/db/ (sqlite kliens es query helper)
- lib/notes/ (note repository + domain logika)
- lib/share/ (token kezeles + publikus feloldas)
- lib/editor/ (TipTap JSON validacio, HTML render + sanitize)
- actions/ (Server Actionok)

## 9. Szerver oldali muveletek (Server Actions)

Kotelezo actionok:
- createNoteAction
- updateNoteAction
- deleteNoteAction
- enableShareAction
- disableShareAction

Kotelezo ellenorzesek minden actionben:
- ervenyes session
- tulajdonjog ellenorzes
- input validacio (tipus, meret, ures ertekek)
- altalanos, nem szivarogtato hibauzenetek

Javasolt valasz forma:
- success: { ok: true, data: ... }
- error: { ok: false, error: { code, message } }

## 10. Publikus megjelenites

Route: /s/[token]

Mukodes:
1. Token hash elokeszitese
2. Aktiv share rekord keresese
3. Kapcsolodo note betoltese
4. TipTap JSON -> HTML -> sanitize
5. Renderelt jegyzet visszaadasa

Ha barmely lepesnel nincs ervenyes adat:
- 404

Fontos:
- Ugyanaz a 404 viselkedes legyen ervenytelen tokenre, letiltott megosztasra es nem letezo jegyzetre.

## 11. UI/UX kovetelmenyek

Altalanos:
- TailwindCSS hasznalat
- Mobil es desktop nezet tamogatasa
- Jol olvashato editor es olvaso nezet

Oldalak:
- Login oldal (email, jelszo)
- Register oldal (nev opcionalis, email, jelszo)
- Notes lista oldal
- Uj jegyzet oldal
- Jegyzet reszletek oldal (editor + megosztas kapcsolo + share URL masolas)
- Publikus olvaso oldal

Allapotok:
- ures lista allapot
- mentes folyamatban / mentve / mentesi hiba allapot
- altalanos hiba banner

## 12. Autosave kovetelmeny

Kliens oldalon:
- Debounce: 800-1200 ms
- Csak valtozas eseten kuldjon mentesi kerelmet

Szerver oldalon:
- Reszleges update tamogatott
- updated_at frissul
- Meretkorlat ellenorzese

## 13. Biztonsag

Kotelezo minimum:
- Session cookie biztonsagos beallitasok (httpOnly, sameSite)
- CSRF kockazat kezelese better-auth ajanlas szerint
- XSS vedelem sanitize-on keresztul
- Ervenytelen auth hibak altalanosak legyenek
- Nincs SQL hiba reszlet kliensnek

Header minimum javaslat:
- Content-Security-Policy
- Referrer-Policy: no-referrer
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY

## 14. Nem funkcionalis kovetelmenyek

- TypeScript strict mod
- Konzisztens lint/format
- Kodolasi standard: egyszeru, olvashato, modularis
- Dokumentalt migraciok
- Legalabb alap smoke teszt forgatokonyvek

## 15. Elfogadasi kriteriumok

1. Regisztracio es login mukodik email+jelszo alapon.
2. Session fennmarad oldalujratoltes utan.
3. Auth user kepes note letrehozasra, szerkesztesre, torlesre.
4. /notes listaz aktualis userre, updated_at szerint csokkeno sorrendben.
5. Megosztas engedelyezese utan a /s/[token] auth nelkul olvashato.
6. Megosztas letiltasa utan ugyanez a link 404-et ad.
7. Publikus oldalon csak sanitize-olt HTML renderelodik.
8. Nem hitelesitett user /notes* alatt /login-ra kerul.
9. Egyedi 404 oldal jelenik meg.
10. Kliens hiba uzenetek altalanosak, belso reszletek nelkul.

## 16. Szallitando elemek a csapatnak

- Futathato Next.js projekt Bun futtatokornyezettel
- SQL migraciok (better-auth + notes)
- Better-auth konfiguracio credentials loginra
- TipTap editor integracio
- Publikus share oldal token feloldassal
- Dokumentalt kornyezeti valtozok

## 17. Kornyezeti valtozok (minimum)

- AUTH_SECRET
- APP_URL (pl. http://localhost:3000)
- DB_PATH (pl. ./data/tinynotes.db)

## 18. Implementacios sorrend (ajanlott)

1. DB migraciok + better-auth alap beuzemelese
2. Auth oldalak es session guard
3. Notes CRUD server oldalon
4. TipTap editor + autosave
5. Share token kezeles + publikus oldal
6. Sanitizer + biztonsagi finomitasok
7. UX allapotok + 404 oldal
8. Smoke tesztek

## 19. Nyitott dontesek (ha gyorsitani kell)

Ha nincs kulon termekdontes, az alabbi alapertelmezett:
- Egy jegyzethez egy aktiv megosztasi token tartozik.
- Letiltas utan ugyanaz a token ujraengedelyezheto.
- Cimsor kotelezo, de lehet ures stringgel inicializalva.
- Note tartalom kezdoertek: ures TipTap dokumentum.

---

Ez a SPEC celzottan fejlesztoi atadasra keszult. A csapat a reszleteket a valasztott better-auth es TipTap pontos verziojahoz igazitja, de a funkcionalis es biztonsagi kovetelmenyek kotelezoek.