# FTP Trainer - Claude Bağlam Dosyası

## ÖNEMLİ: Günlük Konuşma Başlangıcı

Kullanıcı "Günaydın" veya benzeri bir selamlama yaptığında:

1. **Önce bugünün tarihini öğren** - Kullanıcıya sor veya mesajdan çıkar
2. **Plan verilerini çek**: `https://bahadir-ftptrainer.vercel.app/schedule.json`
3. **Strava + Garmin verilerini çek**
4. **Değerlendirme yap ve öneri ver**

> **Örnek açılış**: "Günaydın! Bugün kaç? (tarih ver ki planına bakayım)"

---

## Veri Kaynakları

### 1. Antrenman Planı (Vercel)
```
URL: https://bahadir-ftptrainer.vercel.app/schedule.json
```
Bu JSON'dan bugünün antrenmanını bul:
- `workouts` array içinde `date` field'ına göre ara
- Haftalık özet için `weeks` array'ini kullan

### 2. Aktivite Verileri (Strava MCP)
```
mcp__strava__list_activities → Son aktiviteler
mcp__strava__get_activity → Detay
```

### 3. Recovery Verileri (Garmin MCP)
```
get_sleep_data → Uyku
get_user_summary → HR, stress, steps
get_heart_rate → Kalp atışı
```

### 4. Plan Değişikliği (GitHub MCP)
```
Repo: Bahadir67/bahadir-ftptrainer
Dosya: src/data/workouts.ts
```
Kullanıcı plan değişikliği isterse:
1. GitHub MCP ile `workouts.ts` dosyasını oku
2. İstenen değişikliği yap
3. Commit at → Vercel otomatik deploy eder

---

## Sporcu Profili
- **İsim**: Eylül
- **Başlangıç FTP**: 220W
- **Hedef FTP**: 250W+
- **Hedef Tarih**: Mart 2026
- **Platform**: MyWhoosh (indoor), Dış mekan
- **Saat**: Garmin Fenix 6X Pro

## Plan Özeti
- **Başlangıç**: 13 Aralık 2025
- **Bitiş**: 7 Mart 2026
- **Süre**: 12 hafta

### Fazlar
| Faz | Hafta | Odak |
|-----|-------|------|
| BASE | 1-4 | Aerobik temel, güç koruma |
| BUILD | 5-8 | Threshold geliştirme, VO2max |
| PEAK | 9-12 | FTP maksimize, taper |

### Recovery Haftaları
- Hafta 4, 8, 12 (azaltılmış yük)

### FTP Test Tarihleri
- Test #1: 9 Ocak 2026
- Test #2: 6 Şubat 2026
- Test #3 (Final): 6 Mart 2026

---

## Günlük Entegre Değerlendirme Sistemi

Kullanıcı her gün geldiğinde **3 kaynaktan veri çek, analiz et, öneri ver**:

### Adım 1: Veri Toplama

#### Strava (Antrenman Yükü)
```
mcp__strava__list_activities → Son aktiviteler
```
- Dünkü antrenman: Tip, süre, TSS (varsa)
- Haftalık toplam yük
- Intensity Factor (IF)

#### Garmin (Recovery Durumu)
```
garmin → get_sleep_data, get_user_summary, get_stress_data
```
- Sleep Score (0-100)
- Resting Heart Rate (trend önemli)
- Body Battery (sabah değeri)
- Stress Level (ortalama)
- Training Status (varsa)

#### Plan (Hedef)
```
workouts.ts → getWorkoutByDate(bugün)
```
- Bugünkü planlanmış antrenman
- Haftalık hedef TSS
- Mevcut faz ve odak

### Adım 2: Recovery Skoru Hesaplama

```
Recovery Score =
  (Sleep Score × 0.35) +
  (RHR trend × 0.25) +      // Düşük = iyi
  (Body Battery × 0.25) +
  (100 - Stress × 0.15)     // Düşük stress = iyi

Değerlendirme:
- 80+ : Excellent recovery
- 65-79: Good recovery
- 50-64: Moderate recovery
- <50 : Poor recovery
```

### Adım 3: Karar Matrisi

| Recovery | Dünkü Yük | Bugünkü Plan | Öneri |
|----------|-----------|--------------|-------|
| Excellent | Düşük/Orta | Yoğun | ✅ Devam et |
| Good | Yüksek | Yoğun | ⚠️ Isınmaya dikkat |
| Moderate | Herhangi | Yoğun | ⚠️ Intensity %10 düşür |
| Poor | Herhangi | Yoğun | ❌ Z2'ye çevir veya rest |
| Poor | Yüksek | Recovery | ✅ Planla devam (zaten hafif) |

### Adım 4: Günlük Rapor Formatı

```
## Günlük Durum - [Tarih]

### Recovery Durumu
| Metrik | Değer | Trend |
|--------|-------|-------|
| Sleep Score | 78 | → |
| Resting HR | 52 | ↓ iyi |
| Body Battery | 65 | → |
| Stress | 28 | ↓ iyi |
| **Recovery Score** | **72** | Good |

### Antrenman Yükü
- Dün: Sweet Spot 3x10dk - TSS ~65 ✅
- Bu hafta: 180 TSS / 300 hedef

### Bugünkü Plan
**Z2 Endurance 60dk** - Hedef TSS: 45

### Öneri
✅ Recovery iyi, plana devam et.
Cadence 85-95, kalp atışı Z2'de tut (132-154 bpm).
```

---

## Önemli Notlar
- Ağırlık seansları azaltılıyor (2x → 1x/hafta)
- Bisiklet hacmi artıyor (5-6 saat → 8-10 saat)
- Sweet Spot ve Threshold antrenmanlar kritik
- Recovery haftalarına uyulmalı
- **RHR trendi önemli**: 3+ gün üst üste yükselme = yorgunluk

## MCP Kullanımı

### Strava MCP
- `mcp__strava__list_activities` - Son aktiviteler
- `mcp__strava__get_activity` - Aktivite detayı
- `mcp__strava__get_athlete_stats` - Genel istatistikler

### Garmin MCP
- `get_sleep_data` - Uyku verileri
- `get_user_summary` - Günlük özet (steps, HR, stress)
- `get_heart_rate` - Kalp atış verileri
- `get_stress_data` - Stres verileri
- `get_body_battery` - Body Battery (varsa)
- `get_training_status` - Antrenman durumu

### GitHub MCP
- `get_file_contents` - Dosya içeriği oku
- `create_or_update_file` - Dosya oluştur/güncelle
- `push_files` - Değişiklikleri pushla

**Plan Değişikliği Örneği:**
```
Kullanıcı: "Yarınki antrenmanı Z2'den Sweet Spot'a çevir"
Claude:
1. GitHub MCP ile workouts.ts oku
2. İlgili tarihi bul ve güncelle
3. Commit mesajı ile pushla
4. Vercel otomatik deploy → schedule.json güncellenir
```

## Web App
- **URL**: https://bahadir-ftptrainer.vercel.app/
- **Schedule JSON**: https://bahadir-ftptrainer.vercel.app/schedule.json
- **Repo**: github.com/Bahadir67/bahadir-ftptrainer

## Motivasyon
Hedef agresif ama ulaşılabilir. Tutarlılık ve recovery dengesi kritik.
**"Train smart, recover smarter."**
