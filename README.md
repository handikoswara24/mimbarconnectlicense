# Mimbar Connect - License Management & Landing Page

Platform web modern berbasis **Next.js 16**, **TypeScript**, dan **Tailwind CSS v4** yang menyediakan:
1. **Landing Page Interaktif**: Menampilkan fitur Mimbar Connect, perbandingan lengkap **Free vs Pro**, pilihan paket berlangganan (Bulanan / Tahunan), simulasi panggung & laser interaktif, serta modal checkout instan untuk pembelian License Key.
2. **Admin Dashboard (`/admin`)**: Manajemen lisensi lengkap, pengaturan harga berlangganan bulanan & tahunan, fitur **Reset Device / Disconnect Kunci** (karena 1 lisensi hanya bisa digunakan di 1 PC), audit log aktivitas, dan perpanjangan masa aktif.
3. **Desktop REST API**: Endpoint siap pakai untuk aplikasi desktop `mimbar-connect` (`activate`, `disconnect`, `validate`).

---

## 🚀 Cara Menjalankan

### Mode Pengembangan (Development)
```bash
npm run dev
```
Buka browser di: [http://localhost:3000](http://localhost:3000)

### Mode Produksi (Production Build)
```bash
npm run build
npm start
```

---

## 🌐 Halaman & Navigasi

### 1. Landing Page (`/`)
- **Simulasi Interaktif Panggung & Operator**: Pengunjung dapat mencoba navigasi slide, mengirim pesan teks operator, dan menggerakkan titik virtual laser pointer secara langsung di layar panggung.
- **Katalog Fitur Komprehensif**: Penjelasan rinci tentang fitur-fitur seperti Screen Share WebRTC, Laser Pointer, OS Overlay proyektor asli, Stage Keep-Awake (NoSleep), dan QR Code.
- **Perbandingan Free vs Pro**:
  - **Free (Rp 0)**: Kontrol navigasi slide Next / Previous, kirim pesan teks operator ke mimbar, dan koneksi jaringan lokal.
  - **Pro (Berlangganan)**: Semua fitur Free + Screen Mirroring ultra-low latency, Laser Pointer sentuh mimbar, OS Laser Overlay di proyektor asli, Stage Keep-Awake, kustomisasi pesan darurat, dan lisensi 1 PC dengan transfer fleksibel.
- **Kalkulator Harga & Berlangganan**: Toggle Bulanan vs Tahunan (Hemat 2 Bulan), sinkron secara dinamis dengan pengaturan di Admin Dashboard.
- **Modal Checkout Instan**: Pelanggan dapat memasukkan nama, email, organisasi, memilih paket, dan langsung mendapatkan License Key (`MBR-XXXX-XXXX-XXXX`) setelah simulasi pembayaran.
- **API Documentation & Test Sandbox**: Form uji coba endpoint aktivasi, validasi, dan pelepasan lisensi langsung dari browser.

---

### 2. Admin Dashboard (`/admin`)
- **URL Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Password Default**: `adminmimbar123`

#### Fitur Utama Admin:
1. **Manajemen Kunci Lisensi (1 PC Lock)**:
   - Melihat daftar semua lisensi, status aktif, masa kedaluwarsa, dan identitas PC yang terikat (`boundDeviceId` dan `boundDeviceName`).
   - **Tombol "Reset PC" / Disconnect**: Memutuskan ikatan PC secara paksa jika komputer pengguna rusak/ganti, sehingga lisensi dapat dipakai di PC baru.
   - **Buat Lisensi Baru**: Menerbitkan lisensi custom (Bulanan, Tahunan, Lifetime) dengan durasi fleksibel.
   - **Perpanjang (+1 Bulan / +1 Tahun)**: Menambah durasi masa berlaku lisensi.
   - **Revoke / Bekukan Lisensi**: Menonaktifkan sementara atau mencabut lisensi bermasalah.
   - **Hapus Lisensi**: Menghapus lisensi permanen dari basis data.
2. **Pengaturan Harga & Berlangganan**:
   - Ubah harga jual bulanan & harga coret (promo).
   - Ubah harga jual tahunan & harga coret.
   - Kustomisasi teks badge promosi (misal: "Hemat 2 Bulan (20%)").
   - Nomor WhatsApp CS & Email Dukungan Teknis.
3. **Audit Log Aktivitas**:
   - Rekam jejak seluruh event: aktivasi, disconnect, validasi berkala, pembuatan lisensi, dan identitas perangkat.

---

## 📡 API untuk Aplikasi Desktop (`mimbar-connect`)

Semua endpoint menerima dan mengembalikan format `JSON`.

### 1. Aktivasi / Input Key (Lock ke 1 PC)
- **Endpoint**: `POST /api/license/activate`
- **Tujuan**: Mendaftarkan dan mengunci lisensi pada 1 PC spesifik. Jika lisensi sedang aktif di PC lain, server akan menolak dengan status `409 Conflict`.
- **Request Body**:
  ```json
  {
    "key": "MBR-DEMO-2026-PRO1",
    "deviceId": "PC-STAGE-OP-01",
    "deviceName": "LAPTOP-OPERATOR-MSI",
    "osInfo": "Windows 11 Pro 64-bit"
  }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Lisensi Mimbar Connect Pro berhasil diaktivasi pada perangkat ini.",
    "license": {
      "key": "MBR-DEMO-2026-PRO1",
      "plan": "yearly",
      "customerName": "Gereja / Masjid Mitra",
      "expiresAt": "2027-10-03T14:00:00.000Z",
      "boundDeviceId": "PC-STAGE-OP-01",
      "features": ["screen_share", "laser_pointer", "os_laser", "stage_keep_awake", "custom_alerts"]
    }
  }
  ```
- **Response Error (409 Conflict - Terkunci di PC Lain)**:
  ```json
  {
    "success": false,
    "code": "DEVICE_LOCKED",
    "error": "Lisensi ini sedang aktif dan terkunci di PC lain (\"PC-LAMA\"). Harap lakukan Disconnect dari PC tersebut terlebih dahulu..."
  }
  ```

---

### 2. Disconnect Key (Lepas Kunci Perangkat)
- **Endpoint**: `POST /api/license/disconnect`
- **Tujuan**: Melepas ikatan lisensi dari PC saat ini sehingga lisensi siap diaktifkan di PC baru.
- **Request Body**:
  ```json
  {
    "key": "MBR-DEMO-2026-PRO1",
    "deviceId": "PC-STAGE-OP-01"
  }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Lisensi berhasil dilepas dari perangkat \"LAPTOP-OPERATOR-MSI\". Lisensi Anda kini bebas dan dapat digunakan pada PC baru."
  }
  ```

---

### 3. Validasi Key (Pemeriksaan Berkala / Startup)
- **Endpoint**: `POST /api/license/validate` (atau `GET /api/license/validate?key=...&deviceId=...`)
- **Tujuan**: Memastikan lisensi belum expired, belum dicabut, dan masih cocok dengan `deviceId` saat ini.
- **Request Body**:
  ```json
  {
    "key": "MBR-DEMO-2026-PRO1",
    "deviceId": "PC-STAGE-OP-01"
  }
  ```
- **Response Success (200 OK)**:
  ```json
  {
    "valid": true,
    "plan": "yearly",
    "customerName": "...",
    "expiresAt": "2027-10-03T14:00:00.000Z",
    "daysRemaining": 365,
    "boundDeviceId": "PC-STAGE-OP-01",
    "features": ["screen_share", "laser_pointer", "os_laser", "stage_keep_awake", "custom_alerts"]
  }
  ```

---

### 4. Mendapatkan Informasi Harga Publik
- **Endpoint**: `GET /api/pricing`
- **Response**:
  ```json
  {
    "success": true,
    "pricing": {
      "monthlyPrice": 49000,
      "monthlyOriginalPrice": 79000,
      "yearlyPrice": 490000,
      "yearlyOriginalPrice": 790000,
      "promoBadgeText": "Hemat 2 Bulan",
      "currency": "IDR"
    }
  }
  ```

---

## 💻 Contoh Integrasi ke Desktop App (`D:\Handi\Playing Ground\mimbar-connect`)

Di dalam aplikasi Electron/React Anda, buat helper file `src/lib/licenseClient.ts`:

```typescript
const LICENSE_SERVER_URL = "http://localhost:3000"; // Sesuaikan dengan domain server lisensi Anda

export async function activateProLicense(licenseKey: string, deviceId: string, deviceName: string) {
  const res = await fetch(`${LICENSE_SERVER_URL}/api/license/activate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: licenseKey, deviceId, deviceName })
  });
  return await res.json();
}

export async function validateCurrentLicense(licenseKey: string, deviceId: string) {
  const res = await fetch(`${LICENSE_SERVER_URL}/api/license/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: licenseKey, deviceId })
  });
  return await res.json();
}

export async function disconnectCurrentLicense(licenseKey: string, deviceId: string) {
  const res = await fetch(`${LICENSE_SERVER_URL}/api/license/disconnect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: licenseKey, deviceId })
  });
  return await res.json();
}
```
