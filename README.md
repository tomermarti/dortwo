# דף נחיתה למכירת קרקע בתל אביב

דף נחיתה מקצועי בעברית (RTL) למכירת קרקע בתל אביב עם אינטגרציה ל-Monday.com ופוטר צף ללידים.

## תכונות

- ✅ עיצוב מקצועי בעברית עם תמיכה מלאה ב-RTL
- ✅ פוטר צף עם טופס לידים וכפתור התקשרות
- ✅ אינטגרציה ל-Monday.com להזרמת לידים
- ✅ עיצוב רספונסיבי למובייל ודסקטופ
- ✅ אנימציות ואפקטים ויזואליים מתקדמים
- ✅ SEO מותאם לעברית

## התקנה

1. התקן את התלויות:
```bash
npm install
```

2. העתק את קובץ הסביבה:
```bash
cp env.example .env.local
```

3. הגדר את המשתנים ב-.env.local:
```
MONDAY_API_KEY=your_monday_api_key
MONDAY_BOARD_ID=your_board_id
```

4. הרץ את השרת המקומי:
```bash
npm run dev
```

## פריסה ב-Vercel

1. התחבר ל-Vercel:
```bash
npx vercel login
```

2. פרוס את הפרויקט:
```bash
npx vercel --prod
```

3. הגדר משתני סביבה ב-Vercel Dashboard:
   - `MONDAY_API_KEY`
   - `MONDAY_BOARD_ID`

## הגדרת Monday.com

1. צור חשבון ב-Monday.com
2. צור לוח חדש עבור לידים
3. הוסף עמודות: שם, טלפון, אימייל, מקור, סטטוס
4. קבל את ה-API Key מההגדרות
5. קבל את מזהה הלוח מה-URL

## התאמה אישית

### שינוי מחיר הקרקע
ערוך את הקובץ `app/page.tsx` ושנה את השורה:
```tsx
<div className="price">849,000 ש״ח</div>
```

### שינוי מספר טלפון
ערוך את הקובץ `app/page.tsx` ושנה את:
```tsx
window.location.href = 'tel:+972501234567'
```

### שינוי צבעים ועיצוב
ערוך את הקובץ `app/globals.css` לשינוי הצבעים והעיצוב.

## מבנה הפרויקט

```
├── app/
│   ├── api/
│   │   └── submit-lead/
│   │       └── route.ts          # API endpoint ללידים
│   ├── globals.css               # סגנונות כלליים
│   ├── layout.tsx               # Layout ראשי
│   └── page.tsx                 # דף הבית
├── package.json
├── next.config.js
├── tsconfig.json
├── vercel.json                  # הגדרות Vercel
└── README.md
```

## תמיכה

לשאלות או בעיות, פנו אלינו בטלפון: 050-123-4567