# ❓ Translation System FAQ

Frequently asked questions about the i18n (internationalization) system.

---

## 📋 General Questions

### **Q: What is this i18n system?**
**A:** It's a complete internationalization system that allows the app to work in multiple languages (English + Lithuanian). Users can switch languages instantly, and all text updates automatically.

---

### **Q: Do I need to restart the app when changing language?**
**A:** No! Language changes happen **instantly** without page reload. Just click the globe icon, select language, done.

---

### **Q: Where is the language preference saved?**
**A:** In browser's `localStorage` with key `app_language`. It persists across sessions.

---

## 🔧 For Developers

### **Q: How do I add a new translation key?**
**A:** 
```typescript
// 1. Add to /locales/en.ts
export const en = {
  myFeature: { title: 'Hello' }
}

// 2. Add to /locales/lt.ts
export const lt = {
  myFeature: { title: 'Labas' }
}

// 3. Use in component
{t('myFeature.title')}
```

---

### **Q: What if I only add translation to en.ts but forget lt.ts?**
**A:** TypeScript will show an error! The structure must match in both files. This prevents missing translations.

---

### **Q: How do I change existing translation?**
**A:**
```typescript
// 1. Open /locales/lt.ts
// 2. Find the key (Ctrl+F)
// 3. Change value
// 4. Save

export const lt = {
  common: {
    submit: 'Siųsti'  // Was 'Pateikti'
  }
}

// ✅ Updates everywhere automatically!
```

---

### **Q: Can I use translations in non-React files (utils, etc.)?**
**A:** Yes, but use the `translate()` function directly:
```typescript
import { translate, getCurrentLanguage } from '../utils/i18n';

const lang = getCurrentLanguage();
const text = translate('common.submit', lang);
```

---

### **Q: How do I handle plurals (1 dog vs 2 dogs)?**
**A:** Use variables:
```typescript
// Translation file:
dogs: '{{count}} dog(s)'

// Component:
{t('animals.dogs', { count: 5 })}
// Output: "5 dog(s)"

// For better plural handling, use conditional:
const dogText = count === 1 ? t('animals.dog') : t('animals.dogs');
```

---

## 👨‍💼 For Admins

### **Q: I created a new category. Why doesn't it appear in both languages?**
**A:** You must fill **both** English AND Lithuanian fields when creating a category. Use the "Auto-translate" button to help!

---

### **Q: How do I edit category translation later?**
**A:**
1. Go to Admin Panel → Category Management
2. Find the category
3. Click Edit
4. Change English or Lithuanian name
5. Click Update
✅ Changes appear everywhere instantly!

---

### **Q: What is "Auto-translate" button?**
**A:** It automatically translates from one language to another using translation API (DeepL, Google Translate). 

**Example:**
- You type Lithuanian: "Paukščiai"
- Click "Auto-translate to EN"
- English field fills: "Birds"

You can still edit if the translation isn't perfect!

---

### **Q: Do I need translation API to use the system?**
**A:** No! Auto-translate is **optional**. You can manually type both languages. The API just makes it faster.

---

## 🌍 For Users

### **Q: How do I change language?**
**A:** 
1. Click 🌍 globe icon in top-right header
2. Select language (English or Lietuvių)
3. Done! Instant change.

---

### **Q: Why do some words stay in English even in Lithuanian mode?**
**A:** Two reasons:
1. **Not translated yet** - Some components might not have translations added
2. **Proper nouns** - Names, brands stay same in all languages

---

### **Q: Can I suggest better translations?**
**A:** Yes! Contact the developers or admin. They can edit `/locales/lt.ts` file to improve translations.

---

## 🎯 Static vs Dynamic

### **Q: What's the difference between static and dynamic translations?**
**A:**

| Type | Static | Dynamic |
|------|--------|---------|
| **What** | UI elements | User content |
| **Examples** | Buttons, labels | Categories, tags |
| **Stored in** | Code files | Database |
| **Changed by** | Developers | Admins |
| **How** | Edit `/locales/*.ts` | Admin UI |

---

### **Q: When should I use static translations?**
**A:** For anything that's part of the **UI** and doesn't change:
- Buttons (Submit, Cancel, Delete)
- Navigation (Home, Forum, Settings)
- Labels (Title, Description, Category)
- Error messages

**Usage:** `{t('common.submit')}`

---

### **Q: When should I use dynamic translations?**
**A:** For anything **created by admins at runtime**:
- Categories (Dogs, Cats, Birds)
- Tags (Urgent, Question, Discussion)
- Custom fields

**Usage:** `{getDynamicTranslation(category, currentLang)}`

---

## 🐛 Troubleshooting

### **Q: Translation key shows instead of text (e.g., "common.submit")**
**A:** The key doesn't exist in translation file.

**Fix:**
1. Open `/locales/en.ts` and `/locales/lt.ts`
2. Add the missing key to BOTH files
3. Save

---

### **Q: TypeScript error: "Property 'x' does not exist"**
**A:** Structure mismatch between `en.ts` and `lt.ts`.

**Fix:**
Make sure the key exists in **both** files with **same structure**:
```typescript
// ✅ Correct
// en.ts: { common: { submit: 'Submit' } }
// lt.ts: { common: { submit: 'Pateikti' } }

// ❌ Wrong
// en.ts: { common: { submit: 'Submit' } }
// lt.ts: { common: { send: 'Siųsti' } }  ← Different key!
```

---

### **Q: Language doesn't persist after refresh**
**A:** Check:
1. Browser supports localStorage
2. Not in incognito/private mode
3. No browser extension blocking storage

**Debug:**
```javascript
console.log(localStorage.getItem('app_language'));
// Should show: 'en' or 'lt'
```

---

### **Q: New translation doesn't show up**
**A:** Try:
1. Hard refresh (Ctrl+Shift+R)
2. Clear browser cache
3. Check you saved the file
4. Check TypeScript compilation succeeded

---

## 💻 Technical

### **Q: How does the translation hook work?**
**A:**
```typescript
const { t, currentLang, changeLanguage } = useTranslation();

// t('key') - translate key to current language
// currentLang - current language code ('en' or 'lt')
// changeLanguage(lang) - change language
```

---

### **Q: Can I nest translation keys deeply?**
**A:** Yes! Use dot notation:
```typescript
// Translation:
{
  features: {
    forum: {
      posts: {
        create: 'Create Post'
      }
    }
  }
}

// Usage:
{t('features.forum.posts.create')}
```

**But don't overdo it! Max 3-4 levels recommended.**

---

### **Q: How do I handle dynamic variables?**
**A:**
```typescript
// Translation:
greeting: 'Hello, {{name}}!'
limit: '{{current}}/{{max}} posts'

// Usage:
{t('greeting', { name: 'John' })}
{t('limit', { current: 3, max: 10 })}

// Output:
// "Hello, John!"
// "3/10 posts"
```

---

### **Q: Can I use HTML in translations?**
**A:** No, translations are plain text. For HTML:
```tsx
// ❌ Won't work
translation: '<strong>Bold</strong>'

// ✅ Use components instead
<p>
  <strong>{t('common.important')}</strong>
  {t('common.message')}
</p>
```

---

### **Q: How big can translation files get?**
**A:** No practical limit, but recommend:
- Split into logical sections (common, post, admin)
- Keep under 1000 keys per file
- If larger, split into multiple files and merge

---

## 🚀 Production

### **Q: Do translation files affect bundle size?**
**A:** Yes, but minimal. Both `en.ts` and `lt.ts` are included in bundle (few KB).

**Optimization (future):**
- Code-split by language
- Load only selected language
- Use translation CDN

---

### **Q: How do I add a third language (e.g., Polish)?**
**A:**
1. Create `/locales/pl.ts`
2. Copy structure from `en.ts`
3. Translate all strings
4. Update `i18n.ts`:
   ```typescript
   import { pl } from '../locales/pl';
   const translations = { en, lt, pl };
   ```
5. Add to language list in `i18n.ts`

---

### **Q: Can users contribute translations?**
**A:** Yes! 
1. Set up GitHub repo
2. Accept pull requests to `/locales/lt.ts`
3. Review and merge
4. Deploy

Or use translation management platform (Lokalise, Crowdin).

---

### **Q: How do I handle right-to-left (RTL) languages?**
**A:** Current system doesn't support RTL (Arabic, Hebrew). For RTL:
1. Add `direction` to language config
2. Apply CSS: `dir="rtl"`
3. Mirror layouts

---

## 📊 Performance

### **Q: Does switching language cause re-render?**
**A:** Yes, but only components using `useTranslation()`. It's optimized and fast.

---

### **Q: Is translation lookup slow?**
**A:** No! It's O(1) object property access. Instant.

```typescript
// Internally:
translations[lang][key]
// Super fast!
```

---

## 🎨 Best Practices

### **Q: Should I translate numbers/dates?**
**A:** 
- **Numbers**: Usually no (1, 2, 3 universal)
- **Dates**: Yes! Use locale formatting:
  ```typescript
  const date = new Date().toLocaleDateString(
    currentLang === 'lt' ? 'lt-LT' : 'en-US'
  );
  ```

---

### **Q: How do I keep translations consistent?**
**A:**
1. Create style guide
2. Use translation memory
3. Review PRs carefully
4. Test in both languages

---

### **Q: Should I translate URLs/slugs?**
**A:** Usually no. Keep URLs in English for SEO:
```
✅ /forum/post/123
❌ /forumas/irasas/123
```

---

## 📖 Resources

### **Q: Where can I learn more?**
**A:**
- `/locales/README_i18n.md` - Full guide
- `/locales/README_DYNAMIC_TRANSLATIONS.md` - Admin content
- `/locales/QUICK_EXAMPLES.md` - Real examples
- `/locales/CHEAT_SHEET.md` - Quick reference
- `/locales/TRANSLATION_FLOW_DIAGRAM.md` - Visual diagrams

---

### **Q: Who do I contact for help?**
**A:**
- GitHub Issues (if open source)
- Team chat
- Documentation (this file!)

---

## 🎯 Quick Answers

**Q: Can I use emojis in translations?**  
**A:** Yes! 🎉 They work fine.

**Q: Are translations case-sensitive?**  
**A:** Keys are case-sensitive. Values preserve case.

**Q: Can I use special characters (ąčęė)?**  
**A:** Yes! UTF-8 supported.

**Q: Maximum translation length?**  
**A:** No limit, but keep UI-friendly (mobile screens small!).

**Q: Can I have spaces in keys?**  
**A:** No! Use camelCase: `myKey` not `my key`.

---

**Last Updated**: December 12, 2024  
**Can't find your question?** Check other docs in `/locales/` folder!
