# 🚴 FTP Trainer - AI Bisiklet Antrenörü

Claude Desktop ile entegre kişisel bisiklet antrenman sistemi. Strava, Garmin ve GitHub ile tam otomatik takip.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Claude](https://img.shields.io/badge/Claude-Desktop-purple)

---

## 🎯 Özellikler

### Web App (Next.js)
- ✅ 12 haftalık detaylı antrenman planı
- ✅ Haftalık özet ve faz takibi
- ✅ İlerleme kaydetme (localStorage)
- ✅ .ics takvim export
- ✅ PWA desteği (mobil)
- ✅ Static JSON API

### Claude Desktop Entegrasyonu
- 🤖 **Günlük antrenör görüşmeleri**
- 📊 **Otomatik veri toplama** (Strava + Garmin)
- 🧠 **Recovery analizi ve karar verme**
- 💡 **Akıllı plan önerileri**
- 🔄 **Otomatik plan güncelleme** (GitHub → Vercel)

### MCP Sunucuları
- **Strava**: Aktivite verileri, TSS, performans
- **Garmin**: Uyku, HRV proxy, stress, recovery
- **GitHub**: Plan değişikliği ve otomasyon

---

## 🚀 Hızlı Başlangıç

### Gereksinimler

- Node.js 20+
- Python 3.11+ (Garmin MCP)
- Claude Desktop
- Strava, Garmin, GitHub hesapları

### Kurulum

**Detaylı adım adım kurulum** için → [SETUP.md](./SETUP.md)

```bash
# 1. Klonla
git clone https://github.com/Bahadir67/bahadir-ftptrainer.git
cd bahadir-ftptrainer

# 2. Bağımlılıkları kur
npm install

# 3. Development
npm run dev

# 4. Build
npm run build

# 5. Vercel'e deploy
vercel --prod
```

---

## 💬 Günlük Kullanım

Claude Desktop'ta her sabah:

```
Günaydın, bugün 15 Aralık
```

**Claude yapar**:
1. 📊 Planı kontrol eder (`schedule.json`)
2. 🏃 Strava aktivitelerini çeker
3. 😴 Garmin recovery verilerini alır
4. 🧠 Recovery skoru hesaplar
5. 💡 3 senaryo sunar:
   - ✅ Plana devam
   - ⚠️ Intensity değiştir
   - ❌ Telafi/Rest öner
6. 🔄 Onaylarsan planı günceller

---

## 📁 Proje Yapısı

```
bahadir-ftptrainer/
├── src/
│   ├── app/              # Next.js sayfalar
│   ├── data/
│   │   └── workouts.ts   # 12 haftalık plan
│   ├── components/       # React bileşenler
│   └── lib/              # Utility fonksiyonlar
├── public/
│   └── schedule.json     # API endpoint
├── scripts/
│   └── generate-schedule.js  # Build script
├── CLAUDE.md             # Claude Desktop prompt
├── SETUP.md              # Kurulum kılavuzu
└── package.json
```

---

## 🛠 Teknolojiler

### Frontend
- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide Icons** - İkonlar

### Backend & Automation
- **Vercel** - Hosting & deployment
- **GitHub Actions** - CI/CD (otomatik)

### AI & MCP
- **Claude Desktop** - Ana antrenör
- **Strava MCP** - Aktivite entegrasyonu
- **Garmin MCP** - Recovery verileri
- **GitHub MCP** - Plan yönetimi

---

## 📊 Antrenman Planı

### Fazlar
| Faz | Hafta | TSS | Odak |
|-----|-------|-----|------|
| BASE | 1-4 | 300-380 | Aerobik temel |
| BUILD | 5-8 | 320-480 | Threshold & VO2max |
| PEAK | 9-12 | 350-520 | FTP maksimize |

### FTP Test Tarihleri
- **Test #1**: 9 Ocak 2026
- **Test #2**: 6 Şubat 2026
- **Test #3**: 6 Mart 2026 (Final)

**Hedef**: 220W → 250W+ (%14 artış)

---

## 🤝 Katkıda Bulunma

Kendi antrenman planını oluşturmak için:

1. Fork et
2. `src/data/workouts.ts` dosyasını düzenle
3. `CLAUDE.md` dosyasını kişiselleştir
4. Kendi Vercel hesabına deploy et

**Detaylı kurulum**: [SETUP.md](./SETUP.md)

---

## 📄 Lisans

MIT License - özgürce kullan, değiştir, paylaş!

---

## 🙏 Teşekkürler

- **Claude Desktop** - AI antrenör platform
- **Strava** - Aktivite takibi
- **Garmin** - Recovery verileri
- **Vercel** - Ücretsiz hosting
- **Model Context Protocol** - MCP framework

---

## 📞 İletişim & Destek

- **Kurulum**: [SETUP.md](./SETUP.md) oku
- **Issues**: GitHub Issues kullan
- **Özelleştirme**: `CLAUDE.md` ve `workouts.ts` düzenle

---

**Hazırlayan**: Claude Code + Eylül
**Versiyon**: 1.0
**Tarih**: Aralık 2025

> "Train smart, recover smarter." 🚴💪
