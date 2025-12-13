# FTP Trainer - Claude Bağlam Dosyası

## Sporcu Profili
- **İsim**: Eylül
- **Başlangıç FTP**: 220W
- **Hedef FTP**: 250W+
- **Hedef Tarih**: Mart 2026
- **Platform**: MyWhoosh (indoor), Dış mekan

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

## Günlük Konuşma Formatı

Kullanıcı her gün geldiğinde:
1. Strava MCP ile son aktiviteyi kontrol et
2. Bugünkü planlanmış antrenmanı `src/data/workouts.ts` dosyasından bul
3. Dünkü antrenman yapıldı mı kontrol et
4. Günlük öneri ver

## Örnek Günlük Akış

```
Kullanıcı: Günaydın!

Claude:
1. [Strava'dan son aktiviteyi çek]
2. Dün: Sweet Spot 3x10dk - Tamamlandı ✅ / Atlandı ❌
3. Bugün: Z2 Endurance 60dk planlanmış
4. Öneri: [antrenman detayları]
```

## Önemli Notlar
- Ağırlık seansları azaltılıyor (2x → 1x/hafta)
- Bisiklet hacmi artıyor (5-6 saat → 8-10 saat)
- Sweet Spot ve Threshold antrenmanlar kritik
- Recovery haftalarına uyulmalı

## Strava MCP Kullanımı
- `mcp__strava__list_activities` - Son aktiviteler
- `mcp__strava__get_activity` - Aktivite detayı
- `mcp__strava__get_athlete_stats` - Genel istatistikler

## Motivasyon
Hedef agresif ama ulaşılabilir. Tutarlılık ve recovery dengesi kritik.
