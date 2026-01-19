# 🌍 i18n (Internationalization) System

## Overview

This application supports **multiple languages** with a flexible translation system that allows:
- ✅ **Auto-translation** - Base translations provided
- ✅ **Manual overrides** - Edit translations for better accuracy
- ✅ **Type-safe** - TypeScript ensures all keys exist
- ✅ **Persistent** - Language preference saved in localStorage
- ✅ **Real-time switching** - No page reload required

---

## 📁 File Structure

```
/locales/
  ├── en.ts              # English translations (default)
  ├── lt.ts              # Lithuanian translations
  └── README_i18n.md     # This file

/utils/
  ├── i18n.ts            # Core translation utilities
  └── useTranslation.ts  # React hook for components

/components/
  └── LanguageSwitcher.tsx  # Language selection UI
```

---

## 🚀 How to Use

### 1. **In Components**

```tsx
import { useTranslation } from '../utils/useTranslation';

export function MyComponent() {
  const { t, currentLang, changeLanguage } = useTranslation();

  return (
    <div>
      {/* Simple translation */}
      <button>{t('common.submit')}</button>
      
      {/* Translation with variables */}
      <p>{t('createPost.dailyLimit', { current: 5, max: 10 })}</p>
      
      {/* Current language */}
      <p>Current: {currentLang}</p>
      
      {/* Change language */}
      <button onClick={() => changeLanguage('lt')}>
        Switch to Lithuanian
      </button>
    </div>
  );
}
```

### 2. **Translation Keys**

Use **dot notation** to access nested translations:

```tsx
t('common.submit')        // "Submit" (EN) / "Pateikti" (LT)
t('nav.forum')            // "Forum" (EN) / "Forumai" (LT)
t('post.createPost')      // "Create Post" (EN) / "Sukurti įrašą" (LT)
```

### 3. **Variables in Translations**

Use `{{variableName}}` in translation strings:

**English:**
```ts
dailyLimit: 'Daily limit: {{current}}/{{max}} posts'
```

**Usage:**
```tsx
t('createPost.dailyLimit', { current: 3, max: 10 })
// Output: "Daily limit: 3/10 posts"
```

---

## 📝 Adding New Translations

### Step 1: Add to English (`/locales/en.ts`)

```ts
export const en = {
  // ... existing translations
  
  myNewFeature: {
    title: 'My Feature',
    description: 'This is a description',
    button: 'Click Me',
  },
} as const;
```

### Step 2: Add to Lithuanian (`/locales/lt.ts`)

```ts
export const lt = {
  // ... existing translations
  
  myNewFeature: {
    title: 'Mano Funkcija',
    description: 'Tai yra aprašymas',
    button: 'Spauskite mane',
  },
} as const;
```

### Step 3: Use in Components

```tsx
const { t } = useTranslation();

<h1>{t('myNewFeature.title')}</h1>
<p>{t('myNewFeature.description')}</p>
<button>{t('myNewFeature.button')}</button>
```

---

## 🎨 Language Switcher Component

### Compact Version (Icon with Dropdown)

```tsx
import { LanguageSwitcher } from './LanguageSwitcher';

<LanguageSwitcher variant="compact" />
```

**Features:**
- Globe icon button
- Dropdown menu with language options
- Shows current language with checkmark
- Perfect for headers/navigation

### Full Version (Settings Page)

```tsx
<LanguageSwitcher variant="full" />
```

**Features:**
- Full language selection UI
- Large flags and language names
- Detailed language info
- Perfect for Settings page

---

## 🔧 Translation Categories

### Current Translation Structure:

```ts
en = {
  common: { ... },           // Common UI (buttons, actions)
  nav: { ... },              // Bottom navigation
  post: { ... },             // Post-related text
  createPost: { ... },       // Create post page
  moderation: { ... },       // Moderation messages
  categories: { ... },       // Forum categories
  profile: { ... },          // User profile
  notifications: { ... },    // Notifications
  settings: { ... },         // Settings page
  verification: { ... },     // Verification system
  reports: { ... },          // Report system
  banAppeals: { ... },       // Ban appeals
  admin: { ... },            // Admin panel
  poll: { ... },             // Polls
  time: { ... },             // Time formatting
  achievements: { ... },     // Achievements
  actions: { ... },          // User actions
  errors: { ... },           // Error messages
}
```

---

## 🌐 Supported Languages

| Code | Language | Flag | Status |
|------|----------|------|--------|
| `en` | English | 🇬🇧 | ✅ Complete |
| `lt` | Lietuvių | 🇱🇹 | ✅ Complete |

### Adding a New Language

1. Create `/locales/[code].ts` (e.g., `pl.ts` for Polish)
2. Copy structure from `en.ts`
3. Translate all strings
4. Update `/utils/i18n.ts`:
   ```ts
   import { pl } from '../locales/pl';
   
   const translations: Record<Language, TranslationKeys> = {
     en,
     lt,
     pl, // Add new language
   };
   ```
5. Add to language list:
   ```ts
   export function getAvailableLanguages() {
     return [
       { code: 'en', name: 'English', flag: '🇬🇧' },
       { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
       { code: 'pl', name: 'Polski', flag: '🇵🇱' }, // Add new
     ];
   }
   ```

---

## 💡 Best Practices

### 1. **Always Add English First**
English is the source of truth. Add translations to `en.ts` before translating.

### 2. **Use Descriptive Keys**
```ts
// ❌ Bad
button1: 'Submit'

// ✅ Good
submit: 'Submit'
```

### 3. **Group Related Translations**
```ts
// ✅ Good organization
post: {
  title: 'Title',
  content: 'Content',
  create: 'Create Post',
  edit: 'Edit Post',
}
```

### 4. **Keep Variables Clear**
```ts
// Use clear variable names
dailyLimit: 'Daily limit: {{current}}/{{max}} posts'
```

### 5. **Test Both Languages**
Always test the app in both English and Lithuanian to ensure:
- Text fits in UI
- Grammar is correct
- Context makes sense

---

## 🔄 Translation Workflow

### For Developers:

1. **Write UI in English**
   ```tsx
   <button>Submit</button>
   ```

2. **Extract to translation file**
   ```ts
   // locales/en.ts
   common: { submit: 'Submit' }
   ```

3. **Use translation hook**
   ```tsx
   <button>{t('common.submit')}</button>
   ```

4. **Add Lithuanian translation**
   ```ts
   // locales/lt.ts
   common: { submit: 'Pateikti' }
   ```

### For Translators:

1. **Open `/locales/lt.ts`**
2. **Find the key you want to improve**
3. **Update the translation**
4. **Save and test**

**Example:**
```ts
// Before (auto-translated)
createPost: {
  title: 'Sukurti Įrašą',
}

// After (improved)
createPost: {
  title: 'Sukurti įrašą', // Better capitalization
}
```

---

## 🐛 Troubleshooting

### Translation Not Showing?

1. **Check if key exists in both `en.ts` and `lt.ts`**
2. **Check spelling** (case-sensitive)
3. **Restart dev server** if you just added new translations

### Language Not Persisting?

- Check browser localStorage: `app_language` key
- Clear localStorage and try again
- Check browser console for errors

### TypeScript Errors?

- Make sure both `en.ts` and `lt.ts` have identical structure
- Run type check: all keys must exist in both files

---

## 📊 Translation Coverage

### Current Status:

- **Bottom Navigation**: ✅ Fully translated
- **Forum Header**: ✅ Fully translated
- **Create Post**: ⏳ Partially translated
- **Profile**: ⏳ Partially translated
- **Settings**: ⏳ Partially translated
- **Admin Panel**: ⏳ Not yet translated

### To Translate a Component:

1. Identify all hardcoded strings
2. Add them to `/locales/en.ts`
3. Translate to Lithuanian in `/locales/lt.ts`
4. Replace hardcoded strings with `t('key')`
5. Test in both languages

---

## 🎯 Migration Guide

### Converting Existing Components:

**Before:**
```tsx
export function MyComponent() {
  return (
    <div>
      <h1>Pagrindinis</h1>
      <button>Pateikti</button>
    </div>
  );
}
```

**After:**
```tsx
import { useTranslation } from '../utils/useTranslation';

export function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('nav.main')}</h1>
      <button>{t('common.submit')}</button>
    </div>
  );
}
```

---

## 📚 Resources

- **English Translations**: `/locales/en.ts`
- **Lithuanian Translations**: `/locales/lt.ts`
- **i18n Utilities**: `/utils/i18n.ts`
- **React Hook**: `/utils/useTranslation.ts`
- **Language Switcher**: `/components/LanguageSwitcher.tsx`

---

**Status**: 🚀 Active Development  
**Last Updated**: December 12, 2024  
**Supported Languages**: English (EN), Lithuanian (LT)
