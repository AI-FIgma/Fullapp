# 📋 Translation System Cheat Sheet

Quick reference for common translation tasks.

---

## 🚀 Quick Start

### **1. Use translation in component:**
```tsx
import { useTranslation } from '../utils/useTranslation';

function MyComponent() {
  const { t } = useTranslation();
  return <button>{t('common.submit')}</button>;
}
```

### **2. Add new translation:**
```typescript
// /locales/en.ts
myFeature: { title: 'Hello' }

// /locales/lt.ts
myFeature: { title: 'Labas' }

// Component:
{t('myFeature.title')}
```

### **3. Change language:**
```tsx
const { changeLanguage } = useTranslation();
changeLanguage('lt'); // Lithuanian
changeLanguage('en'); // English
```

---

## 📚 Common Patterns

### **Static UI Translations:**

```tsx
// Buttons
{t('common.submit')}
{t('common.cancel')}
{t('common.save')}
{t('common.delete')}

// Navigation
{t('nav.main')}
{t('nav.forum')}
{t('nav.explore')}

// Post actions
{t('post.createPost')}
{t('post.editPost')}
{t('post.comment')}
{t('post.share')}

// Categories
{t('categories.dogs')}
{t('categories.cats')}
{t('categories.general')}
```

### **Dynamic Content Translations:**

```tsx
import { getDynamicTranslation } from '../utils/dynamicTranslations';

// Display category
{getDynamicTranslation(category, currentLang)}

// Display tag
{getDynamicTranslation(tag, currentLang)}

// Display custom field
{getDynamicTranslation(customField, currentLang)}
```

### **Translations with Variables:**

```tsx
// Translation file:
dailyLimit: 'Limit: {{current}}/{{max}} posts'

// Component:
{t('createPost.dailyLimit', { current: 3, max: 10 })}
// Output: "Limit: 3/10 posts"
```

---

## 🔧 Common Tasks

### **Task: Change a word everywhere**

```
1. Open /locales/lt.ts
2. Find the key (Ctrl+F)
3. Change the value
4. Save
✅ Updates everywhere automatically!
```

### **Task: Add new UI text**

```typescript
// 1. Add to /locales/en.ts
export const en = {
  // ... existing
  mySection: {
    greeting: 'Welcome!',
    goodbye: 'See you later!',
  }
}

// 2. Add to /locales/lt.ts
export const lt = {
  // ... existing
  mySection: {
    greeting: 'Sveiki!',
    goodbye: 'Iki pasimatymo!',
  }
}

// 3. Use in component
const { t } = useTranslation();
<h1>{t('mySection.greeting')}</h1>
```

### **Task: Admin adds category**

```
1. Navigate to Admin Panel
2. Click "Add Category"
3. Fill form:
   - LT: "Žuvys"
   - Click "Auto-translate" → EN: "Fish"
   - Icon: 🐟
   - Color: #2196F3
4. Click "Create"
✅ Category appears everywhere in both languages!
```

### **Task: Get current language**

```tsx
const { currentLang } = useTranslation();

if (currentLang === 'lt') {
  // Show Lithuanian-specific content
}

// Display language name
const langName = currentLang === 'lt' ? 'Lietuvių' : 'English';
```

---

## 📖 Translation Key Structure

```
common.*          → Buttons, basic actions
nav.*             → Navigation labels
post.*            → Post-related text
createPost.*      → Create post page
moderation.*      → Moderation messages
categories.*      → Forum categories
profile.*         → User profile
notifications.*   → Notification text
settings.*        → Settings page
verification.*    → Verification system
reports.*         → Report system
banAppeals.*      → Ban appeals
admin.*           → Admin panel
poll.*            → Polls
time.*            → Time formatting
achievements.*    → Achievements
actions.*         → User actions
errors.*          → Error messages
```

---

## 🎨 Component Templates

### **Template: Basic Component**
```tsx
import { useTranslation } from '../utils/useTranslation';

export function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('myFeature.title')}</h1>
      <p>{t('myFeature.description')}</p>
      <button>{t('common.submit')}</button>
    </div>
  );
}
```

### **Template: Category Selector**
```tsx
import { useTranslation } from '../utils/useTranslation';

export function CategorySelect({ value, onChange }) {
  const { t } = useTranslation();
  
  return (
    <select value={value} onChange={onChange}>
      <option value="">{t('common.select')}</option>
      <option value="dogs">🐕 {t('categories.dogs')}</option>
      <option value="cats">🐈 {t('categories.cats')}</option>
    </select>
  );
}
```

### **Template: Dynamic Category List**
```tsx
import { useTranslation } from '../utils/useTranslation';
import { getDynamicTranslation } from '../utils/dynamicTranslations';

export function CategoryList({ categories }) {
  const { currentLang } = useTranslation();
  
  return (
    <div>
      {categories.map(cat => (
        <div key={cat.id}>
          {cat.icon} {getDynamicTranslation(cat, currentLang)}
        </div>
      ))}
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### **Problem: Translation not showing**

```tsx
// ❌ Wrong: Key doesn't exist
{t('my.missing.key')}  // Shows: "my.missing.key"

// ✅ Fix: Add to both translation files
// /locales/en.ts
my: { missing: { key: 'Value' } }

// /locales/lt.ts
my: { missing: { key: 'Vertė' } }
```

### **Problem: TypeScript error**

```typescript
// Error: Property 'newKey' does not exist

// ✅ Fix: Add to BOTH files
// The structure must match in en.ts and lt.ts

// /locales/en.ts
export const en = {
  newKey: 'New Value',
}

// /locales/lt.ts
export const lt = {
  newKey: 'Nauja vertė',
}
```

### **Problem: Language not persisting**

```typescript
// Check localStorage
console.log(localStorage.getItem('app_language'));

// Reset if needed
localStorage.setItem('app_language', 'lt');

// Force refresh
window.location.reload();
```

---

## ✅ Checklist: Adding Translation

```
□ Added key to /locales/en.ts
□ Added key to /locales/lt.ts (same structure!)
□ Imported useTranslation in component
□ Used {t('key')} in JSX
□ Tested in both languages (EN + LT)
□ No TypeScript errors
```

---

## 🎯 Quick Reference Table

| Task | Code |
|------|------|
| **Use translation** | `{t('common.submit')}` |
| **With variables** | `{t('key', { var: 'value' })}` |
| **Get language** | `const { currentLang } = useTranslation()` |
| **Change language** | `changeLanguage('lt')` |
| **Dynamic content** | `getDynamicTranslation(item, currentLang)` |
| **Add translation** | Edit `/locales/en.ts` + `/locales/lt.ts` |

---

## 📁 File Locations

```
/locales/en.ts                    → English translations
/locales/lt.ts                    → Lithuanian translations
/utils/i18n.ts                    → Translation utilities
/utils/useTranslation.ts          → React hook
/components/LanguageSwitcher.tsx  → Language selector UI
/utils/dynamicTranslations.ts     → Dynamic content utils
```

---

## 🔗 Documentation Links

- **Full i18n Guide**: `/locales/README_i18n.md`
- **Dynamic Content**: `/locales/README_DYNAMIC_TRANSLATIONS.md`
- **Visual Diagrams**: `/locales/TRANSLATION_FLOW_DIAGRAM.md`
- **Examples**: `/locales/QUICK_EXAMPLES.md`
- **This Cheat Sheet**: `/locales/CHEAT_SHEET.md`

---

## 💡 Pro Tips

1. **Always add to EN first** - It's the source of truth
2. **Use descriptive keys** - `post.title` not `pt`
3. **Group related items** - `post.*` for all post-related
4. **Test both languages** - Switch and verify UI
5. **Use auto-translate** - For admin content (categories)
6. **Keep translations short** - Mobile screens are small
7. **Consistent capitalization** - Follow language rules
8. **Check UI fit** - Lithuanian words can be longer

---

**Last Updated**: December 12, 2024  
**Quick access**: Press Ctrl+F to search this file
