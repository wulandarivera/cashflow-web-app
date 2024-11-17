# Cashflow Tracker

Aplikasi web untuk melacak dan mengelola arus kas pribadi atau bisnis. Dibangun dengan React, Vite, dan Firebase.

## Fitur

- 📊 Visualisasi data dengan Chart.js
- 🔥 Real-time database dengan Firebase
- 📱 Responsive design dengan Tailwind CSS
- 🎨 Animasi halus dengan Framer Motion
- 📅 Pengelolaan tanggal dengan Date-fns
- 🔔 Notifikasi dengan React Hot Toast

## Teknologi

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **CSS Framework:** Tailwind CSS
- **Database:** Firebase
- **Charts:** Chart.js dengan React-Chartjs-2
- **Icons:** React Icons
- **Animation:** Framer Motion
- **Date Handling:** Date-fns

## Prasyarat

- Node.js (versi 14 atau lebih baru)
- NPM atau Yarn
- Firebase account

## Instalasi

1. Clone repository ini
```bash
git clone [repository-url]
cd cashflow-tracker
```

2. Install dependensi
```bash
npm install
```

3. Setup environment variables
Buat file `.env` di root direktori dan tambahkan konfigurasi Firebase Anda:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Penggunaan

### Development Mode
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5173`

### Build untuk Production
```bash
npm run build
```

### Deploy ke Firebase
```bash
npm run deploy
```

## Struktur Proyek

```
cashflow/
├── src/
│   ├── components/    # Komponen React
│   ├── config/        # Konfigurasi aplikasi
│   ├── context/       # React Context
│   ├── services/      # Firebase services
│   ├── utils/         # Fungsi utilitas
│   ├── App.jsx        # Komponen utama
│   └── main.jsx       # Entry point
├── public/            # Asset statis
├── .env              # Environment variables
└── package.json      # Dependencies dan scripts
```

## Scripts

- `npm run dev` - Menjalankan development server
- `npm run build` - Build aplikasi untuk production
- `npm run preview` - Preview build production
- `npm run lint` - Menjalankan ESLint
- `npm run deploy` - Build dan deploy ke Firebase

## Lisensi

[MIT License](LICENSE)

## Kontribusi

Kontribusi selalu diterima! Silakan buat pull request atau buka issue untuk saran dan perbaikan.

## Dukungan

Jika Anda memiliki pertanyaan atau masalah, silakan buka issue di repository ini.
