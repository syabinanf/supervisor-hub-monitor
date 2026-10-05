# DESIGN SYSTEM & SPESIFIKASI UI — ANTERAJA HUB DWELL MONITOR

Dokumen ini mendokumentasikan spesifikasi desain antarmuka, tokens, tata letak, komponen, dan state UI untuk aplikasi **Anteraja Hub Dwell Monitor** berdasarkan Stitch project dan screen final yang telah disetujui.

> **Catatan:** Dokumen ini bersifat referensi implementasi *read-only* dari Stitch. Tidak ada perubahan yang dilakukan pada project atau canvas di Stitch.

---

## 1. Referensi Project & Screen Stitch

| Entitas | Detail / ID |
| :--- | :--- |
| **Project Name** | `projects/17295965612249502653` |
| **Project Title** | Anteraja Hub Dwell Monitor |
| **Screen Final ID** | `696b0dd2b5a5454ca85882c4d0f33c39` |
| **Screen Title** | Anteraja Hub Dwell Monitor - Optimized Responsive |
| **Design Theme** | Hub Dwell Velocity |
| **Viewport Base** | Desktop `1280px × 1024px` (Fluid Responsive: Mobile `390px`, Tablet `768px`, Desktop `1440px+`) |
| **Shell Type** | `web_dashboard` (SaaS Operational Intelligence / Telematics Dashboard) |
| **Visibilitas & Role**| `PRIVATE` / Owner |

---

## 2. Warna & Tipografi

### 2.1 Palet Warna (Color Palette & Tokens)

Desain menggunakan skema warna kontras fungsional untuk mendukung pengambilan keputusan cepat (*split-second operational decision*):

#### Brand & Status Colors
* **Primary (Brand Magenta):** `#E6007E` (`primary-container`), `#B90064` (`primary`)
  * *Penggunaan:* Aksi utama (*primary buttons*), pin peta prioritas, indikator SLA breach, active tab navigation, border kiri kartu investigasi.
* **Secondary (Kinetic Orange):** `#F37021` / `#FC7728` (`secondary-container`), `#A04100` (`secondary`)
  * *Penggunaan:* Peringatan ambang batas dwell time mendekati SLA breach, pill badge peringatan awal, kapasitas sorter.
* **Tertiary (Precision Blue):** `#0284C7` / `#007DBD` (`tertiary-container`), `#006397` (`tertiary`)
  * *Penggunaan:* Status normal (< 6.00 jam), pin peta reguler, metrik antrean paket umum, jalur transit.
* **Error / Critical Alert:**
  * `#BA1A1A` (Error base)
  * `#FFDAD6` (`error-container` untuk background badge krisis & error banner)
  * `#93000A` (`on-error-container` untuk teks krisis)

#### Surface, Canvas & Neutrals
* **Surface Background (Canvas):** `#F9F9FF` (Porcelain cool canvas, rendah kelelahan mata)
* **Surface Container Lowest (Cards & Sidebar):** `#FFFFFF` (Putih bersih)
* **Surface Container Low (Subtle Panels & Inputs):** `#F0F3FF`
* **Surface Container (Divider & Hover):** `#E7EEFF`
* **Surface Container High:** `#DEE8FF`
* **Surface Container Highest / Variant:** `#D8E3FB`
* **Text / On-Surface:** `#111C2D` (Slate gelap untuk kontras maksimal)
* **Text Secondary / On-Surface Variant:** `#5A3F47`
* **Border & Outline:** `#8E6F77` (Outline), `#E2BDC7` (Outline variant / hairline stroke)

#### Aturan Ambang Batas Dwell Time (Latihan Operasional)
* **Prioritas Investigasi (Breach / Alert):** Mean Dwell Time $\ge$ **6.00 jam** (Warna: Brand Magenta `#E6007E`)
* **Standar Normal:** Mean Dwell Time < **6.00 jam** (Warna: Precision Blue `#007DBD`)

---

### 2.2 Sistem Tipografi (Typography)

Menggunakan kombinasi **Plus Jakarta Sans** (authoritative modern sans-serif untuk UI) dan **JetBrains Mono** (monospaced untuk angka, jam, ID hub, dan kode resi AWB):

| Token Style | Font Family | Ukuran / Line Height | Weight | Penggunaan |
| :--- | :--- | :--- | :--- | :--- |
| `headline-xl` | Plus Jakarta Sans | 36px / 44px | 800 (ExtraBold) | Judul hero / display banner |
| `headline-lg` | Plus Jakarta Sans | 28px / 36px | 700 (Bold) | Header halaman & modal |
| `headline-md` | Plus Jakarta Sans | 20px / 28px | 700 (Bold) | Subheading section & nama hub di panel |
| `headline-sm` | Plus Jakarta Sans | 16px / 24px | 600 (SemiBold) | Header kartu KPI & daftar pemantauan |
| `metric-display`| JetBrains Mono | 32px / 40px | 700 (Bold) | Angka KPI utama (6 Hub, 10.000, 12.99 jam) |
| `body-lg` | Plus Jakarta Sans | 16px / 24px | 400 (Regular) | Teks pengantar |
| `body-md` | Plus Jakarta Sans | 14px / 20px | 400 (Regular) | Teks konten utama & input text |
| `body-sm` | Plus Jakarta Sans | 12px / 18px | 400 (Regular) | Keterangan metadata, subtitle, dan label |
| `label-lg` | Plus Jakarta Sans | 14px / 20px | 600 (SemiBold) | Label tombol & navigation link |
| `label-md` | JetBrains Mono | 12px / 16px | 500 (Medium) | Monospace badge & tabular micro-data |
| `label-sm` | JetBrains Mono | 11px / 14px | 500 (Medium) | Hub ID (`HUB_UPG`), AWB tag, counter chip |

---

## 3. Layout Desktop & Mobile

### 3.1 Desktop Layout ($\ge$ 1024px / 1280px / 1440px)
* **Sidebar Navigasi:** 
  * Fixed di sisi kiri, lebar `256px` (`w-64`), warna `#FFFFFF` dengan shadow halus.
  * Memuat Brand Header (Logo Anteraja), status simulasi aktif, 5 menu navigasi, dan SLA Health Widget di footer.
* **Top Header:** 
  * Fixed di bagian atas, tinggi `64px` (`h-16`), offset kiri `lg:pl-64`.
  * Memuat judul operasional, notifikasi alert, serta profil user ("Budi Santoso - Supervisor Operasional").
* **Banner Sub-Header:** 
  * Strip simulasi aktif (`bg-secondary-fixed/50`) dan banner aturan prioritas dwell ($\ge$ 6.00 jam).
* **Grid KPI (12-Column):** 
  * 4 kartu KPI berjajar horizontal, masing-masing menempati `lg:col-span-3`.
* **Area Kerja In-Body (Side-by-Side):**
  * **Kolom Kiri (7 Kolom / `lg:col-span-7`):** Peta Interaktif Leaflet dengan tinggi `420px`.
  * **Kolom Kanan (5 Kolom / `lg:col-span-5`):** 
    1. Detail Panel Investigasi Hub yang terpilih (collapsible / ada tombol tutup `✕`).
    2. Daftar Pemantauan Hub dengan scroll vertikal internal (`max-h-[450px]`).

```
+---------------------------------------------------------------------------------+
| Sidebar (256px) | Top Header (h-16): Breadcrumb, Notifikasi, User Profile       |
|                 +---------------------------------------------------------------+
| - Logo Anteraja | Banner Simulasi & Aturan Latihan (Mean Dwell >= 6.00 jam)     |
| - 5 Menu Tab    +---------------------------------------------------------------+
| - SLA Health    | KPI 1 (Total) | KPI 2 (Paket) | KPI 3 (Prioritas) | Top 3 Dwell |
|   Widget        +---------------------------------------------------------------+
|                 | Filter Toolbar: Search Input + Tabs (Semua / Prioritas)       |
|                 +-----------------------------------+---------------------------+
|                 | Peta Interaktif Leaflet           | Panel Detail Hub Terpilih |
|                 | (Tinggi: 420px, Col 7)            +---------------------------+
|                 | - Custom Pin Markers              | Daftar Hub Terpantau      |
|                 | - Reset Zoom Indonesia            | (Scrollable max-h-450px)  |
+-----------------+-----------------------------------+---------------------------+
```

---

### 3.2 Mobile Layout (< 768px / 390px)
* **Header & Drawer:**
  * Hamburger menu button di header kiri dengan area sentuh minimum 44px (`min-h-[44px]`).
  * Sidebar menjadi **Slide-out Drawer** dengan backdrop overlay semi-transparan (`bg-on-surface/40`). Klik di luar menutup drawer.
* **Susunan Bertumpuk (Vertical Stack):**
  * KPI Cards disusun 1 kolom pada layar sempit atau 2 kolom pada smartphone lebar (`grid-cols-1 sm:grid-cols-2`).
  * Toolbar filter dan search input menyesuaikan lebar layar penuh (`w-full`).
  * **Peta di Atas:** Peta interaktif Leaflet diletakkan di atas dengan tinggi responsif `320px` agar tidak memakan ruang navigasi.
  * **Daftar & Detail di Bawah:** Panel detail hub dan kartu daftar hub diletakkan di bawah peta untuk kenyamanan sentuhan ibu jari (*thumb zone*).
* **Touch Target Standard:** Semua tombol aksi, input, dan tab memiliki ukuran minimum `44px × 44px` (`min-h-[44px]`).

---

## 4. Spesifikasi Komponen UI

### 4.1 Komponen KPI (4 Kartu Ringkasan)
Terletak di bagian atas dashboard dalam format grid responsif:

1. **Total Hub:**
   * Angka: `6 Hub`
   * Icon: `hub` (warna primary `#E6007E`)
   * Sub-keterangan: "Status: Terpantau Aktif" dengan indikator dot oranye.
2. **Total Jumlah Paket:**
   * Angka: `10.000`
   * Icon: `inventory_2` (warna tertiary `#006397`)
   * Sub-keterangan: "Distribusi merata ~1.666/hub".
3. **Hub Prioritas Investigasi:**
   * Angka: `3 Hub` dengan persentase `(50%)`
   * Icon: `priority_high` (warna background error container `#FFDAD6`)
   * Sub-keterangan: "Kriteria: Mean dwell $\ge$ 6.00 jam".
4. **Top 3 Dwell Time Global (Ranking Tile):**
   * Menampilkan ringkasan 3 hub dengan durasi dwell terlama.

---

### 4.2 Komponen Top 3 Dwell Time
Komponen daftar peringkat teratas untuk eskalasi prioritas dispatch:
* **Peringkat 1:** Makassar Hub (`HUB_UPG`) — Badge `1` (Magenta), Dwell `12.99 jam` (Badge `#FFDAD6` / `#E6007E`).
* **Peringkat 2:** Medan Hub (`HUB_MDN`) — Badge `2` (Orange), Dwell `10.01 jam` (Badge `#FFDBCB` / `#A04100`).
* **Peringkat 3:** Surabaya Hub (`HUB_SUB`) — Badge `3` (Orange), Dwell `6.98 jam` (Badge `#FFDBCB` / `#A04100`).
* **Interaktivitas:** Mengklik salah satu baris Top 3 secara otomatis:
  1. Memilih hub terkait sebagai *active hub*.
  2. Mengarahkan peta (fly-to animasi) ke koordinat hub.
  3. Membuka panel detail investigasi.

---

### 4.3 Komponen Peta Interaktif (Leaflet Map)
* **Kontainer Peta:** Tinggi `420px` di desktop, `320px` di mobile. Base layer menggunakan OpenStreetMap Carto tiles.
* **Center & Zoom Awal:** Koordinat `[-2.5, 116.0]` dengan level zoom `5` (Mencakup seluruh kepulauan Indonesia).
* **Header Peta:** Menampilkan judul "Peta Dwell Distribusi Hub Nasional" dan legenda warna:
  * Dot Magenta: Prioritas ($\ge$ 6 jam)
  * Dot Biru: Normal (< 6 jam)
* **Custom Teardrop SVG Pin:**
  * Bentuk teardrop SVG halus dengan titik putih di tengah.
  * Hub prioritas memiliki animasi cincin berkedip (`animate-ping`).
  * Hub aktif membesar (`scale-125`).
* **Map Popup Card:**
  * Memuat: Nama Hub, Monospace Hub ID, Total Paket, Mean Dwell Time, Median Dwell Time, dan tombol cepat "Buka Detail Investigasi".
* **Kontrol Tambahan:**
  * Tombol melayang di kiri bawah: `Reset Zoom Indonesia` (Mengembalikan viewport ke koordinat awal Indonesia).
  * Petunjuk melayang: "Klik pin untuk memusatkan & melihat detail investigasi".

---

### 4.4 Komponen Daftar Pemantauan Hub
* **Header Daftar:** Judul "Daftar Pemantauan Hub" dengan badge penghitung ("Menampilkan 6 dari 6 hub").
* **Struktur Kartu Hub:**
  * **Border Kiri Berwarna (4px):** Magenta `#E6007E` jika prioritas, Biru `#007DBD` jika normal.
  * **Status Seleksi:** `ring-2 ring-primary-container bg-surface-container-low` saat kartu sedang aktif/dipilih.
  * **Header Kartu:** Nama Hub, Monospace Hub ID chip (`HUB_UPG`), serta nama provinsi/wilayah.
  * **Status Badge:**
    * Prioritas: `Perlu Investigasi Cepat` (background pink terang + dot magenta).
    * Normal: `Standar Normal` (background biru muda).
  * **3 Kolom Metrik Utama:**
    * Paket (misal: `1666`)
    * Mean Dwell Time dengan satuan eksplisit (misal: `12.99 jam`)
    * Median Dwell Time dengan satuan eksplisit (misal: `12.98 jam`)
  * **Bar Progres Dwell Time:** Menampilkan visualisasi persentase beban dwelling terhadap ambang batas maksimum.

---

### 4.5 Komponen Detail Panel Investigasi
Ditempatkan di atas daftar hub saat hub dipilih:
* **Header Panel:** Icon `assignment`, judul "Detail Investigasi Hub", serta tombol tutup eksplisit (**`✕`** dengan `min-h-[44px]`).
* **Informasi Utama:** Chip Hub ID (`HUB_UPG`), Nama Hub, dan Badge Prioritas.
* **4 Tile Metrik:**
  1. Jumlah Paket (Simulasi: 1.666 paket)
  2. Mean Dwell Time (12.99 jam)
  3. Median Dwell Time (12.98 jam)
  4. Status Investigasi ("Prioritas Investigasi ($\ge$ 6.00 jam)")
* **Tombol Aksi (Touch Target $\ge$ 44px):**
  * `Fokuskan di Peta`: Melakukan pan dan zoom Leaflet map ke koordinat hub terpilih dan membuka popup.
  * `Tandai Selesai Tinjau`: Mengubah status tombol menjadi checked hijau untuk konfirmasi operasional pengawas.

---

## 5. State Desain: Loading, Kosong, & Eror

Untuk memastikan ketahanan UX (*operational resilience*), antarmuka mengimplementasikan 3 state utama selain state normal:

```
+-----------------------------------------------------------------------------------+
| SIMULASI STATE: [ Normal ]  [ Loading ]  [ Kosong ]  [ Eror ]                     |
+-----------------------------------------------------------------------------------+
```

### 5.1 Loading State (Memuat Data)
* **Kapan terjadi:** Saat pertama kali aplikasi memuat data telemetri, saat switching dataset, atau saat melakukan sinkronisasi ulang.
* **Visualisasi:**
  * Menampilkan **Skeleton Loader** dengan animasi shimmer/pulse (`animate-pulse`) pada kontainer kartu daftar hub.
  * Teks badge penghitung berubah menjadi: `Memuat data simulasi...`.
  * Tombol dan aksi dinonaktifkan sementara untuk mencegah duplicate submit.

### 5.2 Empty State (Data Kosong / Tidak Ditemukan)
* **Kapan terjadi:** Pengguna mengetikkan kata kunci pencarian yang tidak cocok dengan 6 hub yang ada, atau filter aktif tidak memiliki hasil.
* **Visualisasi:**
  * Lingkaran tengah dengan icon `inventory_2` abu-abu lembut (`#8E6F77`).
  * Headline: **"Tidak ada hub yang sesuai kriteria"**.
  * Teks penjelasan: *"Coba sesuaikan kata kunci pencarian atau ubah filter tab ke status 'Semua Hub'."*
  * Tombol Aksi: **"Reset Pencarian"** (`min-h-[44px]`, mengosongkan kata kunci dan mengembalikan tab ke 'Semua Hub').

### 5.3 Error State (Gagal Koneksi / Data Terputus)
* **Kapan terjadi:** Gagal menghubungkan ke service telemetri, timeout jaringan, atau format data tidak valid.
* **Visualisasi:**
  * **Error Alert Banner:** Banner kontras tinggi di bagian atas kontainer utama dengan latar `bg-error-container` (`#FFDAD6`) dan teks `text-on-error-container` (`#93000A`).
  * Icon: `error` berukuran 24px.
  * Judul: **"Gagal memuat koordinat koneksi telemetry latihan"**.
  * Deskripsi: *"Sistem simulasi gagal melakukan sinkronisasi dengan endpoint telemetry perutean. Silakan coba kembali."*
  * Tombol Pemulihan: **"Coba Lagi"** (`min-h-[44px]`, warna `bg-primary`, memicu re-fetch).
  * **Proteksi Area Kerja:** Dashboard utama diubah menjadi redup (`opacity-40`) dan interaksi dikunci (`pointer-events-none`) agar pengawas tidak mengambil keputusan dengan data yang korup/basi.

---

## 6. Data Kontrak 6 Hub Simulasi

Data latihan operasional mencakup 6 hub strategis dengan total tepat **10.000 paket**:

| ID Hub | Nama Hub | Wilayah | Lat, Lng | Paket | Mean Dwell | Median Dwell | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `HUB_UPG` | Makassar Hub | Sulawesi Selatan | `-5.1477, 119.4327` | 1.666 | 12.99 jam | 12.98 jam | Prioritas 1 |
| `HUB_MDN` | Medan Hub | Sumatera Utara | `3.5952, 98.6722` | 1.667 | 10.01 jam | 10.02 jam | Prioritas 2 |
| `HUB_SUB` | Surabaya Hub | Jawa Timur | `-7.2575, 112.7521` | 1.667 | 6.98 jam | 6.97 jam | Prioritas 3 |
| `HUB_SRG` | Semarang Hub | Jawa Tengah | `-6.9667, 110.4167` | 1.666 | 5.00 jam | 5.01 jam | Normal |
| `HUB_BDO` | Bandung Hub | Jawa Barat | `-6.9175, 107.6191` | 1.667 | 3.99 jam | 3.98 jam | Normal |
| `HUB_CGK` | Jakarta Hub | DKI Jakarta | `-6.2088, 106.8456` | 1.667 | 2.04 jam | 2.05 jam | Normal |

---

## 7. Tab Layar Tambahan (SLA & Queue)
Selain layar pemantauan utama (`hub-dwell-monitor`), sistem mencakup 4 layar operasional terintegrasi:
1. **Antrean Paket (`antrean-paket`):** Data table 10 sampel antrean AWB real-time dengan filter hub dan status tahapan (*Paket Masuk, Dalam Sortir, Menunggu Muat, Siap Dikirim*).
2. **SLA Clearance Alerts (`sla-clearance-alerts`):** Pusat mitigasi eskalasi dwell dengan kartu countdown breach untuk Makassar, Medan, dan Surabaya, serta tombol aksi delegasi ("Tugaskan Tim Ops" & "Notif Driver").
3. **Peta Distribusi Hub (`peta-distribusi-hub`):** Visualisasi rute logistik nasional dan jalur transfer antar-hub.
4. **Laporan Analitik (`laporan-analitik`):** Grafik batang perbandingan dwell time, distribusi volume jam sibuk, dan persentase kepatuhan SLA per hub.
