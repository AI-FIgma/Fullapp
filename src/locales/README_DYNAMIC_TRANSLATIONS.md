# 🌍 Dynamic Translations Guide

## Overview

This guide explains how to handle **user-generated content** translations (categories, tags, custom fields) that are created by admins at runtime.

---

## 📊 Two Types of Translations

### 1. **Static Translations** (UI Elements)
**Files:** `/locales/en.ts`, `/locales/lt.ts`

**Used for:**
- Buttons, labels, navigation
- Error messages
- UI components
- Fixed content

**Example:**
```typescript
// /locales/en.ts
common: {
  submit: 'Submit',
  cancel: 'Cancel',
}

// Component usage:
{t('common.submit')}
```

✅ **Change once** in `/locales/lt.ts` → Updates everywhere!

---

### 2. **Dynamic Translations** (User Content)
**Files:** Database + `/utils/dynamicTranslations.ts`

**Used for:**
- Admin-created categories
- Custom tags
- User-defined fields
- Any runtime content

**Example:**
```typescript
// Database record:
{
  id: 'cat_123',
  translations: {
    en: 'Birds',
    lt: 'Paukščiai'
  }
}

// Component usage:
{getDynamicTranslation(category, currentLang)}
```

✅ **Stored in database** with both languages  
✅ **Admin can edit** anytime  
✅ **Auto-translate** available

---

## 🎯 Problem & Solution

### **The Problem:**

Admin sukuria naują kategoriją "Paukščiai" (Birds):

❌ **Wrong approach:**
```typescript
// Adding to static translation files manually
// /locales/lt.ts
categories: {
  dogs: 'Šunys',
  cats: 'Katės',
  birds: 'Paukščiai',  // ← Admin negali pats pridėti!
}
```

**Why wrong:**
- Admin neturi prieigos prie code failų
- Reikia developer'io kad pridėti naują kategoriją
- Ne scalable

---

✅ **Correct approach:**
```typescript
// Admin creates via AdminCategoryManager component
// Data saved to database:
{
  id: 'cat_birds',
  translations: {
    en: 'Birds',
    lt: 'Paukščiai'
  },
  icon: '🐦',
  color: '#FFB74D'
}

// Component displays:
{getDynamicTranslation(category, currentLang)}
// Shows: "Birds" (EN) or "Paukščiai" (LT)
```

**Why correct:**
- Admin creates through UI (no coding)
- Saved to database immediately
- Appears in both languages
- Auto-translate helps admin

---

## 🔧 How to Use Dynamic Translations

### **Step 1: Database Schema**

```typescript
// Category table
interface Category {
  id: string;
  translations: {
    en: string;
    lt: string;
  };
  icon?: string;
  color?: string;
  createdAt: Date;
  createdBy: string;  // Admin user ID
}
```

### **Step 2: Admin Interface**

Use `AdminCategoryManager` component:

```tsx
import { AdminCategoryManager } from './components/AdminCategoryManager';

// In admin panel:
<AdminCategoryManager />
```

**Features:**
- ✅ Form with EN + LT inputs
- ✅ Auto-translate button
- ✅ Live preview
- ✅ Edit/Delete categories
- ✅ Validation (both languages required)

### **Step 3: Display in UI**

```tsx
import { getDynamicTranslation } from '../utils/dynamicTranslations';
import { useTranslation } from '../utils/useTranslation';

function CategoryList({ categories }) {
  const { currentLang } = useTranslation();
  
  return (
    <div>
      {categories.map(cat => (
        <div key={cat.id}>
          <span>{cat.icon}</span>
          <span>{getDynamicTranslation(cat, currentLang)}</span>
        </div>
      ))}
    </div>
  );
}
```

---

## 🤖 Auto-Translation

### **How it works:**

1. Admin įveda lietuvišką pavadinimą: **"Paukščiai"**
2. Spaudžia **"Auto-translate to EN"** mygtuką
3. Sistema išsiunčia į Translation API
4. Gauna atgal: **"Birds"**
5. Užpildo anglų lauką automatiškai

### **Implementation:**

```typescript
// /utils/dynamicTranslations.ts
export async function autoTranslate(
  text: string,
  fromLang: Language,
  toLang: Language
): Promise<string> {
  // Production: Call real API
  const response = await fetch('https://api.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: [text],
      source_lang: fromLang.toUpperCase(),
      target_lang: toLang.toUpperCase(),
    }),
  });
  
  const data = await response.json();
  return data.translations[0].text;
}
```

### **APIs you can use:**

1. **DeepL** (Best quality, paid)
   - https://www.deepl.com/pro-api
   - ~€20/month for 500k characters

2. **Google Cloud Translation** (Good quality, paid)
   - https://cloud.google.com/translate
   - $20 per 1M characters

3. **LibreTranslate** (Free, self-hosted)
   - https://libretranslate.com
   - Open source, can run locally

4. **MyMemory** (Free, limited)
   - https://mymemory.translated.net
   - 1000 requests/day free

---

## 📝 Admin Workflow

### **Creating New Category:**

1. Admin atidaro Admin Panel
2. Spaudžia **"Add Category"**
3. Įveda lietuvišką pavadinimą: **"Triušiai"**
4. Spaudžia **"Auto-translate to EN"** → gauna **"Rabbits"**
5. Gali edit jei netinka
6. Pasirenka icon: 🐰
7. Pasirenka spalvą: #FF9800
8. Spaudžia **"Create Category"**

✅ **Rezultatas:**
```json
{
  "id": "cat_1639234567890",
  "translations": {
    "en": "Rabbits",
    "lt": "Triušiai"
  },
  "icon": "🐰",
  "color": "#FF9800"
}
```

### **Category Appears Everywhere:**

```tsx
// Home.tsx - Category filter
<select>
  {categories.map(cat => (
    <option key={cat.id}>
      {cat.icon} {getDynamicTranslation(cat, currentLang)}
    </option>
  ))}
</select>

// Output:
// EN: 🐰 Rabbits
// LT: 🐰 Triušiai
```

---

## 🔄 Updating Translations

### **Admin wants to improve translation:**

1. Clicks **Edit** on category
2. Changes **"Triušiai"** → **"Triušiukai"**
3. Clicks **Update**

✅ **Updates everywhere instantly!**

---

## 💾 Database Integration

### **Mock (Current):**
```typescript
// /utils/dynamicTranslations.ts
export const dynamicTranslationStore = new DynamicTranslationStore();

// Save
await dynamicTranslationStore.save(id, { en: 'Birds', lt: 'Paukščiai' });

// Get
const category = await dynamicTranslationStore.get(id);
```

### **Production (Supabase example):**

```typescript
// Create category
const { data } = await supabase
  .from('categories')
  .insert({
    id: 'cat_123',
    name_en: 'Birds',
    name_lt: 'Paukščiai',
    icon: '🐦',
    color: '#FFB74D',
  })
  .single();

// Get categories
const { data: categories } = await supabase
  .from('categories')
  .select('*');

// Display
{categories.map(cat => (
  <div key={cat.id}>
    {currentLang === 'en' ? cat.name_en : cat.name_lt}
  </div>
))}
```

### **Database Schema (PostgreSQL):**

```sql
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_lt VARCHAR(100) NOT NULL,
  icon VARCHAR(10),
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT NOW(),
  created_by VARCHAR(50) REFERENCES users(id)
);

-- Index for faster lookups
CREATE INDEX idx_categories_created_at ON categories(created_at DESC);
```

### **Alternative: JSONB Column**

```sql
CREATE TABLE categories (
  id VARCHAR(50) PRIMARY KEY,
  translations JSONB NOT NULL,  -- {"en": "Birds", "lt": "Paukščiai"}
  icon VARCHAR(10),
  color VARCHAR(7)
);

-- Query in Lithuanian
SELECT 
  id,
  translations->>'lt' as name,
  icon,
  color
FROM categories;
```

---

## 🎨 UI Components

### **1. Admin Form (Creating):**

```tsx
<AdminCategoryManager />
```

**Features:**
- Dual language inputs (EN + LT)
- Auto-translate buttons
- Icon picker
- Color picker
- Live preview
- Validation

### **2. Category Display (User-facing):**

```tsx
function CategoryCard({ category }) {
  const { currentLang } = useTranslation();
  
  return (
    <div style={{ borderColor: category.color }}>
      <span>{category.icon}</span>
      <h3>{getDynamicTranslation(category, currentLang)}</h3>
    </div>
  );
}
```

### **3. Language-aware Dropdown:**

```tsx
function CategorySelector({ categories, value, onChange }) {
  const { currentLang } = useTranslation();
  
  return (
    <select value={value} onChange={onChange}>
      {categories.map(cat => (
        <option key={cat.id} value={cat.id}>
          {cat.icon} {getDynamicTranslation(cat, currentLang)}
        </option>
      ))}
    </select>
  );
}
```

---

## ✅ Best Practices

### **1. Always Require Both Languages**
```typescript
if (!validateTranslations(translations)) {
  alert('Both EN and LT required!');
  return;
}
```

### **2. Use Auto-translate as Helper, Not Truth**
```typescript
// Admin should always review auto-translation
const autoEn = await autoTranslate(nameLt, 'lt', 'en');
setFormData({ ...formData, nameEn: autoEn });  // ← Can edit!
```

### **3. Store Translations in Database, Not Code**
```typescript
// ❌ Wrong: Hardcoded
const categories = [
  { id: '1', name: currentLang === 'en' ? 'Dogs' : 'Šunys' }
];

// ✅ Correct: From database
const categories = await fetchCategories();
{getDynamicTranslation(category, currentLang)}
```

### **4. Fallback to English if Lithuanian Missing**
```typescript
export function getDynamicTranslation(content, lang) {
  return content.translations[lang] || content.translations.en || '';
}
```

---

## 🧪 Testing

### **Test Auto-translate:**

```tsx
// Current implementation uses mock
autoTranslate('Paukščiai', 'lt', 'en')
// Returns: "Birds"

autoTranslate('Custom Name', 'lt', 'en')
// Returns: "Custom Name [auto-en]"  ← Mock indicator
```

### **Test Category Creation:**

1. Open AdminCategoryManager
2. Enter: LT = "Žuvys", EN = "Fish"
3. Pick icon: 🐟
4. Save
5. Check it appears in category list
6. Switch language → see translation

---

## 🚀 Migration Path

### **Phase 1: Static Categories (Now)**
```typescript
// Hardcoded in /locales/en.ts
categories: {
  dogs: 'Dogs',
  cats: 'Cats',
}
```

### **Phase 2: Database Categories (Future)**
```typescript
// Dynamic from database
const categories = await supabase.from('categories').select('*');
{getDynamicTranslation(category, currentLang)}
```

### **Migration Script:**
```typescript
// Migrate hardcoded categories to database
const staticCategories = [
  { id: 'dogs', en: 'Dogs', lt: 'Šunys', icon: '🐕' },
  { id: 'cats', en: 'Cats', lt: 'Katės', icon: '🐈' },
];

for (const cat of staticCategories) {
  await supabase.from('categories').insert({
    id: cat.id,
    name_en: cat.en,
    name_lt: cat.lt,
    icon: cat.icon,
  });
}
```

---

## 📚 Summary

| Feature | Static Translations | Dynamic Translations |
|---------|-------------------|---------------------|
| **Storage** | `/locales/*.ts` files | Database |
| **Used for** | UI elements | User content |
| **Changed by** | Developers | Admins |
| **Example** | Buttons, labels | Categories, tags |
| **Auto-translate** | No (manual) | Yes (API) |
| **Editable at runtime** | No | Yes |

---

## 🎯 Key Takeaway

**Static UI = `/locales/*.ts`**  
(Submit, Cancel, etc.)

**Dynamic Content = Database + `getDynamicTranslation()`**  
(Admin-created categories, tags)

**Both work together seamlessly!** 🚀

---

**Documentation Updated:** December 12, 2024  
**See also:** `/locales/README_i18n.md` for static translations
