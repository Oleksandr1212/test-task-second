## Як запустити проект

### 1. Клонування та встановлення залежностей
```bash
git clone https://github.com/Oleksandr1212/test-task-second
cd test-task-second
npm install
```

### 2. Налаштування середовища
Створіть файл `.env.local` у корені проекту та додайте ваші ключі Firebase (можна скопіювати структуру з `.env.example`):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=ваш_ключ
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ваш_домен
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ваш_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ваш_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=ваш_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=ваш_app_id
```

### 3. Запуск у режимі розробки
```bash
npm run dev
```
Додаток буде доступний за адресою [http://localhost:3000](http://localhost:3000)

---

## Використані додаткові бібліотеки

- **Redux Toolkit**: Для глобального управління станом
- **lucide-react**: Набір сучасних та легких іконок
- **date-fns**: Бібліотека для роботи з датами 
- **react-hook-form + zod**:
  - **react-hook-form**: Для ефективного управління формами без зайвих ререндерів
  - **zod**: Для валідації схем даних
- **clsx / tailwind-merge**: Для комбінування CSS-класів

---

## Архітектура проекту

- **`/src/app`**: Нова структура Next.js App Router
- **`/src/components`**: Багаторазові UI-компоненти
- **`/src/hooks`**: Кастомні хуки для бізнес-логіки
- **`/src/lib`**: Конфігурації зовнішніх сервісів та API-функції
- **`/src/store`**: Глобальне сховище Redux

---

