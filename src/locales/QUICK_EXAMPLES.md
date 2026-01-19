# 🚀 Quick Examples: Translation System

Real-world examples of how the translation system works.

---

## 📝 Example 1: Admin Creates "Birds" Category

### **Step-by-Step:**

```
┌────────────────────────────────────────────────────┐
│ 1️⃣ Admin navigates to Admin Panel                 │
└────────────────────────────────────────────────────┘

Admin clicks: Settings → Category Management
```

```tsx
┌────────────────────────────────────────────────────┐
│ 2️⃣ Admin fills the form                           │
└────────────────────────────────────────────────────┘

AdminCategoryManager Component:

🇱🇹 Lithuanian Name:
┌──────────────────┐
│ Paukščiai        │  ← Admin types in Lithuanian
└──────────────────┘

[Auto-translate to EN] ← Clicks this button

🇬🇧 English Name:
┌──────────────────┐
│ Birds            │  ← Automatically filled!
└──────────────────┘

Icon: 🐦
Color: #FFB74D

[ Create Category ]  ← Clicks save
```

```typescript
┌────────────────────────────────────────────────────┐
│ 3️⃣ System saves to database                       │
└────────────────────────────────────────────────────┘

// What gets saved:
{
  id: 'cat_1639234567890',
  translations: {
    en: 'Birds',
    lt: 'Paukščiai'
  },
  icon: '🐦',
  color: '#FFB74D',
  createdAt: '2024-12-12T10:30:00Z',
  createdBy: 'admin_123'
}
```

```
┌────────────────────────────────────────────────────┐
│ 4️⃣ Category appears EVERYWHERE instantly          │
└────────────────────────────────────────────────────┘

✅ Home feed filter
✅ Create Post dropdown
✅ Search filters
✅ Category list
✅ All translated correctly!
```

---

## 🔄 Example 2: Changing "Šuo" to "Šunelis"

### **Scenario:** You want to change "Dog" translation from "Šuo" to "Šunelis"

#### **Option A: Static Translation (UI element)**

```typescript
// 1. Open /locales/lt.ts
export const lt = {
  animals: {
    dog: 'Šuo',  // ← Change this line
  }
}

// 2. Change to:
export const lt = {
  animals: {
    dog: 'Šunelis',  // ← Updated!
  }
}

// 3. Save file
// ✅ DONE! All places using {t('animals.dog')} now show "Šunelis"
```

**Files that auto-update:**
- `CategoryFilter.tsx` → "Šunelis"
- `PostCard.tsx` → "Šunelis"
- `SearchBar.tsx` → "Šunelis"
- ... everywhere else using `{t('animals.dog')}`

---

#### **Option B: Dynamic Translation (Category)**

```
1. Admin opens AdminCategoryManager
2. Finds "Dogs" category
3. Clicks Edit button
4. Changes Lithuanian name: "Šuo" → "Šunelis"
5. Clicks Update

✅ DONE! All places using getDynamicTranslation() now show "Šunelis"
```

**Components that auto-update:**
- All category selectors
- All category badges
- All post listings
- ... everywhere the category is displayed

---

## 🌍 Example 3: User Switches Language

### **Scenario:** User changes from Lithuanian to English

```typescript
┌────────────────────────────────────────────────────┐
│ Before: Lithuanian (LT)                            │
└────────────────────────────────────────────────────┘

Header: 
┌──────────────────────────────────┐
│ 🔔 Pranešimai    📱 Nustatymai  │  ← Static (from lt.ts)
└──────────────────────────────────┘

Feed:
┌──────────────────────────────────┐
│ 🐕 Šunys                         │  ← Static
│ 🐦 Paukščiai                     │  ← Dynamic (from DB)
│ 🐰 Triušiai                      │  ← Dynamic (from DB)
└──────────────────────────────────┘

Post:
┌──────────────────────────────────┐
│ Pavadinimas: ...                 │  ← Static
│ Kategorija: 🐦 Paukščiai        │  ← Dynamic
│ [Skelbti]                        │  ← Static
└──────────────────────────────────┘
```

**User clicks 🌍 globe icon → Selects English**

```typescript
┌────────────────────────────────────────────────────┐
│ After: English (EN)                                │
└────────────────────────────────────────────────────┘

Header: 
┌──────────────────────────────────┐
│ 🔔 Notifications   📱 Settings   │  ← Auto-changed!
└──────────────────────────────────┘

Feed:
┌──────────────────────────────────┐
│ 🐕 Dogs                          │  ← Auto-changed!
│ 🐦 Birds                         │  ← Auto-changed!
│ 🐰 Rabbits                       │  ← Auto-changed!
└──────────────────────────────────┘

Post:
┌──────────────────────────────────┐
│ Title: ...                       │  ← Auto-changed!
│ Category: 🐦 Birds              │  ← Auto-changed!
│ [Post]                           │  ← Auto-changed!
└──────────────────────────────────┘
```

**What happened:**
1. User clicked language switcher
2. `localStorage` updated: `app_language = 'en'`
3. `useTranslation` hook detected change
4. All components re-rendered with English text
5. **Zero page reload! Instant!** ⚡

---

## 🎯 Example 4: New Component Translation

### **Scenario:** Adding translation to existing hardcoded component

**Before (hardcoded Lithuanian):**
```tsx
// BadgeCard.tsx
export function BadgeCard({ badge }) {
  return (
    <div>
      <h3>Pasiekimas atrakinta!</h3>
      <p>Sveikiname, gavote naują ženkliuką!</p>
      <button>Uždaryti</button>
    </div>
  );
}
```

**Step 1: Add to translation files**

```typescript
// /locales/en.ts
export const en = {
  // ... existing translations
  badges: {
    unlocked: 'Achievement unlocked!',
    congratulations: 'Congratulations, you got a new badge!',
  }
}

// /locales/lt.ts
export const lt = {
  // ... existing translations
  badges: {
    unlocked: 'Pasiekimas atrakinta!',
    congratulations: 'Sveikiname, gavote naują ženkliuką!',
  }
}
```

**Step 2: Update component**

```tsx
// BadgeCard.tsx
import { useTranslation } from '../utils/useTranslation';

export function BadgeCard({ badge }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <h3>{t('badges.unlocked')}</h3>
      <p>{t('badges.congratulations')}</p>
      <button>{t('common.close')}</button>
    </div>
  );
}
```

**Result:**
- ✅ Component now supports both languages
- ✅ Translations can be edited in one place
- ✅ No hardcoded text
- ✅ Type-safe (TypeScript checks keys)

---

## 🔥 Example 5: Auto-Translate API Call

### **Real implementation with DeepL:**

```typescript
// /utils/dynamicTranslations.ts

export async function autoTranslate(
  text: string,
  fromLang: Language,
  toLang: Language
): Promise<string> {
  const API_KEY = process.env.DEEPL_API_KEY;
  
  try {
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text,
        source_lang: fromLang.toUpperCase(),
        target_lang: toLang.toUpperCase(),
      }),
    });

    const data = await response.json();
    return data.translations[0].text;
  } catch (error) {
    console.error('Auto-translate error:', error);
    return text; // Fallback to original
  }
}
```

**Usage in AdminCategoryManager:**

```tsx
// User types in Lithuanian field
const [nameLt, setNameLt] = useState('Paukščiai');

// User clicks "Auto-translate to EN"
const handleAutoTranslate = async () => {
  const translated = await autoTranslate('Paukščiai', 'lt', 'en');
  // translated = "Birds"
  setNameEn(translated);
};
```

---

## 📊 Example 6: Database Query with Translations

### **Fetching categories from Supabase:**

```typescript
// Get all categories
const { data: categories } = await supabase
  .from('categories')
  .select('id, name_en, name_lt, icon, color')
  .order('created_at', { ascending: false });

// Transform to TranslatableContent format
const formattedCategories = categories.map(cat => ({
  id: cat.id,
  translations: {
    en: cat.name_en,
    lt: cat.name_lt,
  },
  icon: cat.icon,
  color: cat.color,
}));

// Display in UI
{formattedCategories.map(cat => (
  <div key={cat.id}>
    {cat.icon} {getDynamicTranslation(cat, currentLang)}
  </div>
))}
```

**Result:**
- EN user sees: 🐦 Birds
- LT user sees: 🐦 Paukščiai

---

## 🎨 Example 7: Full Create Post Flow

```tsx
import { useTranslation } from '../utils/useTranslation';
import { DynamicCategorySelector } from './DynamicCategorySelector';

export function CreatePost() {
  const { t, currentLang } = useTranslation();
  const [category, setCategory] = useState('');

  return (
    <div>
      {/* Page title - static translation */}
      <h1>{t('createPost.title')}</h1>
      
      {/* Form label - static translation */}
      <label>{t('post.title')}</label>
      <input placeholder={t('post.titlePlaceholder')} />
      
      {/* Category selector - dynamic + static mix */}
      <DynamicCategorySelector 
        value={category} 
        onChange={setCategory} 
      />
      
      {/* Submit button - static translation */}
      <button>{t('createPost.postButton')}</button>
    </div>
  );
}
```

**What user sees (Lithuanian):**
```
┌─────────────────────────────────┐
│ Sukurti įrašą                   │  ← t('createPost.title')
│                                 │
│ Pavadinimas:                    │  ← t('post.title')
│ ┌─────────────────────────────┐ │
│ │ Apie ką galvojate?          │ │  ← t('post.titlePlaceholder')
│ └─────────────────────────────┘ │
│                                 │
│ Kategorija:                     │  ← t('post.category')
│ ┌─────────────────────────────┐ │
│ │ 🐕 Šunys                    │ │  ← t('categories.dogs')
│ │ 🐈 Katės                    │ │  ← t('categories.cats')
│ │ 🐦 Paukščiai                │ │  ← getDynamicTranslation()
│ │ 🐰 Triušiai                 │ │  ← getDynamicTranslation()
│ └─────────────────────────────┘ │
│                                 │
│ [ Skelbti ]                     │  ← t('createPost.postButton')
└─────────────────────────────────┘
```

---

## ⚡ Example 8: Variable Replacement

```typescript
// Translation with variables:

// /locales/en.ts
createPost: {
  dailyLimit: 'Daily limit: {{current}}/{{max}} posts',
}

// /locales/lt.ts
createPost: {
  dailyLimit: 'Dieninis limitas: {{current}}/{{max}} įrašų',
}

// Component usage:
const { t } = useTranslation();

<p>{t('createPost.dailyLimit', { current: 3, max: 10 })}</p>

// Output:
// EN: "Daily limit: 3/10 posts"
// LT: "Dieninis limitas: 3/10 įrašų"
```

---

## 🎯 Summary: The Magic Formula

```typescript
┌─────────────────────────────────────────────────────┐
│                                                     │
│  1. Add translation to /locales/en.ts + lt.ts      │
│     OR                                              │
│     Create via AdminCategoryManager                 │
│                                                     │
│  2. Use in component:                               │
│     {t('key')} for static                          │
│     {getDynamicTranslation(item, lang)} for dynamic │
│                                                     │
│  3. Change ONCE → Updates EVERYWHERE! 🚀           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**That's it!** No need to search through 50 files to change a word. Change once, works everywhere! ✨

---

**See also:**
- `/locales/README_i18n.md` - Full i18n guide
- `/locales/README_DYNAMIC_TRANSLATIONS.md` - Dynamic content guide
- `/locales/TRANSLATION_FLOW_DIAGRAM.md` - Visual diagrams
