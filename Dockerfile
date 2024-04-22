# Используем базовый образ Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы
COPY . .

# Компилируем TypeScript
RUN npm run build

# Указываем порт, который будет использоваться приложением
EXPOSE 3000

# Команда для запуска приложения
CMD ["npm", "start"]
