# Dark History AI System — Vercel Ready

Готовий Next.js проєкт для деплою на Vercel без ручних правок коду.

## Що всередині
- Safe frontend (`components/DarkHistoryAISystem.jsx`)
- Secure backend API route (`pages/api/generate.js`)
- OpenAI key only on server via env
- Ready for Vercel deploy

## 1. Локальна перевірка
```bash
npm install
cp .env.example .env.local
```

В `.env.local` встав:
```env
OPENAI_API_KEY=your_real_key_here
```

Потім:
```bash
npm run dev
```

## 2. Деплой на Vercel
1. Завантаж цей проєкт у GitHub
2. У Vercel натисни **Add New → Project**
3. Обери GitHub репозиторій
4. Framework auto-detect: **Next.js**
5. У Project Settings → Environment Variables додай:
   - `OPENAI_API_KEY` = твій ключ
6. Натисни **Deploy**

## 3. Нічого вручну правити не треба
Проєкт уже містить:
- `vercel.json`
- `next.config.js`
- `pages/api/generate.js`
- `pages/index.js`

## 4. Важливо
Не додавай ключ у фронтенд.
Ключ має бути тільки:
- у `.env.local` локально
- у Vercel Environment Variables на проді

## 5. Endpoint
Frontend calls:
```bash
POST /api/generate
```

Body:
```json
{
  "topic": "buried alive true story",
  "mode": "pipeline",
  "duration": 50,
  "pastData": []
}
```


## 6. GitHub push commands

### Створи новий репозиторій на GitHub
Назва, наприклад:
`dark-history-ai-system`

### Потім у терміналі:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/dark-history-ai-system.git
git push -u origin main
```

Замініть `USERNAME` на свій GitHub username.

## 7. Після пушу
- зайди у Vercel
- натисни **Add New → Project**
- імпортуй цей GitHub repo
- додай `OPENAI_API_KEY`
- Deploy

## 8. Repo structure
```bash
components/
pages/
pages/api/
.env.example
.gitignore
next.config.js
vercel.json
README.md
package.json
```
