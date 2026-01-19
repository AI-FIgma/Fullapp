# PWA Ikoniukių Instrukcijos

## 📱 Reikalingos ikoniukės:

Sukurkite šias ikoniukes ir patalpinkite į **ROOT folderį** (šalia `/App.tsx`):

### 1. **icon-192.png** (192x192 pikselių)
- Mažesnė ikoniukė (Android home screen)
- Rekomenduojamas dizainas: Šuns/katės letena su "PawConnect" tekstu

### 2. **icon-512.png** (512x512 pikselių)
- Didesnė ikoniukė (splash screen, iOS)
- Tas pats dizainas kaip 192px, tik aukštesnė rezoliucija

### 3. **screenshot1.png** (540x720 pikselių) - Opcinis
- Ekrano nuotrauka aplikacijos (rodoma App Store preview)

---

## 🎨 Kaip sukurti ikoniukes:

### Opcija A: Naudoti dizainerį
1. Samdyti Fiverr/99designs dizainerį (€10-30)
2. Paprašyti sukurti "mobile app icon for pet adoption"

### Opcija B: Naudoti AI įrankius
1. Eiti į **Canva** (nemokamai)
2. Sukurti 512x512px dizainą su App Icon template
3. Naudoti šuniuką/katytę + letenų simbolį
4. Eksportuoti PNG formato

### Opcija C: Naudoti Figma
1. Jei turi Figma dizainą, eksportuoti frames kaip PNG
2. Resize'inti į 192x192 ir 512x512

### Opcija D: Laikinas placeholder
Galima naudoti placeholder ikoniukes iš:
- Atsidaryk `/public/create-placeholder-icons.html` naršyklėje
- Spausk "Download" mygtukus
- Įkelk į **ROOT folderį**

---

## 📍 Kur talpinti:

```
/ (ROOT - šalia /App.tsx)
  ├── icon-192.png    ← ČIAA! (Privaloma)
  ├── icon-512.png    ← ČIAA! (Privaloma)
  └── screenshot1.png ← Opcinis
```

**⚠️ SVARBU:** Ikoniukės turi būti **ROOT folderyje**, **NE** `/public/` folderyje!

---

## ✅ Patikrinimas:

Po to kai sukursite ikoniukes:
1. Atsidarykite app telefone (Chrome/Safari)
2. Pasirinkite "Add to Home Screen"
3. Turėtumėte matyti savo ikoniuką!

---

## 🔧 Alternatyva (jei neturite dizaino dabar):

Galiu sukurti **text-based** placeholder ikoniukes su kodu (SVG → PNG).
Pasakyk jei nori šio varianto!