# Anteraja Hub Dwell Monitor

Dashboard React + Vite untuk memantau data simulasi dwell hub dengan peta Leaflet.
Data dibaca dari `public/data/anteraja_bottleneck_map.csv`; file sumber tidak diubah.

## Menjalankan aplikasi

```sh
npm install
npm run dev
```

## Pemeriksaan

```sh
npm run lint
npm run build
```

## Data dan aturan

- CSV diambil melalui `fetch`, diperiksa status HTTP-nya, lalu diparse dengan header menggunakan Papa Parse.
- Validasi mencakup ID hub unik, nilai numerik finite, `package_count` integer nonnegatif, latitude `-90..90`, dan longitude geografis `-180..180`. Koordinat nol valid.
- Prioritas latihan ditentukan oleh `avg_dwell_hours >= 6`; ini bukan SLA resmi.
- KPI dan Top 3 menggunakan seluruh data. Pencarian dan filter bersama-sama menentukan hub yang ditampilkan pada daftar dan peta.
- Peta menggunakan tile OpenStreetMap; koneksi internet diperlukan untuk memuat tile. Atribusi OSM ditampilkan pada peta.
# supervisor-hub-monitor
