# 📱 PWA DEPLOYMENT INSTRUKCIJA - NAUDOKITE SAVO LOGOTIPĄ!

## ✅ SVARBU! Kaip paruošti PWA su JŪSŲ logotipu

### 🎯 TIKSLAS:
Telefone matysite **JŪSŲ tikrą logotipą** (šuo + katė), NE emoji!

---

## 📋 ŽINGSNIAI PO DEPLOYMENT:

### 1️⃣ **DEPLOY Į VERCEL/NETLIFY**
- Dabar jūsų app veikia be HTTP klaidų ✅
- PWA manifest sukonfigūruotas ✅
- BET - reikia pridėti jūsų logotipą!

### 2️⃣ **PRIDĖKITE LOGOTIPĄ Į /public DIREKTORIJĄ**

Jums reikia 2 failų:

```
/public/icon-192.png  ← Jūsų logotipas 192x192px
/public/icon-512.png  ← Jūsų logotipas 512x512px
```

**KAIP:**

#### A) Per Vercel Dashboard:
1. Eikite į jūsų Vercel projektą
2. Settings → Storage (arba tiesiog atidarykite projekto failų sistemą)
3. Nukopijuokite jūsų logotipą 2 kartus su skirtingais dydžiais:
   - `icon-192.png` (192x192 pikselių)
   - `icon-512.png` (512x512 pikselių)

#### B) Per Git Repo:
1. Atidarykite jūsų GitHub/GitLab repo
2. Įkelkite 2 failus į `/public` direktoriją:
   - `/public/icon-192.png`
   - `/public/icon-512.png`
3. Commit ir push
4. Vercel automatiškai re-deploy'ins

#### C) Naudojant Image Resize Tool:
1. Atidarykite jūsų logotipą (šuo + katė failą)
2. Resize į 192x192px → išsaugokite kaip `icon-192.png`
3. Resize į 512x512px → išsaugokite kaip `icon-512.png`
4. Upload abu failus į `/public` direktoriją

---

### 3️⃣ **PATIKRINKITE AR VEIKIA**

Po deployment:

1. **Atidarykite Chrome DevTools**
   - Spauskite F12
   - Eikite į "Application" tab
   - Kairėje pusėje: "Manifest"
   - Turėtumėte matyti JŪSŲ logotipą! ✅

2. **Telefone:**
   - Atidarykite `https://jūsų-app.vercel.app`
   - Android: "Add to Home screen"
   - iPhone: Safari → Share → "Add to Home Screen"
   - **TURĖTUMĖTE MATYTI JŪSŲ LOGOTIPĄ!** 🎉

---

## 🔍 TROUBLESHOOTING:

### Jei nematote logotipo:

**1. Patikrinkite ar failai egzistuoja:**
```
https://jūsų-app.vercel.app/icon-192.png
https://jūsų-app.vercel.app/icon-512.png
```

Jei šie URL neveikia - failai nebuvo įkelti teisingai.

**2. Patikrinkite failo pavadinimus:**
- TURI būti tiksliai: `icon-192.png` ir `icon-512.png`
- Ne `Icon-192.png` ar `icon_192.png` ar `logo-192.png`

**3. Patikrinkite failo dydžius:**
- `icon-192.png` turi būti 192x192 pikselių
- `icon-512.png` turi būti 512x512 pikselių

**4. Clear Cache:**
- Telefone: Settings → Apps → Chrome → Clear Data
- Arba tiesiog bandykite "Incognito" režimu

---

## 🚀 REZULTATAS:

```
📱 JŪSŲ TELEFONAS:

┌─────┐
│ [Jūsų logotipas] │  ← Šuo + Katė!
└─────┘
PawConnect
```

**Tap** → Atsidaro jūsų app fullscreen! 🎉

---

## 💡 PATARIMAI:

1. **Logotipas turėtų būti kvadratinis** (1:1 aspect ratio)
2. **PNG formatas** (su skaidriu fonu arba baltu fonu)
3. **Aukšta kokybė** (ne pixelated)
4. **Jei logotipas turi baltą foną** - telefone atrodys gerai
5. **Jei logotipas turi skaidrų foną** - Android pridės savo foną

---

## ❓ KLAUSIMAI?

Jei kažkas neveikia, parašykite man ir aš padėsiu! ✅
