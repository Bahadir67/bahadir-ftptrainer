# FTP Trainer - Kurulum Kılavuzu

Kişisel bisiklet antrenörü sistemi - Claude Desktop ile tam entegrasyon.

---

## 📋 GEREKSINIMLER

### Hesaplar
- [ ] **Strava** hesabı (ücretsiz)
- [ ] **Garmin Connect** hesabı (ücretsiz)
- [ ] **GitHub** hesabı (ücretsiz)
- [ ] **Vercel** hesabı (ücretsiz)
- [ ] **Claude Desktop** (https://claude.ai/download)

### Yazılımlar
- [ ] **Node.js** 20+ (https://nodejs.org/)
- [ ] **Git** (https://git-scm.com/)
- [ ] **Python** 3.11+ (Garmin MCP için)
- [ ] **uv** (Python paket yöneticisi)

---

## 🚀 KURULUM ADIMLARI

### 1. Projeyi Kopyala

```bash
# GitHub'dan fork et
1. https://github.com/Bahadir67/bahadir-ftptrainer sayfasına git
2. Sağ üstte "Fork" butonuna tıkla
3. Kendi hesabına fork'la

# Bilgisayarına klonla
git clone https://github.com/SENIN-KULLANICI-ADIN/bahadir-ftptrainer.git
cd bahadir-ftptrainer
```

### 2. Kişiselleştir

#### `src/data/workouts.ts` Dosyasını Düzenle

```typescript
// Kendi bilgilerinle değiştir
export const FTP_CURRENT = 220;  // Senin mevcut FTP'n
export const FTP_TARGET = 250;   // Hedef FTP
export const PLAN_START = '2025-12-13';  // Başlangıç tarihi
export const PLAN_END = '2026-03-07';    // Bitiş tarihi
```

#### `CLAUDE.md` Dosyasını Düzenle

```markdown
## Sporcu Profili
| Bilgi | Değer |
|-------|-------|
| İsim | SENIN ADIN |
| Başlangıç FTP | SENIN FTP'N |
| Hedef FTP | HEDEF FTP |
| ...
```

### 3. Vercel'e Deploy Et

```bash
# Vercel CLI kur
npm install -g vercel

# Login ol
vercel login

# Deploy et
vercel --prod
```

Vercel URL'ini not et: `https://SENIN-PROJE-ADIN.vercel.app`

---

## 🔧 MCP SUNUCULARI KURULUMU

### A. Strava MCP

#### 1. Strava API Bilgilerini Al

1. https://www.strava.com/settings/api adresine git
2. "Create App" tıkla
3. Bilgileri doldur:
   - **Application Name**: FTP Trainer
   - **Website**: `http://localhost`
   - **Authorization Callback**: `http://localhost`
4. **Client ID** ve **Client Secret**'i not et

#### 2. OAuth Token Al

```bash
# Tarayıcıda aç (CLIENT_ID'yi değiştir):
https://www.strava.com/oauth/authorize?client_id=SENIN_CLIENT_ID&response_type=code&redirect_uri=http://localhost&approval_prompt=force&scope=read,activity:read_all

# URL'den "code" parametresini kopyala
```

```bash
# Token al (PowerShell veya Terminal):
curl -X POST https://www.strava.com/oauth/token \
  -d client_id=SENIN_CLIENT_ID \
  -d client_secret=SENIN_CLIENT_SECRET \
  -d code=ALDIĞIN_CODE \
  -d grant_type=authorization_code
```

**access_token** ve **refresh_token**'ı not et.

#### 3. Strava MCP'yi Kur

```bash
# Proje dizini oluştur
mkdir C:\Project1\StaravaMCP
cd C:\Project1\StaravaMCP

# NPM projesi oluştur
npm init -y
npm install @modelcontextprotocol/sdk axios
```

**`src/index.ts`** dosyasını oluştur:
- Bu repo'daki `C:\Project1\StaravaMCP\src\index.ts` dosyasını kopyala

```bash
# TypeScript derle
npm install -g typescript
tsc --init
npm run build
```

---

### B. Garmin MCP

#### 1. Garmin MCP'yi Kur

```bash
# uv kur (Windows PowerShell - Admin):
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Proje dizini oluştur
mkdir C:\Project1\GarminMCP
cd C:\Project1\GarminMCP

# GitHub'dan klonla
git clone https://github.com/eddmann/garmin-connect-mcp.git .

# Bağımlılıkları kur
uv sync
```

#### 2. Garmin Credentials Ekle

**`.env`** dosyası oluştur:

```env
GARMIN_EMAIL=senin-email@gmail.com
GARMIN_PASSWORD=senin-garmin-sifresi
```

---

### C. GitHub MCP

#### 1. GitHub Personal Access Token Al

1. https://github.com/settings/tokens adresine git
2. "Generate new token (classic)" tıkla
3. **Scope**: `repo` (full control) seç
4. Token'ı kopyala ve not et

---

## 🖥 CLAUDE DESKTOP YAPISI

### 1. Config Dosyasını Oluştur

**Dosya Yolu**:
- **Windows**: `C:\Users\KULLANICI_ADIN\AppData\Roaming\Claude\claude_desktop_config.json`
- **Mac**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**İçerik**:

```json
{
  "mcpServers": {
    "strava": {
      "command": "node",
      "args": ["C:\\Project1\\StaravaMCP\\dist\\index.js"],
      "env": {
        "DOTENV_CONFIG_QUIET": "true",
        "STRAVA_CLIENT_ID": "SENIN_CLIENT_ID",
        "STRAVA_CLIENT_SECRET": "SENIN_CLIENT_SECRET",
        "STRAVA_ACCESS_TOKEN": "SENIN_ACCESS_TOKEN",
        "STRAVA_REFRESH_TOKEN": "SENIN_REFRESH_TOKEN"
      }
    },
    "garmin": {
      "command": "uv",
      "args": ["run", "--directory", "C:\\Project1\\GarminMCP", "garmin-connect-mcp"]
    },
    "github": {
      "command": "C:\\Program Files\\nodejs\\npx.cmd",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "SENIN_GITHUB_TOKEN"
      }
    }
  }
}
```

> **Mac kullanıcıları** için `command` yollarını değiştirin:
> - `"command": "node"` → `which node` ile bul
> - `"command": "npx"` → `which npx` ile bul

### 2. Claude Desktop Projesini Oluştur

1. Claude Desktop'ı aç
2. Sol menüden **"Projects"** → **"+ New Project"**
3. İsim: **"FTP Trainer"**
4. **"Add content"** → **"Add folder"**
5. Klonladığın projeyi seç: `C:\...\bahadir-ftptrainer`
6. Kaydet

---

## ✅ TEST ET

### 1. MCP Sunucularını Test Et

Claude Desktop'ı **tamamen kapat ve yeniden aç**.

Yeni sohbet aç ve yaz:

```
Strava'dan son 3 aktivitemi getir
```

Çalışıyorsa ✅

```
Garmin'den dünkü uyku verilerimi getir
```

Çalışıyorsa ✅

### 2. Antrenör Sistemini Test Et

FTP Trainer projesine gir, yaz:

```
Günaydın, bugün [BUGÜNÜN TARİHİ]
```

**Beklenen çıktı**:
- 📊 Recovery analizi
- 🏋️ Son aktiviteler
- 📋 Bugünkü plan
- 💡 Öneri ve seçenekler

---

## 🎯 GÜNLÜK KULLANIM

Her sabah Claude Desktop'ta FTP Trainer projesini aç:

```
Günaydın, bugün 15 Aralık
```

Claude:
1. Planı kontrol eder
2. Strava aktivitelerini çeker
3. Garmin recovery verilerini alır
4. Değerlendirme yapar
5. Öneri sunar

Plan değişikliği önerirse:
- Nedenlerini açıklar
- Senin onayını ister
- Onaylarsan GitHub'a commit atar → Vercel otomatik deploy eder

---

## 🆘 SORUN GİDERME

### Strava MCP bağlanmıyor

```bash
# Token'ı manuel yenile:
cd C:\Project1\StaravaMCP
node
> // Token yenileme kodu çalıştır
```

### Garmin MCP hatası

```bash
# Credentials kontrol et:
cd C:\Project1\GarminMCP
cat .env

# Yeniden kur:
uv sync
```

### GitHub MCP bağlanmıyor

- Token scope'unu kontrol et (`repo` olmalı)
- `npx` yolunu kontrol et (`where npx`)

### Vercel deploy hatası

```bash
# Logs kontrol et:
vercel logs

# Yeniden deploy:
vercel --prod --force
```

---

## 📚 EK KAYNAKLAR

- **Strava API Docs**: https://developers.strava.com/
- **Garmin Connect API**: https://github.com/eddmann/garmin-connect-mcp
- **GitHub MCP**: https://github.com/github/github-mcp-server
- **Claude Desktop**: https://claude.ai/download
- **MCP Protocol**: https://modelcontextprotocol.io/

---

## 🤝 DESTEK

Sorun yaşarsan:

1. Bu repo'nun Issues bölümüne yaz
2. CLAUDE.md'de detaylı prompt var - okumayı unutma
3. MCP sunucularını teker teker test et

---

## 📄 LİSANS

MIT License - Kendi projen için özgürce kullan, değiştir, paylaş!

---

**Hazırlayan**: Claude Code + Eylül
**Versiyon**: 1.0
**Tarih**: Aralık 2025
