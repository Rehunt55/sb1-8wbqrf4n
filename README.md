# 🚀 OmniAI — Yapay Zeka & Borsa Süper Uygulaması

  **Mobil Öncelikli (Mobile-First), Canlı Piyasa Takibi ve Yapay Zeka Destekli Portföy Yönetim Platformu**

  [![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Capacitor](https://img.shields.io/badge/Capacitor-iOS%20%26%20Android-1192E8?style=for-the-badge&logo=capacitor)](https://capacitorjs.com/)

</div>

---

## 📌 Proje Hakkında

**OmniAI**, modern finans ve yapay zeka araçlarını tek bir çatı altında toplayan hibrit bir süper uygulamadır (Super App). Kullanıcıların kripto, döviz ve altın portföylerini canlı verilerle takip etmesini sağlarken, yapay zeka destekli analizler ve e-ticaret/stok önerileri sunar.

Dark Mode ve Glassmorphism tasarım ilkeleriyle geliştirilen uygulama, **CapacitorJS** altyapısı sayesinde tek bir kod tabanından hem **Android** hem **iOS** çıktısı verecek şekilde mimarize edilmiştir.

---

## ✨ Temel Özellikler

- 📈 **Canlı Piyasa Verileri:** Kripto paralar (BTC, ETH, SOL), Döviz (USD, EUR) ve Altın kurlarının gerçek zamanlı takibi.
- 🤖 **AI Portföy Danışmanı:** Anlık risk analizi ve kişiselleştirilmiş finansal harcama önerileri.
- 🛍️ **Akıllı Ürün & Stok Takibi:** E-ticaret entegrasyonu, trend ürün önerileri ve işletmeler için stok kontrolü.
- 📱 **Mobil Hibrit Mimari:** iPhone/Android ekran uyumluluğu, Dynamic Island ve uygulama içi bildirimler.
- 🔒 **Güvenlik & Bakiye Gizleme:** Tek tıkla gizlenebilir net servet görünümü ve FaceID/PIN simülasyonu.

---

## 🛠️ Teknolojik Yapı (Tech Stack)

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide Icons, Framer Motion
- **Mobile Engine:** CapacitorJS (Android & iOS)
- **State Management & State:** React Hooks & LocalStorage Persistent
- **Backend / Database:** Supabase

---

## 💻 Bilgisayarda Çalıştırma (Kurulum)

Projeyi yerel ortamınızda çalıştırmak için şu adımları izleyin:

```bash
# 1. Depoyu klonlayın
git clone [https://github.com/Rehunt55/sb1-8wbqrf4n.git](https://github.com/Rehunt55/sb1-8wbqrf4n.git)

# 2. Proje dizinine girin
cd sb1-8wbqrf4n

# 3. Bağımlılıkları yükleyin
npm install

# 4. Geliştirici sunucusunu başlatın
npm run dev

📱 Mobil Çıktı Alma (Android & iOS)
Bash
# Projeyi derleyin
npm run build

# Mobil platformlara senkronize edin
npm run cap:sync

# Android Studio'yu açmak için
npm run cap:open:android

# Xcode'u açmak için (macOS gerektirir)
npm run cap:open:ios
